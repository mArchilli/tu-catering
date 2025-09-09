<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\ServiceType;
use Illuminate\Support\Str;

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
        // Base relativa a la carpeta public/ (sin prefijo 'public/')
        $docsBase = trim((string) env('PUBLIC_DOCS_PATH', 'docs'));
        $docsBase = trim($docsBase, "\\/");

        $existing = [];
        $baseFs = rtrim(public_path($docsBase), DIRECTORY_SEPARATOR);
        $prefix = '/' . $docsBase;
        foreach ($keys as $key) {
            $fsPath = $baseFs . DIRECTORY_SEPARATOR . 'precios' . DIRECTORY_SEPARATOR . "{$key}.pdf";
            $existing[$key] = file_exists($fsPath) ? rtrim($prefix, '/') . "/precios/{$key}.pdf" : null;
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
            'juan_xxiii_inicial'  => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],
            'juan_xxiii_primario' => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],
            'juan_xxiii_secundario' => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],

            'cba_inicial'  => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],
            'cba_primario' => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],
            'cba_secundario' => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],

            'sr_inicial'  => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],
            'sr_primario' => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],
            'sr_secundario' => ['nullable','file','mimetypes:application/pdf,application/x-pdf','mimes:pdf','max:10240'],
        ];

        $validated = $request->validate($rules);

        // Base relativa a public/ y subcarpeta 'precios'
        $docsBase = trim((string) env('PUBLIC_DOCS_PATH', 'docs'));
        $docsBase = trim($docsBase, "\\/");
        $targetDir = rtrim(public_path($docsBase), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'precios';
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        foreach ($validated as $field => $file) {
            if ($request->hasFile($field)) {
                $dest = $targetDir . DIRECTORY_SEPARATOR . "{$field}.pdf";
                if (file_exists($dest)) { @unlink($dest); }
                $request->file($field)->move($targetDir, "{$field}.pdf");
            }
        }

        return redirect()->route('prices.edit')->with('success', 'Precios actualizados correctamente.');
    }
}
