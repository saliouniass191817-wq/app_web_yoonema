<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentService
{
    public function initiateCinetPay(Order $order): array
    {
        $transactionId = $order->payment_reference ?: (string) Str::uuid();
        $amount = (float) $order->total_amount + (float) $order->delivery_fee_student;

        $payload = [
            'apikey' => config('services.cinetpay.api_key'),
            'site_id' => config('services.cinetpay.site_id'),
            'transaction_id' => $transactionId,
            'amount' => (int) round($amount),
            'currency' => 'XOF',
            'description' => 'Commande Yoonema '.$order->id,
            'return_url' => rtrim((string) config('app.frontend_url', env('FRONTEND_URL')), '/').'/orders/'.$order->id,
            'notify_url' => rtrim((string) config('app.url'), '/').'/api/v1/payments/cinetpay/webhook',
            'customer_name' => $order->student?->name ?? 'Client Yoonema',
            'customer_email' => $order->student?->email,
            'customer_phone_number' => $order->student?->phone,
        ];

        $response = Http::acceptJson()
            ->timeout(20)
            ->post((string) config('services.cinetpay.payment_url', 'https://api-checkout.cinetpay.com/v2/payment'), $payload);

        if (! $response->successful()) {
            throw new \RuntimeException('Impossible de démarrer le paiement. Réessayez dans un instant.');
        }

        $data = $response->json();
        $paymentUrl = data_get($data, 'data.payment_url') ?: data_get($data, 'payment_url');

        if (! $paymentUrl) {
            throw new \RuntimeException('Lien de paiement indisponible.');
        }

        $order->update([
            'payment_method' => 'cinetpay',
            'payment_reference' => $transactionId,
            'payment_status' => 'pending',
        ]);

        return [
            'payment_url' => $paymentUrl,
            'transaction_id' => $transactionId,
        ];
    }

    public function verifyCinetPay(string $transactionId): array
    {
        $response = Http::acceptJson()
            ->timeout(20)
            ->post((string) config('services.cinetpay.verify_url', 'https://api-checkout.cinetpay.com/v2/payment/check'), [
                'apikey' => config('services.cinetpay.api_key'),
                'site_id' => config('services.cinetpay.site_id'),
                'transaction_id' => $transactionId,
            ]);

        if (! $response->successful()) {
            return ['status' => 'failed', 'amount' => 0];
        }

        $data = $response->json();
        $paymentStatus = strtolower((string) (data_get($data, 'data.status') ?: data_get($data, 'status')));

        return [
            'status' => in_array($paymentStatus, ['accepted', 'paid', 'success'], true) ? 'paid' : 'failed',
            'amount' => (float) (data_get($data, 'data.amount') ?: data_get($data, 'amount', 0)),
        ];
    }

    public function processRefund(Order $order, float $amount, string $reason): bool
    {
        if ($order->payment_status !== 'paid') {
            return true;
        }

        $order->update(['payment_status' => 'refunded']);

        return true;
    }

    public function calculateSplit(Order $order): array
    {
        $subtotal = collect($order->items ?? [])->sum(fn ($item) => ((float) ($item['price'] ?? 0)) * ((int) ($item['quantity'] ?? 1)));
        $quantity = collect($order->items ?? [])->sum(fn ($item) => (int) ($item['quantity'] ?? 1));
        $commission = round($subtotal * (float) config('yoonema.commission_rate', 0.09), 2);
        $deliveryFeeStudent = round($quantity * (float) config('yoonema.delivery_fee_per_unit', 200), 2);

        return [
            'subtotal' => round($subtotal, 2),
            'platform_commission' => $commission,
            'vendor_amount' => round($subtotal - $commission, 2),
            'delivery_fee_student' => $deliveryFeeStudent,
            'delivery_fee_platform' => round($deliveryFeeStudent * (float) config('yoonema.delivery_fee_platform_rate', 1), 2),
        ];
    }
}
