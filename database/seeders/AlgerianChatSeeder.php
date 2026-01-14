<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AlgerianChatSeeder extends Seeder
{
    public function run()
    {
        // 1. Clear ONLY Group Chats (Keep private DMs and existing users)
        $groups = Conversation::where('type', 'group')->get();
        foreach($groups as $g) {
            $g->users()->detach();
            $g->messages()->delete();
            $g->delete();
        }
        $this->command->info('Old groups cleared.');

        // 2. Create Algerian Users
        $names = [
            'Mohamed', 'Amine', 'Yacine', 'Walid', 'Mehdi', 'Sofiane', 'Karim', 'Hichem', // Men
            'Sarah', 'Meriem', 'Yasmine', 'Amel', 'Kenza', 'Lydia', 'Manel' // Women
        ];

        $users = [];
        foreach ($names as $name) {
            // Check if exists to avoid duplication
            $email = strtolower($name) . '@seaal.dz';
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    // No default profile photo, UI handles initials
                ]
            );
            $users[] = $user;
        }
        
        // Add existing admin to the mix so they see the chats
        $admin = User::where('role', 'admin')->first();
        if($admin) $users[] = $admin;

        $this->command->info(count($users) . ' users ready (new + admin).');

        // 3. Create Specific Groups
        $groupDefinitions = [
            [
                'name' => 'Section Développement', 
                'image' => null, // Could add a seed image if available
                'messages' => [
                    'Salam l\'équipe, le déploiement est prévu pour quand ?',
                    'Bonjour, normalement à 14h inchallah.',
                    'Ok parfait, je check les logs.',
                    'N\'oubliez pas de pull la dernière branche.',
                ]
            ],
            [
                'name' => 'Section Maintenance', 
                'image' => null,
                'messages' => [
                    'Problème sur le serveur DB2, qui est dispo ?',
                    'Je regarde ça tout de suite.',
                    'C\'est bon c\'est réglé, juste un restart service.',
                    'Merci Walid !'
                ]
            ],
            [
                'name' => 'Pause Café ☕', // French Stuff / Social
                'image' => null,
                'messages' => [
                    'Saha ftourkoum les gens !',
                    'Discussions foot ce soir ?',
                    'Mdr le match d\'hier c\'était une catastrophe.',
                    'Qui veut un café ?'
                ]
            ]
        ];

        foreach ($groupDefinitions as $def) {
            $group = Conversation::create([
                'name' => $def['name'],
                'type' => 'group',
                'image' => $def['image']
            ]);

            // Attach all created users to these public groups
            // In a real app maybe subsets, but here "everyone talks"
            $userIds = collect($users)->pluck('id');
            $group->users()->attach($userIds);

            // Seed Messages
            foreach ($def['messages'] as $msgContent) {
                Message::create([
                    'conversation_id' => $group->id,
                    'user_id' => $users[array_rand($users)]->id, // Random sender
                    'content' => $msgContent,
                    'created_at' => now()->subMinutes(rand(1, 120))
                ]);
            }
        }

        $this->command->info('Algerian groups seeded successfully!');
    }
}
