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
        $economicoPath = 'menus/menu_economico.pdf';
        $generalPath = 'menus/menu_general.pdf';

    // Si se definió PUBLIC_PDF_BASE en .env, consideramos guardar/servir desde allí.
    $publicPdfPath = trim((string) env('PUBLIC_PDF_BASE', ''));
        $publicPdfUrl = trim((string) env('PUBLIC_PDF_URL', ''));

        if ($publicPdfPath !== '') {
            // comprobar existencia en filesystem alternativo
            $baseFs = Str::startsWith($publicPdfPath, ['/','\\']) ? $publicPdfPath : base_path($publicPdfPath);
            $economicoFs = rtrim($baseFs, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'menus' . DIRECTORY_SEPARATOR . 'menu_economico.pdf';
            $generalFs = rtrim($baseFs, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'menus' . DIRECTORY_SEPARATOR . 'menu_general.pdf';

            $economicoUrl = null;
            $generalUrl = null;
            if (file_exists($economicoFs)) {
                $economicoUrl = $publicPdfUrl !== '' ? rtrim($publicPdfUrl, '/') . '/menus/menu_economico.pdf' : null;
            }
            if (file_exists($generalFs)) {
                $generalUrl = $publicPdfUrl !== '' ? rtrim($publicPdfUrl, '/') . '/menus/menu_general.pdf' : null;
            }

            // Fallback: si PUBLIC_PDF_URL no está definido pero los archivos existen en la ruta, devolver null
            return [
                'economicoUrl' => $economicoUrl,
                'generalUrl' => $generalUrl,
            ];
        }

        return [
            'economicoUrl' => Storage::disk('public')->exists($economicoPath) ? Storage::url($economicoPath) : null,
            'generalUrl'   => Storage::disk('public')->exists($generalPath) ? Storage::url($generalPath) : null,
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
            'menu_economico' => ['nullable', 'file', 'mimetypes:application/pdf', 'max:20480'], // 20MB
            'menu_general'   => ['nullable', 'file', 'mimetypes:application/pdf', 'max:20480'],
        ]);

    $publicPdfPath = trim((string) env('PUBLIC_PDF_BASE', ''));
        // Si PUBLIC_PDF_PATH está definido, guardamos en esa ubicación física + subcarpeta menus
        if ($publicPdfPath !== '') {
            $baseFs = Str::startsWith($publicPdfPath, ['/','\\']) ? $publicPdfPath : base_path($publicPdfPath);
            $targetDir = rtrim($baseFs, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'menus';
            if (!is_dir($targetDir)) {
                @mkdir($targetDir, 0755, true);
            }
            if ($request->hasFile('menu_economico')) {
                $request->file('menu_economico')->move($targetDir, 'menu_economico.pdf');
            }
            if ($request->hasFile('menu_general')) {
                $request->file('menu_general')->move($targetDir, 'menu_general.pdf');
            }
        } else {
            if ($request->hasFile('menu_economico')) {
                $request->file('menu_economico')->storeAs('menus', 'menu_economico.pdf', 'public');
            }
            if ($request->hasFile('menu_general')) {
                $request->file('menu_general')->storeAs('menus', 'menu_general.pdf', 'public');
            }
        }

        return redirect()->route('menu.edit')->with('success', 'Menús actualizados correctamente.');
    }
}
