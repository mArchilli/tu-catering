<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Alumnos pendientes / sin días</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin: 0 0 10px; }
        h2 { font-size: 15px; margin: 20px 0 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #ccc; padding: 4px 6px; }
        th { background: #f6f6f6; text-align: left; }
        .small { font-size: 11px; color: #444; }
    </style>
</head>
<body>
    <h1>Alumnos pendientes / sin días</h1>
    <p class="small">Fecha de generación: {{ $dateLabel }}</p>

    @foreach($groups as $status => $bySchool)
        <h2>{{ $status === 'pending' ? 'Pendientes de pago/aprobación' : 'Sin días cargados' }} ({{ $bySchool->flatten(1)->count() }})</h2>

        @foreach($bySchool as $school => $rows)
            <h3 style="font-size:13px; margin: 10px 0 6px;">Escuela: {{ $school }}</h3>

            @php
                // Valores por defecto por si no fueron provistos (evita avisos del analizador)
                $gradesMJ = $gradesMJ ?? [];
                $gradesPrim = $gradesPrim ?? [];
                $gradesSec = $gradesSec ?? [];
                $gradeIndex = $gradeIndex ?? [];

                $rowsMJ = $rows->filter(fn($r) => in_array($r['grado'], $gradesMJ));
                $rowsPrim = $rows->filter(fn($r) => in_array($r['grado'], $gradesPrim));
                $rowsSec = $rows->filter(fn($r) => in_array($r['grado'], $gradesSec));
            @endphp

            @foreach([
                ['label' => 'Maternal y Jardín', 'data' => $rowsMJ],
                ['label' => 'Primaria', 'data' => $rowsPrim],
                ['label' => 'Secundaria', 'data' => $rowsSec],
            ] as $group)
                @if($group['data']->count() > 0)
                    <h4 style="font-size:12px; margin: 6px 0;">{{ $group['label'] }} ({{ $group['data']->count() }})</h4>
                    @php
                        $sorted = $group['data']->sortBy(function($r) use ($gradeIndex) {
                            $i = $gradeIndex[$r['grado']] ?? 999;
                            return str_pad((string)$i, 3, '0', STR_PAD_LEFT).'|'.($r['full_name'] ?? '');
                        });
                    @endphp
                    <table>
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>DNI</th>
                                <th>Escuela</th>
                                <th>Grado</th>
                                <th>Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($sorted as $r)
                            <tr>
                                <td>{{ $r['full_name'] }}</td>
                                <td>{{ $r['dni'] }}</td>
                                <td>{{ $r['school'] }}</td>
                                <td>{{ $r['grado'] }}</td>
                                <td>{{ $r['condition'] ?: '-' }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            @endforeach
        @endforeach
    @endforeach
</body>
</html>
