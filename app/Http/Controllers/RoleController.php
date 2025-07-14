<?php

namespace App\Http\Controllers;

use App\Http\Requests\FetchRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RoleController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Role::class);

        $roles = Role::query();

        if (!Gate::allows('dev', Role::class)) {
            $roles = $roles->where('name', '!=', 'dev');
        }

        $roles = $roles->where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('label', 'like', '%' . request()->q . '%');
                }
            })
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/roles/index', [
            'roles' => RoleResource::collection($roles),
        ]);
    }


    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(FetchRequest $request)
    {
        Gate::authorize('view', Role::class);

        $request->validated();

        return Role::fetchAsSelectOptions($request->q);
    }

    public function fetchAllSelectOptions()
    {
        Gate::authorize('view', Role::class);

        return Role::fetchAllAsSelectOptions();
    }
}
