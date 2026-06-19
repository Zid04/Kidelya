<?php

namespace App\Notifications;

use App\Models\Pack;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionConfirmedNotification extends Notification
{
    public function __construct(
        private readonly Pack $pack
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Abonnement confirmé — {$this->pack->name}")
            ->greeting("Bonjour {$notifiable->firstname} !")
            ->line("Votre abonnement au pack **{$this->pack->name}** est maintenant actif.")
            ->line('Vous avez accès à toutes les activités incluses dans ce pack.')
            ->action('Accéder à mon espace', config('app.frontend_url'))
            ->line('Merci de votre confiance !');
    }
}
