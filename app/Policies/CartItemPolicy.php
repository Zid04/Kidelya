<?php

namespace App\Policies;

use App\Models\CartItem;
use App\Models\User;

class CartItemPolicy
{
    public function update(User $user, CartItem $cartItem): bool
    {
        return $cartItem->iduser === $user->iduser;
    }

    public function delete(User $user, CartItem $cartItem): bool
    {
        return $cartItem->iduser === $user->iduser;
    }
}
