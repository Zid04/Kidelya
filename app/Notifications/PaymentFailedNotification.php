<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Échec du paiement')
            ->greeting("Bonjour {$notifiable->firstname} !")
            ->line('Nous avons rencontré un problème lors du traitement de votre paiement.')
            ->line('Veuillez vérifier vos informations de paiement et réessayer.')
            ->action('Mettre à jour mon paiement', config('app.frontend_url'))
            ->line('Si le problème persiste, contactez notre support.');
    }
}
