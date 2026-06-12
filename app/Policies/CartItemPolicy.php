<?php

namespace App\Policies;

use App\Models\CartItem;
use App\Models\User;

class CartItemPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function update(User $user, CartItem $cartItem): bool
    {
        return $cartItem->iduser === $user->iduser;
    }

    public function delete(User $user, CartItem $cartItem): bool
    {
        return $cartItem->iduser === $user->iduser;
    }
}
