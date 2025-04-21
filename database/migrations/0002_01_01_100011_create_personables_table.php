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
        Schema::create('personables', function (Blueprint $table) {
            $table->id();

            $table->foreignId('person_id')->constrained('people')->onDelete('cascade');
            $table->morphs('personable');
            $table->boolean('is_author')->default(false);
            $table->boolean('is_mention')->default(false);
            $table->foreignId('activity_id')->nullable()->constrained('activities')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personables');
    }
};
