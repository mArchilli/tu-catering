<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte {{ $serviceName }} {{ $dateLabel }}</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color:#222; }
        h1 { font-size: 18px; margin:0 0 10px; }
        h2 { font-size: 14px; margin:20px 0 6px; }
        table { width:100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border:1px solid #555; padding:4px 6px; }
        th { background:#f2f2f2; text-align:left; }
        .small { font-size:10px; color:#555; }
    </style>
</head>
<body>
    <h1>Servicio: {{ $serviceName }}</h1>
    <div class="small">Fecha: {{ $dateLabel }} | Generado: {{ now()->format('d/m/Y H:i') }}</div>

    @forelse($groups as $school => $byGrade)
        <h2>Escuela: {{ $school ?: 'Sin especificar' }}</h2>
        @php
            $gradesMJ = $gradesMJ ?? [];
            $gradesPrim = $gradesPrim ?? [];
            $gradesSec = $gradesSec ?? [];
            $gradeIndex = $gradeIndex ?? [];
            $collect = collect($byGrade);

            $mj = $collect->filter(function($_, $grado) use ($gradesMJ){ return in_array($grado, $gradesMJ); });
            $prim = $collect->filter(function($_, $grado) use ($gradesPrim){ return in_array($grado, $gradesPrim); });
            $sec = $collect->filter(function($_, $grado) use ($gradesSec){ return in_array($grado, $gradesSec); });

            $orderGroups = function($g) use ($gradeIndex) {
                return collect($g)->sortBy(function($items, $grado) use ($gradeIndex) { return $gradeIndex[$grado] ?? 999; });
            };

            $sections = [
                ['label' => 'Maternal y Jardín', 'data' => $orderGroups($mj)],
                ['label' => 'Primaria', 'data' => $orderGroups($prim)],
                ['label' => 'Secundaria', 'data' => $orderGroups($sec)],
            ];
        @endphp

        @foreach($sections as $section)
            @if(count($section['data']) > 0)
                <h3>{{ $section['label'] }}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Alumno</th>
                            <th>DNI</th>
                            <th>Grado</th>
                            <th>Condición</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php $rowNum = 1; @endphp
                        @foreach($section['data'] as $grado => $students)
                            @foreach($students as $st)
                                <tr>
                                    <td>{{ $rowNum++ }}</td>
                                    <td>{{ $st['full_name'] }}</td>
                                    <td>{{ $st['dni'] }}</td>
                                    <td>{{ $grado }}</td>
                                    <td>{{ $st['condition'] }}</td>
                                    <td>
                                        @php
                                            $status = $st['status'] ?? '';
                                            $statusLabel = $status === 'paid' ? 'Pagado' : ($status === 'pending' ? 'Pendiente' : ($status ?: '-'));
                                        @endphp
                                        {{ $statusLabel }}
                                    </td>
                                </tr>
                            @endforeach
                        @endforeach
                    </tbody>
                </table>
            @endif
        @endforeach
    @empty
        <p>No hay alumnos para este servicio en la fecha seleccionada.</p>
    @endforelse
</body>
</html>
