<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MenuController extends Controller
{
    public static function urls(): array
    {
        // Base relativa a la carpeta public/ (no incluir prefijo "public/")
    $docsBase = trim((string) env('PUBLIC_DOCS_PATH', 'docs'));
    $docsBase = trim($docsBase, "\\/");
    // Sanea prefijos no válidos (no debe incluir 'public' ni 'public_html')
    $docsBase = (string) preg_replace('#^(?:public|public_html)[\\/]+#i', '', $docsBase);

        $economicoRel = 'menus/menu_economico.pdf';
        $generalRel   = 'menus/menu_general.pdf';

        $baseFs = rtrim(public_path($docsBase), DIRECTORY_SEPARATOR);
        $economicoFs = $baseFs . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $economicoRel);
        $generalFs   = $baseFs . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $generalRel);

        $prefix = '/' . $docsBase;

        return [
            'economicoUrl' => file_exists($economicoFs) ? rtrim($prefix, '/') . '/' . $economicoRel : null,
            'generalUrl'   => file_exists($generalFs) ? rtrim($prefix, '/') . '/' . $generalRel : null,
        ];
    }

    public function edit()
    {
        return Inertia::render('Menu', self::urls());
    }

    // Vista de menús (perfil padre)
    public function padre()
    {
        return Inertia::render('MenuPadre');
    }

    // Vista de precios (perfil padre)
    public function preciosPadre()
    {
        // Podés pasar props si necesitás URLs personalizadas para PDFs:
        // return Inertia::render('PreciosPadre', ['precios' => [/* ... */]]);
        return Inertia::render('PreciosPadre');
    }

    public function update(Request $request)
    {
        $request->validate([
            'menu_economico' => ['nullable', 'file', 'mimetypes:application/pdf,application/x-pdf', 'mimes:pdf', 'max:10240'], // 10MB
            'menu_general'   => ['nullable', 'file', 'mimetypes:application/pdf,application/x-pdf', 'mimes:pdf', 'max:10240'],
        ]);

        // Base relativa a public/
    $docsBase = trim((string) env('PUBLIC_DOCS_PATH', 'docs'));
    $docsBase = trim($docsBase, "\\/");
    $docsBase = (string) preg_replace('#^(?:public|public_html)[\\/]+#i', '', $docsBase);
        $targetDir = rtrim(public_path($docsBase), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'menus';
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        if ($request->hasFile('menu_economico')) {
            $dest = $targetDir . DIRECTORY_SEPARATOR . 'menu_economico.pdf';
            if (file_exists($dest)) { @unlink($dest); }
            $request->file('menu_economico')->move($targetDir, 'menu_economico.pdf');
        }
        if ($request->hasFile('menu_general')) {
            $dest = $targetDir . DIRECTORY_SEPARATOR . 'menu_general.pdf';
            if (file_exists($dest)) { @unlink($dest); }
            $request->file('menu_general')->move($targetDir, 'menu_general.pdf');
        }

        return redirect()->route('menu.edit')->with('success', 'Menús actualizados correctamente.');
    }
}
