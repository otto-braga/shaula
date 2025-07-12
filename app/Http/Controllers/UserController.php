<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\ParsesUuids;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserController extends Controller
{
    use
        ParsesUuids,
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', User::class);

        $users = User::query();

        if (!Gate::allows('dev', User::class)) {
            $users = $users->where('name', '!=', 'dev');
        }

        $users = $users->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
        ]);
    }

    public function edit(User $user)
    {
        Gate::authorize('update', User::class);

        return Inertia::render('admin/users/edit', [
            'user' => new UserResource($user)
        ]);
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('update', User::class);

        try {
            $role = Role::where('uuid', $request->role_uuid)->first();

            if ($role) {
                $user->role()->associate($role);
                $user->save();
            }

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', User::class);

        try {
            $user->delete();

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', User::class);

        return User::fetchAsSelectOptions($request->q);
    }
}
