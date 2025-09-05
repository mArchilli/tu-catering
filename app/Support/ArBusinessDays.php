<?php

namespace App\Support;

use Illuminate\Support\Carbon;

class ArBusinessDays
{
    /**
     * Lista estática de feriados por mes-día (MM-DD) aplicable cada año.
     * Nota: simplificada. Para feriados trasladables o religiosos usar AR_HOLIDAYS si hace falta.
     */
    private static array $staticByMonthDay = [
        '01-01', // Año Nuevo
        '03-24', // Día de la Memoria
        '04-02', // Malvinas
        '05-01', // Día del Trabajador
        '05-25', // Revolución de Mayo
        '06-20', // Paso a la Inmortalidad de Belgrano
        '07-09', // Independencia
        '08-17', // San Martín (puede trasladarse)
        '10-12', // Diversidad Cultural (puede trasladarse)
        '11-20', // Soberanía Nacional (puede trasladarse)
        '12-08', // Inmaculada Concepción
        '12-25', // Navidad
    ];

    /**
     * Devuelve true si la fecha es fin de semana o feriado (AR).
     * Permite agregar fechas adicionales vía env AR_HOLIDAYS=YYYY-MM-DD,YYYY-MM-DD
     */
    public static function isNonBusinessDay(Carbon $date): bool
    {
        // Fin de semana
        if (in_array($date->dayOfWeekIso, [6, 7], true)) { // 6=Sábado, 7=Domingo
            return true;
        }

        // Feriados fijos por MM-DD
        $mmdd = $date->format('m-d');
        if (in_array($mmdd, self::$staticByMonthDay, true)) {
            return true;
        }

        // Feriados adicionales configurables por fecha exacta
        $extra = trim((string) env('AR_HOLIDAYS', ''));
        if ($extra !== '') {
            $dates = array_filter(array_map('trim', explode(',', $extra)));
            if (in_array($date->toDateString(), $dates, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Cuenta días hábiles en el mes dado hasta la fecha de referencia (incluida si cae en el mismo mes).
     * Si today < inicio de mes => 0. Si today > fin de mes => total de hábiles del mes.
     */
    public static function businessDayIndexInMonth(Carbon $today, int $month, int $year): int
    {
        $monthStart = Carbon::create($year, $month, 1)->startOfMonth();
        $monthEnd = (clone $monthStart)->endOfMonth();

        if ($today->lt($monthStart)) {
            return 0;
        }

        $until = $today->gt($monthEnd) ? $monthEnd : $today->copy();
        $count = 0;
        $cursor = $monthStart->copy();
        while ($cursor->lte($until)) {
            if (!self::isNonBusinessDay($cursor)) {
                $count++;
            }
            $cursor->addDay();
        }
        return $count;
    }

    /**
     * Calcula el porcentaje de recargo según el índice de día hábil.
     * Regla: >5° día hábil aplica base% y >10° agrega extra% (acumulado).
     */
    public static function surchargePercentForMonth(int $month, int $year, Carbon $today = null, float $basePercent = null, float $extraPercent = null): float
    {
        $today = $today ?: now();
        $basePercent = $basePercent ?? (float) env('SURCHARGE_AFTER_5_BUSINESS_DAYS_PERCENT', 5);
        $extraPercent = $extraPercent ?? (float) env('SURCHARGE_AFTER_10_BUSINESS_DAYS_EXTRA_PERCENT', 5);

        $idx = self::businessDayIndexInMonth($today, $month, $year);
        if ($idx <= 5) return 0.0;
        if ($idx <= 10) return $basePercent;
        return $basePercent + $extraPercent;
    }

    /**
     * Dado un total en centavos, aplica el porcentaje de recargo.
     */
    public static function applySurchargeCents(int $baseCents, float $percent): int
    {
        if ($percent <= 0) return 0;
        $surcharge = (int) round($baseCents * ($percent / 100.0));
        return max(0, $surcharge);
    }
}
