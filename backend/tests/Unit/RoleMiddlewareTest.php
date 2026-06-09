<?php

namespace Tests\Unit;

use App\Http\Middleware\RoleMiddleware;
use App\Models\User;
use Illuminate\Http\Request;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    private function requestAs(?string $role): Request
    {
        $request = Request::create('/api/v1/vendor/orders', 'GET');

        $request->setUserResolver(function () use ($role) {
            if ($role === null) {
                return null;
            }
            $user = new User();
            $user->role = $role;

            return $user;
        });

        return $request;
    }

    public function test_passes_when_role_matches(): void
    {
        $response = (new RoleMiddleware())->handle($this->requestAs('vendor'), fn () => response('ok'), 'vendor');

        $this->assertSame('ok', $response->getContent());
    }

    public function test_french_alias_maps_to_english_role(): void
    {
        $response = (new RoleMiddleware())->handle($this->requestAs('vendor'), fn () => response('ok'), 'vendeur');

        $this->assertSame('ok', $response->getContent());
    }

    public function test_rejects_wrong_role(): void
    {
        $response = (new RoleMiddleware())->handle($this->requestAs('student'), fn () => response('ok'), 'vendor');

        $this->assertSame(403, $response->getStatusCode());
    }

    public function test_rejects_guest(): void
    {
        $response = (new RoleMiddleware())->handle($this->requestAs(null), fn () => response('ok'), 'vendor');

        $this->assertSame(403, $response->getStatusCode());
    }
}
