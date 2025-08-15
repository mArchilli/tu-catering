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
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // padre
            $table->string('name');
            $table->string('lastname');
            $table->string('dni', 20)->unique();
            $table->string('school')->nullable();
            $table->string('grado')->nullable();
            $table->string('condition')->nullable(); // alergias o condición médica
            $table->timestamps();
            $table->index(['user_id', 'lastname']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
