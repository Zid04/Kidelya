<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function newsletter(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|max:150',
        ]);

        Mail::raw(
            "Nouvelle inscription newsletter : {$data['email']}",
            function ($mail) use ($data) {
                $mail->to(config('mail.from.address'))
                     ->subject('Nouvelle inscription newsletter')
                     ->replyTo($data['email']);
            }
        );

        return response()->json(['message' => 'Inscription confirmée.']);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:5000',
        ]);

        Mail::raw(
            "Nom : {$data['name']}\nEmail : {$data['email']}\n\n{$data['message']}",
            function ($mail) use ($data) {
                $mail->to(config('mail.from.address'))
                     ->subject($data['subject'])
                     ->replyTo($data['email'], $data['name']);
            }
        );

        return response()->json(['message' => 'Message envoyé avec succès.']);
    }
}
