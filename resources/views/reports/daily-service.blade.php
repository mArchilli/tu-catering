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

    @forelse($groups as $school => $students)
        <h2>Escuela: {{ $school ?: 'Sin especificar' }}</h2>
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
                @foreach($students as $i => $st)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ $st['full_name'] }}</td>
                        <td>{{ $st['dni'] }}</td>
                        <td>{{ $st['grado'] }}</td>
                        <td>{{ $st['condition'] }}</td>
                        <td>{{ $st['status'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @empty
        <p>No hay alumnos para este servicio en la fecha seleccionada.</p>
    @endforelse
</body>
</html>
