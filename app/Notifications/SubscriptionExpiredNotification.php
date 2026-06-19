<?php

namespace App\Notifications;

use App\Models\PackUser;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionExpiredNotification extends Notification
{
    public function __construct(
        private readonly PackUser $subscription
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre abonnement a expiré')
            ->greeting("Bonjour {$notifiable->firstname} !")
            ->line("Votre abonnement au pack **{$this->subscription->pack->name}** a expiré.")
            ->line('Souscrivez à nouveau pour continuer à accéder aux activités.')
            ->action('Voir les packs disponibles', config('app.frontend_url'))
            ->line('À bientôt sur Kidelya !');
    }
}
