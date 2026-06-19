<?php

namespace App\Notifications;

use App\Models\PackUser;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionExpiringNotification extends Notification
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
            ->subject('Votre abonnement expire dans 3 jours')
            ->greeting("Bonjour {$notifiable->firstname} !")
            ->line("Votre abonnement au pack **{$this->subscription->pack->name}** expire le **{$this->subscription->expirationdate}**.")
            ->line('Renouvelez votre abonnement pour continuer à profiter de toutes les activités.')
            ->action('Renouveler mon abonnement', config('app.frontend_url'))
            ->line('À bientôt sur Kidelya !');
    }
}
