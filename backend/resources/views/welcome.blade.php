@php
    $fallbackRestaurants = collect([
        [
            'name' => 'Resto campus',
            'description' => 'Bols complets, sauces maison et options rapides pour les pauses entre deux cours.',
            'address' => 'Agora universitaire, Porte A',
            'rating' => 4.8,
            'delivery_time' => 18,
            'delivery_fee' => 500,
            'menu_items' => collect([
                ['name' => 'Bowl poulet braise', 'price' => 2500, 'category' => 'Bols'],
                ['name' => 'Bowl veggie arachide', 'price' => 2200, 'category' => 'Bols'],
                ['name' => 'Jus bissap frais', 'price' => 600, 'category' => 'Boissons'],
            ]),
        ],
        [
            'name' => 'Resto fallou',
            'description' => 'Sandwichs, burgers et menus etudiants prets en quelques minutes.',
            'address' => 'Residence B, entree principale',
            'rating' => 4.6,
            'delivery_time' => 12,
            'delivery_fee' => 300,
            'menu_items' => collect([
                ['name' => 'Burger campus', 'price' => 2000, 'category' => 'Burgers'],
                ['name' => 'Tacos poulet', 'price' => 1800, 'category' => 'Tacos'],
                ['name' => 'The citron gingembre', 'price' => 500, 'category' => 'Boissons'],
            ]),
        ],
        [
            'name' => 'Le bon coin vert',
            'description' => 'Plats vegetariens nourrissants avec ingredients locaux et desserts legers.',
            'address' => 'Bibliotheque centrale, cour interieure',
            'rating' => 4.9,
            'delivery_time' => 22,
            'delivery_fee' => 400,
            'menu_items' => collect([
                ['name' => 'Thieb legumes', 'price' => 2300, 'category' => 'Plats'],
                ['name' => 'Wrap avocat niebe', 'price' => 1900, 'category' => 'Wraps'],
                ['name' => 'Salade mangue', 'price' => 1200, 'category' => 'Desserts'],
            ]),
        ],
    ]);

    $featuredRestaurants = $restaurants->isNotEmpty() ? $restaurants : $fallbackRestaurants;
    $displayStats = [
        'restaurants' => max($stats['restaurants'] ?? 0, $featuredRestaurants->count()),
        'open' => max($stats['open'] ?? 0, $featuredRestaurants->count()),
        'menus' => max($stats['menus'] ?? 0, $featuredRestaurants->sum(function ($restaurant) {
            return $restaurant instanceof \App\Models\Restaurant
                ? $restaurant->menuItems->count()
                : $restaurant['menu_items']->count();
        })),
    ];
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Yoonema | Livraison campus</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700&display=swap" rel="stylesheet">
    <style>
        :root {
            color-scheme: light;
            --ink: #16201c;
            --muted: #66736d;
            --line: #dce6df;
            --leaf: #1f7a4f;
            --leaf-dark: #14523a;
            --sun: #f3b343;
            --coral: #dc6d55;
            --cream: #fbfaf5;
            --paper: #ffffff;
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: "Instrument Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: var(--ink);
            background: var(--cream);
        }

        a { color: inherit; text-decoration: none; }
        .shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
        .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 72px;
            gap: 20px;
        }

        .brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            font-size: 1.25rem;
        }

        .mark {
            width: 38px;
            height: 38px;
            display: grid;
            place-items: center;
            border-radius: 8px;
            background: var(--leaf);
            color: white;
            font-weight: 800;
        }

        .nav {
            display: flex;
            align-items: center;
            gap: 18px;
            color: var(--muted);
            font-weight: 600;
            font-size: .95rem;
        }

        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 44px;
            padding: 0 18px;
            border-radius: 8px;
            border: 1px solid var(--line);
            background: var(--paper);
            color: var(--ink);
            font-weight: 700;
        }

        .button.primary {
            border-color: var(--leaf);
            background: var(--leaf);
            color: white;
        }

        .hero {
            display: grid;
            grid-template-columns: minmax(0, 1.02fr) minmax(340px, .98fr);
            align-items: center;
            gap: 42px;
            padding: 46px 0 30px;
        }

        .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--leaf-dark);
            background: #e9f5ee;
            border: 1px solid #cae7d4;
            border-radius: 999px;
            padding: 8px 12px;
            font-weight: 700;
            font-size: .9rem;
        }

        h1 {
            margin: 22px 0 18px;
            max-width: 760px;
            font-size: clamp(2.8rem, 7vw, 5.8rem);
            line-height: .94;
            letter-spacing: 0;
        }

        .lead {
            max-width: 650px;
            color: var(--muted);
            font-size: 1.12rem;
            line-height: 1.75;
        }

        .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 28px;
        }

        .visual {
            background: #f6efe4;
            border: 1px solid #eadbc5;
            border-radius: 8px;
            padding: 18px;
            min-height: 520px;
            display: grid;
            align-content: space-between;
            box-shadow: 0 24px 80px rgba(22, 32, 28, .10);
        }

        .phone {
            background: var(--paper);
            border: 1px solid var(--line);
            border-radius: 8px;
            padding: 16px;
        }

        .phone-head, .order-row, .meta-row, .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .search {
            margin: 18px 0;
            padding: 13px 14px;
            color: var(--muted);
            border: 1px solid var(--line);
            border-radius: 8px;
            background: #f8faf8;
        }

        .dish {
            display: grid;
            grid-template-columns: 68px 1fr auto;
            gap: 13px;
            align-items: center;
            padding: 12px 0;
            border-top: 1px solid var(--line);
        }

        .dish-art {
            width: 68px;
            aspect-ratio: 1;
            border-radius: 8px;
            background:
                radial-gradient(circle at 35% 35%, #ffe8a8 0 18%, transparent 19%),
                radial-gradient(circle at 65% 62%, #87b66b 0 18%, transparent 19%),
                linear-gradient(135deg, #cf6c52, #f3b343);
        }

        .dish strong, .restaurant strong { display: block; }
        .dish span, .restaurant span, .micro { color: var(--muted); font-size: .9rem; }
        .price { font-weight: 800; color: var(--leaf-dark); }

        .status {
            margin-top: 16px;
            padding: 16px;
            border-radius: 8px;
            background: #173f30;
            color: white;
        }

        .status .micro { color: #b7d8c5; }
        .progress {
            height: 8px;
            border-radius: 99px;
            background: rgba(255,255,255,.2);
            overflow: hidden;
            margin-top: 12px;
        }

        .progress span { display: block; height: 100%; width: 68%; background: var(--sun); }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            margin-top: 28px;
        }

        .stat {
            padding: 18px;
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--paper);
        }

        .stat strong { display: block; font-size: 1.8rem; }
        .section { padding: 58px 0; }
        .section-head {
            display: flex;
            justify-content: space-between;
            align-items: end;
            gap: 24px;
            margin-bottom: 24px;
        }

        h2 { margin: 0; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1; }
        .section-head p { max-width: 520px; margin: 0; color: var(--muted); line-height: 1.7; }
        .restaurant-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
        }

        .restaurant {
            background: var(--paper);
            border: 1px solid var(--line);
            border-radius: 8px;
            overflow: hidden;
        }

        .restaurant-image {
            min-height: 145px;
            background:
                linear-gradient(135deg, rgba(31,122,79,.88), rgba(220,109,85,.72)),
                repeating-linear-gradient(45deg, #f8d98d 0 14px, #f4c86a 14px 28px);
        }

        .restaurant-body { padding: 18px; }
        .restaurant-body p { min-height: 72px; color: var(--muted); line-height: 1.55; }
        .pill-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
        .pill {
            padding: 7px 10px;
            border-radius: 999px;
            background: #f1f5f1;
            color: var(--leaf-dark);
            font-size: .84rem;
            font-weight: 700;
        }

        .workflow {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }

        .step {
            border-top: 4px solid var(--leaf);
            background: var(--paper);
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }

        .step b { color: var(--coral); }
        .step p { color: var(--muted); line-height: 1.6; }

        .api-band {
            background: #16201c;
            color: white;
            padding: 44px 0;
        }

        .api-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 28px;
            align-items: center;
        }

        .endpoint-list {
            display: grid;
            gap: 10px;
        }

        code {
            display: block;
            padding: 14px;
            border-radius: 8px;
            background: rgba(255,255,255,.08);
            border: 1px solid rgba(255,255,255,.14);
            color: #d8f2e3;
            white-space: normal;
        }

        footer {
            padding: 30px 0;
            color: var(--muted);
        }

        @media (max-width: 880px) {
            .nav { display: none; }
            .hero, .api-grid { grid-template-columns: 1fr; }
            .visual { min-height: auto; }
            .restaurant-grid, .workflow, .stats { grid-template-columns: 1fr; }
            .section-head { display: block; }
            .section-head p { margin-top: 12px; }
        }
    </style>
</head>
<body>
    <header class="shell topbar">
        <a class="brand" href="/">
            <span class="mark">Y</span>
            <span>Yoonema</span>
        </a>
        <nav class="nav" aria-label="Navigation principale">
            <a href="#restaurants">Restaurants</a>
            <a href="#workflow">Parcours</a>
            <a href="#api">API</a>
        </nav>
        <a class="button primary" href="/api/v1/restaurants">Voir l'API</a>
    </header>

    <main>
        <section class="shell hero">
            <div>
                <span class="eyebrow">Livraison rapide pour campus et residences</span>
                <h1>Le repas arrive avant le prochain cours.</h1>
                <p class="lead">
                    Yoonema relie les etudiants, restaurants du campus, vendeurs et livreurs dans une application simple:
                    menus disponibles, commandes suivies, validation vendeur et livraison coordonnee.
                </p>
                <div class="hero-actions">
                    <a class="button primary" href="#restaurants">Explorer les menus</a>
                    <a class="button" href="#api">Verifier les endpoints</a>
                </div>
                <div class="stats" aria-label="Indicateurs Yoonema">
                    <div class="stat">
                        <strong>{{ $displayStats['restaurants'] }}</strong>
                        <span class="micro">restaurants approuves</span>
                    </div>
                    <div class="stat">
                        <strong>{{ $displayStats['open'] }}</strong>
                        <span class="micro">ouverts maintenant</span>
                    </div>
                    <div class="stat">
                        <strong>{{ $displayStats['menus'] }}</strong>
                        <span class="micro">articles au menu</span>
                    </div>
                </div>
            </div>

            <div class="visual" aria-label="Apercu de commande">
                <div class="phone">
                    <div class="phone-head">
                        <strong>Commande active</strong>
                        <span class="pill">12 min</span>
                    </div>
                    <div class="search">Rechercher un plat, un resto, une boisson...</div>
                    @foreach ($featuredRestaurants->take(3) as $restaurant)
                        @php
                            $items = $restaurant instanceof \App\Models\Restaurant ? $restaurant->menuItems : $restaurant['menu_items'];
                            $firstItem = $items->first();
                        @endphp
                        <div class="dish">
                            <div class="dish-art"></div>
                            <div>
                                <strong>{{ $firstItem['name'] ?? 'Menu du jour' }}</strong>
                                <span>{{ $restaurant['name'] }} - {{ $firstItem['category'] ?? 'Plat' }}</span>
                            </div>
                            <div class="price">{{ number_format((float) ($firstItem['price'] ?? 0), 0, ',', ' ') }} F</div>
                        </div>
                    @endforeach
                    <div class="status">
                        <div class="order-row">
                            <strong>Le vendeur prepare</strong>
                            <span>68%</span>
                        </div>
                        <div class="progress"><span></span></div>
                        <p class="micro">Prochaine etape: affectation livreur disponible.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="restaurants" class="shell section">
            <div class="section-head">
                <h2>Restaurants prets a servir.</h2>
                <p>La page utilise les donnees Laravel si la base est alimentee; sinon elle affiche un jeu de demonstration coherent pour parcourir l'interface.</p>
            </div>
            <div class="restaurant-grid">
                @foreach ($featuredRestaurants as $restaurant)
                    @php
                        $items = $restaurant instanceof \App\Models\Restaurant ? $restaurant->menuItems : $restaurant['menu_items'];
                    @endphp
                    <article class="restaurant">
                        <div class="restaurant-image"></div>
                        <div class="restaurant-body">
                            <div class="meta-row">
                                <strong>{{ $restaurant['name'] }}</strong>
                                <span class="pill">{{ number_format((float) $restaurant['rating'], 1) }}/5</span>
                            </div>
                            <p>{{ $restaurant['description'] }}</p>
                            <div class="pill-row">
                                <span class="pill">{{ $restaurant['delivery_time'] }} min</span>
                                <span class="pill">{{ number_format((float) $restaurant['delivery_fee'], 0, ',', ' ') }} F livraison</span>
                            </div>
                            @foreach ($items->take(3) as $item)
                                <div class="stat-row">
                                    <span>{{ $item['name'] }}</span>
                                    <strong>{{ number_format((float) $item['price'], 0, ',', ' ') }} F</strong>
                                </div>
                            @endforeach
                        </div>
                    </article>
                @endforeach
            </div>
        </section>

        <section id="workflow" class="shell section">
            <div class="section-head">
                <h2>Un parcours complet.</h2>
                <p>Les roles de l'API sont deja structures pour separer les espaces etudiant, vendeur, livreur et admin.</p>
            </div>
            <div class="workflow">
                <div class="step"><b>01</b><h3>Etudiant</h3><p>Filtre les restaurants, consulte les menus, passe commande et annule si besoin.</p></div>
                <div class="step"><b>02</b><h3>Vendeur</h3><p>Gere son restaurant, publie ses plats et accepte ou refuse les commandes.</p></div>
                <div class="step"><b>03</b><h3>Livreur</h3><p>Voit les commandes disponibles, accepte une course et confirme la livraison.</p></div>
                <div class="step"><b>04</b><h3>Admin</h3><p>Suit les statistiques, valide les restaurants et controle les utilisateurs actifs.</p></div>
            </div>
        </section>

        <section id="api" class="api-band">
            <div class="shell api-grid">
                <div>
                    <span class="eyebrow">Backend Laravel 11</span>
                    <h2>API REST prete pour le mobile ou un SPA.</h2>
                    <p class="lead">Authentification par token Sanctum, middleware de roles et ressources JSON pour les restaurants, menus, commandes, avis et notifications.</p>
                </div>
                <div class="endpoint-list">
                    <code>POST /api/v1/auth/register/student</code>
                    <code>GET /api/v1/restaurants</code>
                    <code>POST /api/v1/orders</code>
                    <code>PUT /api/v1/vendor/orders/{order}/status</code>
                    <code>GET /api/v1/admin/stats</code>
                </div>
            </div>
        </section>
    </main>

    <footer class="shell">
        <div class="meta-row">
            <span>Yoonema - Laravel v{{ Illuminate\Foundation\Application::VERSION }}</span>
            <span>Demo: admin@yoonema.test / password</span>
        </div>
    </footer>
</body>
</html>
