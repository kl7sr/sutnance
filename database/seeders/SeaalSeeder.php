<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SeaalSeeder extends Seeder
{
    public function run()
    {
        // 1. Wipe everything
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('messages')->truncate();
        DB::table('conversation_user')->truncate();
        DB::table('conversations')->truncate();
        DB::table('users')->truncate();
        DB::table('announcements')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('Database wiped clean.');

        // 2. Create Admin (as requested)
        $admin = User::create([
            'name' => 'Hicham Oubad',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            // edit zinou 
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin account created: admin@admin.com / admin123');

        // 3. Create SEAAL Staff
        $staff = [
            ['name' => 'Abderrahmane', 'email' => 'a.lyes@seaal.dz', 'role' => 'user'],
            ['name' => 'Fatima-Zohra', 'email' => 'fz.dahmane@seaal.dz', 'role' => 'user'],
            ['name' => 'Sid Ahmed', 'email' => 'sa.hamid@seaal.dz', 'role' => 'user'],
            ['name' => 'Nadjib', 'email' => 'n.belkadi@seaal.dz', 'role' => 'user'],
            ['name' => 'Kamel', 'email' => 'k.arezki@seaal.dz', 'role' => 'user'],
            ['name' => 'Sonia', 'email' => 's.bentaleb@seaal.dz', 'role' => 'user'],
            ['name' => 'Rachid', 'email' => 'r.mansouri@seaal.dz', 'role' => 'user'],
            ['name' => 'Lila', 'email' => 'l.haddad@seaal.dz', 'role' => 'user'],
        ];

        $users = [$admin];
        foreach ($staff as $s) {
            $users[] = User::create([
                'name' => $s['name'],
                'email' => $s['email'],
                'password' => Hash::make('password'),
                'role' => $s['role'],
            ]);
        }

        // 4. Department Group Definitions
        $groups = [
            [
                'name' => 'Direction Générale 🚀',
                'desc' => 'Coordination du plan d\'action 2026-2028.',
                'messages' => [
                    'Bonjour à tous, nous lançons officiellement le plan de transformation digitale ce matin.',
                    'L\'objectif est d\'atteindre 100% de recouvrement des créances d\'ici fin 2027.',
                    'Excellent, le comité de direction suivra les KPIs chaque semaine.',
                ]
            ],
            [
                'name' => 'Transformation Digitale 💻',
                'desc' => 'Smart metering, IoT et nouveaux systèmes IT.',
                'messages' => [
                    'Installation des premiers compteurs intelligents prévue à Tipasa demain.',
                    'Les tests sur la nouvelle application mobile SEAAL sont concluants.',
                    'Nadjib, as-tu fini l\'intégration du module de paiement en ligne ?',
                    'Oui, c\'est en production sur l\'environnement de test.',
                ]
            ],
            [
                'name' => 'Exploitation Alger/Tipasa 💧',
                'desc' => 'Gestion de la distribution d\'eau du quotidien.',
                'messages' => [
                    'Signalement d\'une fuite importante au niveau de Hydra, intervention en cours.',
                    'Rétablissement de la distribution d\'eau à Tipasa Village prévu pour 18h.',
                    'Le niveau des réservoirs est stable ce matin.',
                ]
            ],
            [
                'name' => 'Clientèle & Recouvrement 💳',
                'desc' => 'Optimisation de la facturation et gestion des dettes.',
                'messages' => [
                    'Nouvelle campagne de sensibilisation prévue pour les gros consommateurs.',
                    'Le taux de recouvrement a augmenté de 5% ce mois-ci grace au digital.',
                    'On doit traiter les réclamations de la zone Ouest en priorité.',
                ]
            ],
            [
                'name' => 'Ressources Humaines 👥',
                'desc' => 'Formation et vie d\'entreprise.',
                'messages' => [
                    'Planning des formations "Outils Digitaux" envoyé par mail.',
                    'Bienvenue aux nouveaux ingénieurs recrutés pour le centre de contrôle.',
                    'Rappel : Le séminaire annuel aura lieu le mois prochain.',
                ]
            ]
        ];

        foreach ($groups as $gData) {
            $conversation = Conversation::create([
                'name' => $gData['name'],
                'type' => 'group',
            ]);

            // Add all users to these corporate groups
            $userIds = collect($users)->pluck('id');
            $conversation->users()->attach($userIds);

            // Add messages
            foreach ($gData['messages'] as $content) {
                Message::create([
                    'conversation_id' => $conversation->id,
                    'user_id' => $users[array_rand($users)]->id,
                    'content' => $content,
                    'created_at' => now()->subMinutes(rand(10, 500)),
                ]);
            }
        }

        // 5. Professional Announcements
        $announcements = [
            [
                'title' => 'Lancement du Plan Stratégique 2026-2028',
                'content' => 'SEAAL entame aujourd’hui une nouvelle phase de son développement centrée sur la transformation numérique et l’amélioration de la qualité de service pour Alger et Tipasa.',
            ],
            [
                'title' => 'Déploiement des Compteurs Intelligents',
                'content' => 'Dans le cadre de la modernisation de notre réseau, la direction de la transformation digitale annonce le début de la pose des compteurs IoT dès la semaine prochaine.',
            ],
            [
                'title' => 'Campagne de Recouvrement "Zéro Dette"',
                'content' => 'Une nouvelle initiative visant à faciliter le règlement des créances via les plateformes numériques est lancée pour tous nos clients résidentiels.',
            ]
        ];

        foreach ($announcements as $a) {
            \App\Models\Announcement::create($a);
        }

        $this->command->info('SEAAL Transformation environment seeded successfully!');
    }
}
