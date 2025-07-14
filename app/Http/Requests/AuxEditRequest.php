<?php

namespace App\Http\Requests;

class AuxEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    protected function indexMessages(): array
    {
        return [
            'name.required' => 'Obrigatório.',
            'name.string' => 'Deve ser texto.',
            'name.max' => 'Não deve ter mais de 255 caracteres.',
        ];
    }
}
