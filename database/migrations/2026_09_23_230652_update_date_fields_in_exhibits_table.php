<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('exhibits', function (Blueprint $table) {
            if (!Schema::hasColumn('exhibits', 'start_date')) {
                $table->date('start_date')->nullable()->after('content');
            }
            if (!Schema::hasColumn('exhibits', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
        });

        if (Schema::hasColumn('exhibits', 'date')) {
            DB::table('exhibits')
                ->whereNotNull('date')
                ->where('date', '!=', '')
                ->whereNull('start_date')
                ->update([
                    'start_date' => DB::raw('date'),
                ]);

            Schema::table('exhibits', function (Blueprint $table) {
                $table->dropColumn('date');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exhibits', function (Blueprint $table) {
            if (!Schema::hasColumn('exhibits', 'date')) {
                $table->string('date')->nullable()->after('content');
            }
        });

        if (Schema::hasColumn('exhibits', 'start_date') && Schema::hasColumn('exhibits', 'date')) {
            DB::table('exhibits')
                ->whereNotNull('start_date')
                ->whereNull('date')
                ->update([
                    'date' => DB::raw('start_date'),
                ]);
        }

        Schema::table('exhibits', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('exhibits', 'start_date')) {
                $columnsToDrop[] = 'start_date';
            }
            if (Schema::hasColumn('exhibits', 'end_date')) {
                $columnsToDrop[] = 'end_date';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
