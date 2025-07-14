<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ReviewEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'authors_uuids' => ['nullable', 'array'],
            'authors_uuids.*' => ['uuid', Rule::exists('people', 'uuid')],
            'categories_uuids' => ['nullable', 'array'],
            'categories_uuids.*' => ['uuid', Rule::exists('categories', 'uuid')],
        ];
    }

    protected function indexMessages(): array
    {
        return [
            'title.required' => 'Obrigatório.',
            'title.string' => 'Deve ser texto.',
            'title.max' => 'Não deve ter mais de 255 caracteres.',
            'date.date' => 'Deve ser uma data válida.',
            'authors_uuids.array' => 'Deve ser uma lista de índices.',
            'authors_uuids.*.uuid' => 'Deve ser um índice válido.',
            'authors_uuids.*.exists' => 'O autor deve existir.',
            'categories_uuids.array' => 'Deve ser uma lista de índices.',
            'categories_uuids.*.uuid' => 'Deve ser um índice válido.',
            'categories_uuids.*.exists' => 'A categoria deve existir.',
        ];
    }
}
