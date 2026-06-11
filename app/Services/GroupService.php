<?php

namespace App\Services;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GroupService
{
    public function getAllForUser(User $user): Collection
    {
        return Group::where('iduser', $user->iduser)->latest()->get();
    }

    public function create(array $data, User $user): Group
    {
        $data['iduser'] = $user->iduser;
        return Group::create($data);
    }

    public function update(Group $group, array $data): Group
    {
        $group->update($data);
        return $group->fresh();
    }

    public function delete(Group $group): void
    {
        $group->delete();
    }

    public function addChild(Group $group, int $childId): void
    {
        $group->children()->syncWithoutDetaching([$childId]);
    }

    public function removeChild(Group $group, int $childId): void
    {
        $group->children()->detach($childId);
    }
}
