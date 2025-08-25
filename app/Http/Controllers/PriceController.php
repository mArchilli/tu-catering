<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\ServiceType;

class PriceController extends Controller
{
    public static function urls(): array
    {
        $keys = [
            'juan_xxiii_inicial',
            'juan_xxiii_primario',
            'juan_xxiii_secundario',
            'cba_inicial',
            'cba_primario',
            'cba_secundario',
            'sr_inicial',
            'sr_primario',
            'sr_secundario',
        ];

        $existing = [];
        foreach ($keys as $key) {
            $path = "precios/{$key}.pdf";
            $existing[$key] = Storage::disk('public')->exists($path) ? Storage::url($path) : null;
        }
        return $existing;
    }

    public function edit()
    {
        $serviceTypes = ServiceType::whereIn('name', ['Vianda','Comedor Económico','Comedor Premium'])->get();
        $serviceTypePrices = [
            'vianda' => optional($serviceTypes->firstWhere('name','Vianda'))->price_cents,
            'economico' => optional($serviceTypes->firstWhere('name','Comedor Económico'))->price_cents,
            'premium' => optional($serviceTypes->firstWhere('name','Comedor Premium'))->price_cents,
        ];
        return Inertia::render('Price', [
            'existing' => self::urls(),
            'serviceTypePrices' => $serviceTypePrices,
        ]);
    }

    public function updateServiceTypePrices(Request $request)
    {
        $rules = [
            'vianda_price' => ['nullable','numeric','min:0'],
            'economico_price' => ['nullable','numeric','min:0'],
            'premium_price' => ['nullable','numeric','min:0'],
        ];
        $data = $request->validate($rules);
        $map = [
            'vianda_price' => 'Vianda',
            'economico_price' => 'Comedor Económico',
            'premium_price' => 'Comedor Premium',
        ];
        $updated = [];
        foreach ($map as $field => $name) {
            if ($data[$field] !== null && $data[$field] !== '') {
                $priceCents = (int) round($data[$field] * 100);
                $st = ServiceType::firstOrCreate(['name' => $name], ['price_cents' => $priceCents]);
                $st->price_cents = $priceCents;
                $st->save();
                $updated[$name] = $priceCents;
            }
        }
        return redirect()->route('prices.edit')->with('success', 'Precios de servicios actualizados.');
    }

    public function update(Request $request)
    {
        $rules = [
            'juan_xxiii_inicial'  => ['nullable','file','mimetypes:application/pdf','max:20480'],
            'juan_xxiii_primario' => ['nullable','file','mimetypes:application/pdf','max:20480'],
            'juan_xxiii_secundario' => ['nullable','file','mimetypes:application/pdf','max:20480'],

            'cba_inicial'  => ['nullable','file','mimetypes:application/pdf','max:20480'],
            'cba_primario' => ['nullable','file','mimetypes:application/pdf','max:20480'],
            'cba_secundario' => ['nullable','file','mimetypes:application/pdf','max:20480'],

            'sr_inicial'  => ['nullable','file','mimetypes:application/pdf','max:20480'],
            'sr_primario' => ['nullable','file','mimetypes:application/pdf','max:20480'],
            'sr_secundario' => ['nullable','file','mimetypes:application/pdf','max:20480'],
        ];

        $validated = $request->validate($rules);

        foreach ($validated as $field => $file) {
            if ($request->hasFile($field)) {
                // Guarda con nombre fijo por campo (coincide con los IDs de tu formulario)
                $request->file($field)->storeAs('precios', "{$field}.pdf", 'public');
            }
        }

        return redirect()->route('prices.edit')->with('success', 'Precios actualizados correctamente.');
    }
}
