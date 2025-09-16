<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Children;
use Illuminate\Support\Facades\Mail;
use App\Mail\WarningMailable;
use Illuminate\Support\Carbon;

class SendWarningEmails extends Command
{
    protected $signature = 'emails:send-warnings';
    protected $description = 'Envía correos a los padres cuyos hijos no tienen días cargados';

    public function handle()
    {
        $start = Carbon::now()->startOfMonth()->toDateString(); // 'YYYY-MM-DD'
        $end   = Carbon::now()->endOfMonth()->toDateString();

        $children = Children::with('user')
            ->withCount(['dailyOrders' => function ($q) use ($start, $end) {
                $q->whereBetween('date', [$start, $end]);
            }])
            ->having('daily_orders_count', 0)
            ->get();

        $sent = 0;
        foreach ($children as $child) {
            if ($child->user && $child->user->email) {
                Mail::to($child->user->email)->send(new WarningMailable($child));
                $sent++;
            }
        }

        $this->info("Se enviaron {$sent} correos de advertencia.");
        return 0;
    }
}
