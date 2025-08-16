<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('daily_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->foreignId('service_type_id')->constrained('service_types');
            $table->date('date');
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->unique(['child_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_orders');
    }
};
