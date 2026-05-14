<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Services\UserService;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    /**
     * LIST USERS 
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        return response()->json([
            'data' => $this->userService->getPaginated(10)
        ]);
    }

    /**
     * SHOW USER
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return response()->json([
            'data' => $user->load([
                'role',
                'children',
                'ideas',
                'activities',
                'groups',
                'packSubscriptions'
            ])
        ]);
    }

    /**
     * CREATE USER
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $user = $this->userService->create($request->validated());

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    /**
     * UPDATE USER
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $this->userService->update($user, $request->validated())
        ]);
    }

    /**
     * DEACTIVATE USER 
     */
    public function deactivate(User $user): JsonResponse
    {
        $this->authorize('update', $user);

        return response()->json([
            'message' => 'User deactivated successfully',
            'data' => $this->userService->deactivate($user)
        ]);
    }

    /**
     * DELETE USER
     */
    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $this->userService->delete($user);

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
