<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ExhibitEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'authors_uuids' => ['nullable', 'array'],
            'authors_uuids.*' => ['string', Rule::exists('people', 'uuid')],
            'periods_uuids' => ['nullable', 'array'],
            'periods_uuids.*' => ['string', Rule::exists('periods', 'uuid')],
            'categories_uuids' => ['nullable', 'array'],
            'categories_uuids.*' => ['string', Rule::exists('categories', 'uuid')],
            'awards_uuids' => ['nullable', 'array'],
            'awards_uuids.*' => ['string', Rule::exists('awards', 'uuid')],
            'artworks_uuids' => ['nullable', 'array'],
            'artworks_uuids.*' => ['string', Rule::exists('artworks', 'uuid')],
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
            'authors_uuids.*.string' => 'Deve ser um índice válido.',
            'authors_uuids.*.exists' => 'O autor deve existir.',
            'periods_uuids.array' => 'Deve ser uma lista de índices.',
            'periods_uuids.*.string' => 'Deve ser um índice válido.',
            'periods_uuids.*.exists' => 'O período deve existir.',
            'categories_uuids.array' => 'Deve ser uma lista de índices.',
            'categories_uuids.*.string' => 'Deve ser um índice válido.',
            'categories_uuids.*.exists' => 'A categoria deve existir.',
            'awards_uuids.array' => 'Deve ser uma lista de índices.',
            'awards_uuids.*.string' => 'Deve ser um índice válido.',
            'awards_uuids.*.exists' => 'O prêmio deve existir.',
            'artworks_uuids.array' => 'Deve ser uma lista de índices.',
            'artworks_uuids.*.string' => 'Deve ser um índice válido.',
            'artworks_uuids.*.exists' => 'A obra deve existir.',
        ];
    }
}
