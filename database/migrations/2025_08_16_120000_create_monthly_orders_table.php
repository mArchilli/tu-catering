<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('monthly_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');
            $table->string('status')->default('pending'); // pending | paid
            $table->integer('total_cents')->default(0);
            $table->timestamps();

            $table->unique(['child_id','month','year']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_orders');
    }
};
