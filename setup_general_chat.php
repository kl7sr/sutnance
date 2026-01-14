try {
    $general = \App\Models\Conversation::firstOrCreate(
        ['type' => 'group', 'name' => 'Général'],
        ['type' => 'group', 'name' => 'Général']
    );

    echo "General Chat ID: " . $general->id . "\n";

    $userIds = \App\Models\User::pluck('id');
    $general->users()->syncWithoutDetaching($userIds);

    echo "Synced " . $userIds->count() . " users to General Chat.\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
