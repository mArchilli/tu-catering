<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Aviso de inscripción</title>
</head>
<body>
  <p>Estimado/a {{ e(($padre->name ?? $padre->nombre ?? 'familia')) }},</p>

  <p>Le informamos que su hijo/a {{ e($child->full_name ?? ($child->name.' '.$child->lastname)) }} figura sin días cargados en el sistema para el mes actual.</p>

  <p>Para asegurar la continuidad del servicio, le recordamos que debe realizar la inscripción y abonar el monto mensual antes del 5º día hábil del mes.</p>

  <p>En caso de no hacerlo dentro del plazo, se aplicará un recargo a partir del día siguiente.</p>

  <p>Ante cualquier duda puede responder a este correo.</p>

  <p>Saludos cordiales,<br>
  <strong>Tu Catering</strong></p>
</body>
</html>