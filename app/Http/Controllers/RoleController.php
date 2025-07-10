<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        $roles = Role::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/roles/index', [
            'roles' => RoleResource::collection($roles),
        ]);
    }


    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return Role::fetchAsSelectOptions($request->q);
    }

    public function fetchAllSelectOptions()
    {
        return Role::fetchAllAsSelectOptions();
    }
}
