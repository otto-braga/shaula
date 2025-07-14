<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UserEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'role_uuid' => ['required', 'string', Rule::exists('roles', 'uuid')],
        ];
    }

    protected function indexMessages(): array
    {
        return [
            'role_uuid.required' => 'Obrigatório.',
            'role_uuid.string' => 'Deve ser texto.',
            'role_uuid.exists' => 'Deve ser uma função válida.',
        ];
    }
}
