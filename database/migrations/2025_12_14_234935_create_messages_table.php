<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 public function up(): void
{
    Schema::create('messages', function (Blueprint $table) {
        $table->id(); // Primary key
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Links message to a user
        $table->text('content'); // Message text
        $table->timestamps(); // created_at and updated_at columns
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
