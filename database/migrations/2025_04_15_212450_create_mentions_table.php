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
        Schema::create('mentions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('mentioner_id')->onDelete('cascade');
            $table->string('mentioner_type');

            $table->foreignId('mentioned_id')->onDelete('cascade');
            $table->string('mentioned_type');

            $table->unique(['mentioner_id', 'mentioner_type', 'mentioned_id', 'mentioned_type'])->name('mentioner_mentioned_unique');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentions');
    }
};
