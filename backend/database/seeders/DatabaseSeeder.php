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
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $restaurants = [
            [
                'owner' => ['name' => 'Awa Traore', 'email' => 'vendor@test.com'],
                'name' => 'Resto Awa',
                'description' => 'Le restau de Awa, le gout au rendez-vous.',
                'address' => 'Entre village H et le restaurant universitaire',
                'rating' => 4.8,
                'delivery_time' => 18,
                'delivery_fee' => 200,
                'items' => [
                    ['name' => 'Riz au poulet braise', 'description' => 'Riz parfume, poulet, crudites et sauce verte.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'Thieb jeun', 'description' => 'Riz aux legumes sautes, pois chiches et sauce arachide.', 'price' => 800, 'category' => 'repas midi'],
                    ['name' => 'Jus bissap frais', 'description' => 'Infusion hibiscus maison servie glacee.', 'price' => 600, 'category' => 'Boissons'],
                ],
            ],
            [
                'owner' => ['name' => 'Moussa Diop', 'email' => 'vendor2@test.com'],
                'name' => 'Chez Moussa',
                'description' => 'Fast-food etudiant, rapide et pas cher.',
                'address' => 'Pavillon C, residence universitaire',
                'rating' => 4.5,
                'delivery_time' => 12,
                'delivery_fee' => 200,
                'items' => [
                    ['name' => 'Burger poulet', 'description' => 'Pain brioche, poulet pane, salade et frites.', 'price' => 1500, 'category' => 'fast-food'],
                    ['name' => 'Shawarma boeuf', 'description' => 'Boeuf marine, crudites et sauce blanche.', 'price' => 1200, 'category' => 'fast-food'],
                    ['name' => 'Coca-Cola 33cl', 'description' => 'Canette fraiche.', 'price' => 500, 'category' => 'Boissons'],
                ],
            ],
            [
                'owner' => ['name' => 'Fatou Sow', 'email' => 'vendor3@test.com'],
                'name' => 'Le Bon Plat',
                'description' => 'Cuisine maison, portions genereuses.',
                'address' => 'Entree principale du campus',
                'rating' => 4.7,
                'delivery_time' => 22,
                'delivery_fee' => 250,
                'items' => [
                    ['name' => 'Mafe boeuf', 'description' => 'Sauce arachide, boeuf tendre et riz blanc.', 'price' => 1000, 'category' => 'repas midi'],
                    ['name' => 'Yassa poulet', 'description' => 'Poulet aux oignons et citron, riz.', 'price' => 1000, 'category' => 'repas midi'],
                    ['name' => 'Bouye glace', 'description' => 'Jus de pain de singe maison.', 'price' => 600, 'category' => 'Boissons'],
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
