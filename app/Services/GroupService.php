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
        $children = $data['children'] ?? [];
        unset($data['children']);

        $data['iduser'] = $user->iduser;
        $group = Group::create($data);

        if (! empty($children)) {
            $group->children()->sync($children);
        }

        return $group;
    }

    public function update(Group $group, array $data): Group
    {
        $children = $data['children'] ?? null;
        unset($data['children']);

        $group->update($data);

        if ($children !== null) {
            $group->children()->sync($children);
        }

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

    public function addActivity(Group $group, int $activityId): void
    {
        $group->activities()->syncWithoutDetaching([$activityId]);
    }

    public function removeActivity(Group $group, int $activityId): void
    {
        $group->activities()->detach($activityId);
    }
}
