<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Admin Yoonema',
                 'email' => 'admin1@test.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $restaurants = [
            [
                'owner' => ['name' => 'Awa Traore', 'email' => 'vendor@test.com'],
                'name' => 'Resto awa',
                'description' => 'Le restau de awa, le gout au rendez-vous.',
                'address' => 'Entre vilage H et le restaurant universitaire',
                'rating' => 4.8,
                'delivery_time' => 18,
                'delivery_fee' => 200,
                'items' => [
                    ['name' => 'Riz au poulet braise', 'description' => 'Riz parfume, poulet, crudites et sauce verte.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'thieb jeun', 'description' => 'riz ave Legumes sautes, pois chiches et sauce arachide.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'Jus bissap frais', 'description' => 'Infusion hibiscus maison servie glacee.', 'price' => 600, 'category' => 'Boissons'],
                ],
            ],
            [
                'owner' => ['name' => 'Awa Traore', 'email' => 'vendor@test.com'],
                'name' => 'Resto awa',
                'description' => 'Le restau de awa, le gout au rendez-vous.',
                'address' => 'Entre vilage H et le restaurant universitaire',
                'rating' => 4.8,
                'delivery_time' => 18,
                'delivery_fee' => 200,
                'items' => [
                    ['name' => 'Riz au poulet braise', 'description' => 'Riz parfume, poulet, crudites et sauce verte.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'thieb jeun', 'description' => 'riz ave Legumes sautes, pois chiches et sauce arachide.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'Jus bissap frais', 'description' => 'Infusion hibiscus maison servie glacee.', 'price' => 600, 'category' => 'Boissons'],
                ],
            ],
            [
                'owner' => ['name' => 'Awa Traore', 'email' => 'vendor@test.com'],
                'name' => 'Resto awa',
                'description' => 'Le restau de awa, le gout au rendez-vous.',
                'address' => 'Entre vilage H et le restaurant universitaire',
                'rating' => 4.8,
                'delivery_time' => 18,
                'delivery_fee' => 200,
                'items' => [
                    ['name' => 'Riz au poulet braise', 'description' => 'Riz parfume, poulet, crudites et sauce verte.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'thieb jeun', 'description' => 'riz ave Legumes sautes, pois chiches et sauce arachide.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'Jus bissap frais', 'description' => 'Infusion hibiscus maison servie glacee.', 'price' => 600, 'category' => 'Boissons'],
                ],
            ],
        ];

        foreach ($restaurants as $entry) {
            $owner = User::query()->firstOrCreate(
                ['email' => $entry['owner']['email']],
                [
                    'id' => (string) Str::uuid(),
                    'name' => $entry['owner']['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'vendor',
                    'phone' => '+221 77 000 00 00',
                    'is_active' => true,
                ]
            );

            $restaurant = Restaurant::query()->firstOrCreate(
                ['owner_id' => $owner->id],
                [
                    'id' => (string) Str::uuid(),
                    'name' => $entry['name'],
                    'description' => $entry['description'],
                    'address' => $entry['address'],
                    'rating' => $entry['rating'],
                    'is_open' => true,
                    'is_approved' => true,
                    'delivery_time' => $entry['delivery_time'],
                    'delivery_fee' => $entry['delivery_fee'],
                    'opening_hours' => ['lun-ven' => '08:00-21:00', 'sam' => '10:00-18:00'],
                ]
            );

            $owner->forceFill(['restaurant_id' => $restaurant->id])->save();

            foreach ($entry['items'] as $item) {
                MenuItem::query()->firstOrCreate(
                    ['restaurant_id' => $restaurant->id, 'name' => $item['name']],
                    [
                        'id' => (string) Str::uuid(),
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'category' => $item['category'],
                        'is_available' => true,
                    ]
                );
            }
        }

        User::query()->firstOrCreate(
            ['email' => 'student@test.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Etudiant Demo',
                'password' => Hash::make('password123'),
                'role' => 'student',
                'is_active' => true,
            ]
        );

        User::query()->firstOrCreate(
            ['email' => 'delivery@test.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Livreur Demo',
                'password' => Hash::make('password123'),
                'role' => 'delivery',
                'is_available' => true,
                'is_active' => true,
            ]
        );

        $admin->forceFill(['is_active' => true])->save();
    }
}
