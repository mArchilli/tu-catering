<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('monthly_orders', function (Blueprint $table) {
            $table->timestamp('decision_at')->nullable()->after('status');
            $table->boolean('notified')->default(false)->after('decision_at');
        });
    }

    public function down(): void
    {
        Schema::table('monthly_orders', function (Blueprint $table) {
            $table->dropColumn(['decision_at', 'notified']);
        });
    }
};
