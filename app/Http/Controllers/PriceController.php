<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
        return Inertia::render('Price', [
            'existing' => self::urls(),
        ]);
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
