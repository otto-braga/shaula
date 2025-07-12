<?php

namespace App\Http\Requests;

class PersonEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'date_of_death' => ['nullable', 'date'],
            'chronology' => ['nullable', 'string'],
            'links' => ['nullable', 'string'],
            'chronology' => ['nullable', 'string'],
        ];
    }

    protected function indexMessages(): array
    {
        return [
            'name.required' => 'Obrigatório.',
            'name.string' => 'Deve ser texto.',
            'name.max' => 'Não deve ter mais de 255 caracteres.',
            'date_of_birth.date' => 'Deve ser uma data válida.',
            'date_of_death.date' => 'Deve ser uma data válida.',
            'chronology.string' => 'Deve ser texto.',
            'links.string' => 'Deve ser texto.',
            'content.string' => 'Deve ser texto.',
        ];
    }
}
