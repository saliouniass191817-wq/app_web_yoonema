<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\NotificationService;
use App\Services\PaymentService;
use App\Services\SupabaseSyncService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PaymentController extends Controller
{
    use ApiResponse;

    public function initiate(Request $request, Order $order, PaymentService $payments): JsonResponse
    {
        if ($order->student_id !== $request->user()->id) {
            return $this->error('Accès refusé à cette commande.', 403);
        }

        $method = $request->input('payment_method', 'cinetpay');

        if ($method !== 'cinetpay') {
            return $this->error('Seul CinetPay est disponible pour le moment.', 422);
        }

        if ($order->payment_status === 'paid') {
            return $this->success(['order' => new OrderResource($order)], 'Cette commande est déjà payée.');
        }

        $session = DB::transaction(function () use ($payments, $order, $method) {
            $session = $payments->initiateCinetPay($order);
            $order->update(['payment_method' => $method]);
            app(SupabaseSyncService::class)->syncOrder($order->fresh());

            return $session;
        });

        return $this->success($session, 'Paiement démarré.');
    }

    public function status(Request $request, Order $order): JsonResponse
    {
        if ($order->student_id !== $request->user()->id) {
            return $this->error('Accès refusé à cette commande.', 403);
        }

        return $this->success([
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'paid_at' => $order->paid_at,
        ], 'Statut du paiement récupéré.');
    }

    public function cinetpayWebhook(Request $request, PaymentService $payments, NotificationService $notifications): JsonResponse
    {
        $transactionId = $request->input('transaction_id') ?: $request->input('cpm_trans_id');

        if (! $transactionId) {
            return $this->error('Référence de paiement manquante.', 422);
        }

        if (! $this->hasValidSignature($request)) {
            return $this->error('Signature de paiement invalide.', 403);
        }

        $order = Order::query()->where('payment_reference', $transactionId)->firstOrFail();
        $verification = $payments->verifyCinetPay($transactionId);

        if ($verification['status'] === 'paid' && ! $this->amountMatchesOrder($order, (float) $verification['amount'])) {
            return $this->error('Montant de paiement invalide.', 422);
        }

        DB::transaction(function () use ($order, $verification, $notifications) {
            $order->update([
                'payment_status' => $verification['status'],
                'paid_at' => $verification['status'] === 'paid' ? now() : null,
            ]);

            $order = $order->fresh();

            if ($verification['status'] === 'paid') {
                $order->load('restaurant');
                $notifications->notifyUser(
                    $order->restaurant->owner_id,
                    'Nouvelle commande payée',
                    'Une nouvelle commande payée attend votre validation.',
                    $order->id
                );
            }

            app(SupabaseSyncService::class)->syncOrder($order);
        });

        return $this->success(['order' => new OrderResource($order->fresh())], 'Paiement traité.');
    }

    private function amountMatchesOrder(Order $order, float $paidAmount): bool
    {
        $expected = (float) $order->total_amount + (float) ($order->delivery_fee_student ?? $order->delivery_fee ?? 0);

        if ($paidAmount <= 0) {
            return true;
        }

        return abs($paidAmount - $expected) < 1;
    }

    private function hasValidSignature(Request $request): bool
    {
        $secret = config('services.cinetpay.secret');
        $signature = $request->header('X-CinetPay-Signature') ?: $request->input('signature');

        if (! $secret) {
            return app()->environment('local', 'testing');
        }

        if (! $signature) {
            return false;
        }

        $transactionId = $request->input('transaction_id') ?: $request->input('cpm_trans_id');

        return Hash::check(hash_hmac('sha256', (string) $transactionId, (string) $secret), $signature)
            || hash_equals(hash_hmac('sha256', (string) $transactionId, (string) $secret), (string) $signature);
    }
}
