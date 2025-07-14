<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ArtworkEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date_format:Y'],
            'dimensions' => ['nullable', 'string'],
            'materials' => ['nullable', 'string'],
            'authors_uuids' => ['nullable', 'array'],
            'authors_uuids.*' => ['string', Rule::exists('people', 'uuid')],
            'periods_uuids' => ['nullable', 'array'],
            'periods_uuids.*' => ['string', Rule::exists('periods', 'uuid')],
            'languages_uuids' => ['nullable', 'array'],
            'languages_uuids.*' => ['string', Rule::exists('languages', 'uuid')],
            'categories_uuids' => ['nullable', 'array'],
            'categories_uuids.*' => ['string', Rule::exists('categories', 'uuid')],
            'awards_uuids' => ['nullable', 'array'],
            'awards_uuids.*' => ['string', Rule::exists('awards', 'uuid')],
        ];
    }

    protected function indexMessages(): array
    {
        return [
            'title.required' => 'Obrigatório.',
            'title.string' => 'Deve ser texto.',
            'title.max' => 'Não deve ter mais de 255 caracteres.',
            'date.date' => 'Deve ser uma data válida.',
            'dimensions.string' => 'Deve ser texto.',
            'materials.string' => 'Deve ser texto.',
            'authors_uuids.array' => 'Deve ser uma lista de índices.',
            'authors_uuids.*.string' => 'Deve ser um índice válido.',
            'authors_uuids.*.exists' => 'O autor deve existir.',
            'periods_uuids.array' => 'Deve ser uma lista de índices.',
            'periods_uuids.*.string' => 'Deve ser um índice válido.',
            'periods_uuids.*.exists' => 'O período deve existir.',
            'languages_uuids.array' => 'Deve ser uma lista de índices.',
            'languages_uuids.*.string' => 'Deve ser um índice válido.',
            'languages_uuids.*.exists' => 'O idioma deve existir.',
            'categories_uuids.array' => 'Deve ser uma lista de índices.',
            'categories_uuids.*.string' => 'Deve ser um índice válido.',
            'categories_uuids.*.exists' => 'A categoria deve existir.',
            'awards_uuids.array' => 'Deve ser uma lista de índices.',
            'awards_uuids.*.string' => 'Deve ser um índice válido.',
            'awards_uuids.*.exists' => 'O prêmio deve existir.',
        ];
    }
}
