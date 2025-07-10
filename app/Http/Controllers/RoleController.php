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

    public function store(Request $request)
    {
        try {
            Role::create([
                'name' => $request->name,
            ]);

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function update(Request $request, Role $role)
    {
        try {
            $role->update([
                'name' => $request->name,
            ]);

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function destroy(Role $role)
    {
        try {
            $role->delete();

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return Role::fetchAsSelectOptions($request->q);
    }
}
