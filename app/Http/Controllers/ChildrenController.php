<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Children;

class ChildrenController extends Controller
{
    // Listado
    public function index(Request $request)
    {
        $children = Children::where('user_id', $request->user()->id)
            ->orderBy('lastname')
            ->orderBy('name')
            ->get(['id','name','lastname','dni','school','grado','condition']);

        return Inertia::render('Children/Index', [
            'children' => $children,
        ]);
    }

    // Formulario creación
    public function create()
    {
        return Inertia::render('Children/Create', [
            'schools' => [
                'Juan XXIII','Santisimo Redentor','Colegio Buenos Aires'
            ],
            'grados' => [
                'Maternal','Sala de 2','Sala de 3','Sala de 4','Sala de 5','1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria', '7° Primaria', '1° Secundaria', '2° Secundaria', '3° Secundaria', '4° Secundaria', '5° Secundaria', '6° Secundaria', '7° Secundaria'
            ],
            'conditions' => [
                'Ninguna','Celiaquia','Vegetariano','Vegano'
            ],
        ]);
    }

    // Guardar nuevo
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => ['required','string','max:100'],
            'lastname'  => ['required','string','max:100'],
            'dni'       => ['required','string','max:20','unique:children,dni'],
            'school'    => ['nullable','string','max:150'],
            'grado'     => ['nullable','string','max:50'],
            'condition' => ['nullable','string','max:100'],
        ]);

        $data['user_id'] = $request->user()->id;

        Children::create($data);

        return redirect()->route('children.index')
            ->with('success', 'Hijo creado correctamente.');
    }

    public function show(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('Children/View', [
            'child' => $child,
        ]);
    }

    public function edit(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('Children/Edit', [
            'child' => $child,
            'schools' => [
                'Juan XXIII','Santisimo Redentor','Colegio Buenos Aires'
            ],
            'grados' => [
                'Maternal','Sala de 2','Sala de 3','Sala de 4','Sala de 5','1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria', '7° Primaria', '1° Secundaria', '2° Secundaria', '3° Secundaria', '4° Secundaria', '5° Secundaria', '6° Secundaria', '7° Secundaria'
            ],
            'conditions' => [
                'Ninguna','Celiaquia','Vegetariano','Vegano'
            ],
        ]);
    }

    public function update(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validate([
            'name'      => ['required','string','max:100'],
            'lastname'  => ['required','string','max:100'],
            'dni'       => ['required','string','max:20','unique:children,dni,' . $child->id],
            'school'    => ['nullable','string','max:150'],
            'grado'     => ['nullable','string','max:50'],
            'condition' => ['nullable','string','max:100'],
        ]);

        $child->update($data);

        return redirect()->route('children.index')->with('success', 'Alumno actualizado correctamente.');
    }

    public function destroy(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }

        $child->delete();

        return redirect()
            ->route('children.index')
            ->with('success', 'Alumno eliminado correctamente.');
    }
}
