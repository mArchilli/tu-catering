<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuController extends Controller
{
    public static function urls(): array
    {
        $economicoPath = 'menus/menu_economico.pdf';
        $generalPath = 'menus/menu_general.pdf';

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

        if ($request->hasFile('menu_economico')) {
            $request->file('menu_economico')->storeAs('menus', 'menu_economico.pdf', 'public');
        }
        if ($request->hasFile('menu_general')) {
            $request->file('menu_general')->storeAs('menus', 'menu_general.pdf', 'public');
        }

        return redirect()->route('menu.edit')->with('success', 'Menús actualizados correctamente.');
    }
}
