<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Bienvenue sur Kidelya !')
            ->greeting("Bonjour {$notifiable->firstname} !")
            ->line('Nous sommes ravis de vous accueillir sur Kidelya.')
            ->line('Découvrez nos activités et packs disponibles pour vos enfants.')
            ->action('Découvrir Kidelya', config('app.frontend_url'))
            ->line('À bientôt sur Kidelya !');
    }
}
