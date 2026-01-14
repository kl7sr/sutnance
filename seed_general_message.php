try {
    $general = \App\Models\Conversation::where('name', 'Général')->firstOrFail();
    $admin = \App\Models\User::where('email', 'admin@admin.com')->firstOrFail();

    $general->messages()->create([
        'user_id' => $admin->id,
        'content' => 'Bienvenue dans le chat Général !'
    ]);
    
    echo "Message added to General.\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
