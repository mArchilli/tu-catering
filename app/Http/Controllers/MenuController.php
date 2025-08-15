<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function edit()
    {
        $economicoPath = 'menus/menu_economico.pdf';
        $generalPath = 'menus/menu_general.pdf';

        return Inertia::render('Menu', [
            'economicoUrl' => Storage::disk('public')->exists($economicoPath) ? Storage::url($economicoPath) : null,
            'generalUrl'   => Storage::disk('public')->exists($generalPath) ? Storage::url($generalPath) : null,
        ]);
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
