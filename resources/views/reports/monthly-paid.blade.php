<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial de pagos</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111; }
        h1 { font-size: 18px; margin: 0 0 6px; }
        h2 { font-size: 14px; margin: 14px 0 6px; }
        .muted { color:#555; }
        .box { border:1px solid #ddd; border-radius:6px; padding:10px; }
        .grid { display:flex; flex-wrap:wrap; gap:10px; }
        .col { flex: 1 1 200px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border:1px solid #eee; padding: 6px 8px; }
        th { background:#fafafa; text-align: left; }
        .tag { display:inline-block; background:#e8f5e9; color:#1b5e20; border:1px solid #c8e6c9; padding: 2px 8px; border-radius: 999px; font-size: 11px; }
        .right { text-align: right; }
        .small { font-size: 11px; }
    </style>
    <?php
        $money = function($cents){ return '$ '.number_format(($cents ?? 0)/100, 0, ',', '.'); };
        $months = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril', 5 => 'Mayo', 6 => 'Junio',
            7 => 'Julio', 8 => 'Agosto', 9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];
        $m = isset($month) ? (int) $month : 0;
        $monthName = isset($months[$m]) ? $months[$m] : (string) $m;
    ?>
    </head>
<body>
    <h1>Historial de pagos</h1>
    <div class="muted small">Período: {{ $monthName }} {{ $year }}</div>

    <h2>Datos del alumno</h2>
    <div class="box grid">
        <div class="col">
            <div class="small muted">Nombre</div>
            <div><strong>{{ $child->name }} {{ $child->lastname }}</strong></div>
        </div>
        <div class="col">
            <div class="small muted">DNI</div>
            <div>{{ $child->dni ?? '-' }}</div>
        </div>
        <div class="col">
            <div class="small muted">Escuela</div>
            <div>{{ $child->school ?? '-' }}</div>
        </div>
        <div class="col">
            <div class="small muted">Grado</div>
            <div>{{ $child->grado ?? '-' }}</div>
        </div>
    </div>

    <h2>Resumen por servicio</h2>
    <div class="box">
        @forelse($counts as $c)
            <span class="tag">{{ $c['service'] }}: {{ $c['count'] }} {{ $c['count'] == 1 ? 'día' : 'días' }}</span>
        @empty
            <span class="small muted">Sin pagos en el período.</span>
        @endforelse
    </div>

    <h2>Detalle de días pagados</h2>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th class="right">Precio</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @forelse($summary as $d)
                <tr>
                    <td>{{ \Illuminate\Support\Carbon::parse($d['date'])->format('d/m/Y') }}</td>
                    <td>{{ $d['service'] }}</td>
                    <td class="right">{{ $money($d['price_cents']) }}</td>
                    <td><span class="tag">Pagado</span></td>
                </tr>
            @empty
                <tr><td colspan="4" class="small muted">Sin pagos registrados en el período.</td></tr>
            @endforelse
        </tbody>
    </table>

    <h2>Totales</h2>
    <table>
        <tbody>
            <tr>
                <td>Subtotal</td>
                <td class="right">{{ $money($baseTotalCents) }}</td>
            </tr>
            <tr>
                <td>Recargo</td>
                <td class="right">{{ $surcharge['applied'] ? ($surcharge['percent'].'% ('.$money($surcharge['cents']).')') : '-' }}</td>
            </tr>
            <tr>
                <th>Total</th>
                <th class="right">{{ $money($paidMonthlyTotalCents) }}</th>
            </tr>
        </tbody>
    </table>
</body>
</html>
