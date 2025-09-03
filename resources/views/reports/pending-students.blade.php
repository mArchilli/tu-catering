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

    @foreach($groups as $status => $rows)
        <h2>{{ $status === 'pending' ? 'Pendientes de pago/aprobación' : 'Sin días cargados' }} ({{ $rows->count() }})</h2>
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
                @foreach($rows as $r)
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
    @endforeach
</body>
</html>
