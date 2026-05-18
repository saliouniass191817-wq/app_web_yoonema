<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\SupabaseSyncService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return $this->success(NotificationResource::collection($notifications), 'Notifications récupérées.');
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return $this->success(['count' => $count], 'Nombre de notifications non lues.');
    }

    public function markRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return $this->error('Accès refusé.', 403);
        }

        $notification->update(['is_read' => true]);
        app(SupabaseSyncService::class)->syncNotification($notification->fresh());

        return $this->success(new NotificationResource($notification), 'Notification marquée comme lue.');
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $notifications = Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->get();

        Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $sync = app(SupabaseSyncService::class);
        foreach ($notifications as $notification) {
            $notification->is_read = true;
            $sync->syncNotification($notification);
        }

        return $this->success(null, 'Toutes les notifications ont été marquées comme lues.');
    }
}
