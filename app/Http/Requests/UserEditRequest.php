<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UserEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'role_uuid' => ['required', 'string', Rule::exists('roles', 'uuid')],
            'password' => ['nullable', 'string', 'min:3', 'max:255']
        ];
    }

    protected function indexMessages(): array
    {
        return [
            'role_uuid.required' => 'Obrigatório.',
            'role_uuid.string' => 'Deve ser texto.',
            'role_uuid.exists' => 'Deve ser uma função válida.',
            'password.string' => 'Deve ser texto.',
            'password.min' => 'Deve ter no mínimo :min caracteres.',
            'password.max' => 'Deve ter no máximo :max caracteres.',
        ];
    }
}
