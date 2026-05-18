<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    use ApiResponse;

    public function image(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $file = $validated['image'];
        $bucket = config('services.supabase.storage_bucket', 'yoonema-images');
        $path = 'uploads/'.now()->format('Y/m').'/'.Str::uuid().'.'.$file->getClientOriginalExtension();
        $baseUrl = rtrim((string) config('services.supabase.url'), '/');
        $key = config('services.supabase.key');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$key,
            'apikey' => $key,
            'Content-Type' => $file->getMimeType(),
        ])->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())
            ->post($baseUrl.'/storage/v1/object/'.$bucket.'/'.$path);

        if (! $response->successful()) {
            return $this->error('Téléversement impossible. Réessayez dans un instant.', 422);
        }

        return $this->success([
            'url' => $baseUrl.'/storage/v1/object/public/'.$bucket.'/'.$path,
        ], 'Image téléversée.');
    }
}
