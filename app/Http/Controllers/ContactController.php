<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2',
            'email' => 'required|email',
            'message' => 'required|string|min:5',
        ]);

        Mail::to('info@tucatering.com.ar')
            ->send(new ContactMessage($validated['name'], $validated['email'], $validated['message']));

        return response()->json(['ok' => true]);
    }
}
