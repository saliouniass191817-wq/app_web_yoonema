<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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

        Log::debug('UploadController:image incoming', [
            'hasFile' => $request->hasFile('image'),
            'files' => array_keys($request->files->all()),
            'headers' => $request->headers->all(),
        ]);

        Log::debug('UploadController:supabase target', [
            'base_url' => $baseUrl,
            'bucket' => $bucket,
            'path' => $path,
            'upload_url' => $baseUrl.'/storage/v1/object/'.$bucket.'/'.$path,
        ]);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$key,
            'apikey' => $key,
            'Content-Type' => $file->getMimeType(),
        ])->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())
            ->post($baseUrl.'/storage/v1/object/'.$bucket.'/'.$path);

        if (! $response->successful()) {
            Log::error('Supabase upload failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Fallback: store file locally under storage/app/public/uploads/YYYY/MM
            try {
                $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
                $localPath = $file->storeAs('public/uploads/'.now()->format('Y/m'), $filename);
                // Build a public URL (requires `php artisan storage:link` to be run)
                $publicPath = ltrim(Str::replaceFirst('public/', '', $localPath), '/');
                $publicUrl = url('/storage/'.$publicPath);

                Log::info('Upload fallback to local storage succeeded', ['path' => $localPath, 'url' => $publicUrl]);

                return $this->success([
                    'url' => $publicUrl,
                ], 'Image téléversée (fallback local).');
            } catch (\Exception $e) {
                Log::error('Local fallback upload failed', ['exception' => $e->getMessage()]);
            }

            $debugData = null;
            if (config('app.debug')) {
                $debugData = [
                    'supabase_status' => $response->status(),
                    'supabase_body' => $response->body(),
                ];
            }

            return $this->error('Téléversement impossible. Réessayez dans un instant.', 422, $debugData);
        }

        return $this->success([
            'url' => $baseUrl.'/storage/v1/object/public/'.$bucket.'/'.$path,
        ], 'Image téléversée.');
    }
}
