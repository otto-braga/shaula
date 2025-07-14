<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class SourceEditRequest extends BaseEditRequest
{
    protected function indexRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'source_categories_uuids' => ['nullable', 'array'],
            'source_categories_uuids.*' => ['uuid', Rule::exists('categories', 'uuid')],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx'],
            'delete_file' => ['nullable', 'boolean'],
            'content' => ['nullable', 'string'],
        ];
    }

    protected function indexMessages(): array
    {
        return [
            'title.required' => 'Obrigatório.',
            'title.string' => 'Deve ser texto.',
            'title.max' => 'Não deve ter mais de 255 caracteres.',
            'source_categories_uuids.array' => 'Deve ser uma lista de índices.',
            'source_categories_uuids.*.uuid' => 'Deve ser um índice válido.',
            'source_categories_uuids.*.exists' => 'A categoria deve existir.',
            'files.array' => 'Deve ser uma lista de arquivos.',
            'files.*.file' => 'Deve ser um arquivo válido.',
            'files.*.mimes' => 'Os arquivos devem ser do tipo: jpg, jpeg, png, pdf, doc, docx, xls, xlsx.',
            'delete_file.boolean' => 'Deve ser verdadeiro ou falso.',
            'content.string' => 'Deve ser texto.',
        ];
    }
}
