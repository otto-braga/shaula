<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BaseEditRequest extends FormRequest
{
    private $routeName = '';

    public function prepareForValidation(): void
    {
        $this->routeName = $this->route()->getName();
        if (!$this->routeName) {
            throw new \InvalidArgumentException('Route name is not set.');
        }
        $parts = explode('.', $this->routeName, 2);
        $this->routeName = $parts[1];
    }

    public function rules(): array
    {
        if ($this->routeName === 'update') {
            return $this->indexRules();
        } elseif ($this->routeName === 'update.people') {
            return $this->peopleRules();
        } elseif ($this->routeName === 'update.images') {
            return $this->imagesRules();
        } elseif ($this->routeName === 'update.content') {
            return $this->contentRules();
        } elseif ($this->routeName === 'update.sources') {
            return $this->sourcesRules();
        }
        throw new \InvalidArgumentException('Invalid route for Request.');
    }

    public function messages(): array
    {
        if ($this->routeName === 'update') {
            return $this->indexMessages();
        } elseif ($this->routeName === 'update.people') {
            return $this->peopleMessages();
        } elseif ($this->routeName === 'update.images') {
            return $this->imagesMessages();
        } elseif ($this->routeName === 'update.content') {
            return $this->contentMessages();
        } elseif ($this->routeName === 'update.sources') {
            return $this->sourcesMessages();
        }
        throw new \InvalidArgumentException('Invalid route for Request.');
    }

    protected function indexRules(): array
    {
        return [];
    }

    protected function indexMessages(): array
    {
        return [];
    }

    protected function peopleRules(): array
    {
        return [
            'activitiesPeople' => ['nullable', 'array'],
            'activitiesPeople.*.activity_uuid' => ['required', 'string', Rule::exists('activities', 'uuid')],
            'activitiesPeople.*.activity_name' => ['required', 'string'],
            'activitiesPeople.*.person_uuid' => ['required', 'string', Rule::exists('people', 'uuid')],
            'activitiesPeople.*.person_name' => ['required', 'string'],
        ];
    }

    protected function peopleMessages(): array
    {
        return [
            'activitiesPeople.array' => 'Deve ser uma lista de atividades.',
            'activitiesPeople.*.activity_uuid.required' => 'Obrigatório.',
            'activitiesPeople.*.activity_uuid.string' => 'Deve ser um índice válido.',
            'activitiesPeople.*.activity_uuid.exists' => 'A atividade deve existir.',
            'activitiesPeople.*.activity_name.required' => 'Obrigatório.',
            'activitiesPeople.*.activity_name.string' => 'Deve ser texto.',
            'activitiesPeople.*.person_uuid.required' => 'Obrigatório.',
            'activitiesPeople.*.person_uuid.string' => 'Deve ser um índice válido.',
            'activitiesPeople.*.person_uuid.exists' => 'A pessoa deve existir.',
            'activitiesPeople.*.person_name.required' => 'Obrigatório.',
            'activitiesPeople.*.person_name.string' => 'Deve ser texto.',
        ];
    }

    protected function imagesRules(): array
    {
        return [
            'files' => ['nullable', 'array'],
            'files.*' => [
                'file',
                'mimes:jpg,jpeg,png,gif,webp,svg',
                'max:' . config('filesystems.max_file_size'),
            ],
            'files_to_remove' => ['nullable', 'array'],
            'files_to_remove.*' => [
                'string',
                Rule::exists('files', 'uuid'),
            ],
            'primary_image_uuid' => ['nullable', 'string', Rule::exists('files', 'uuid')],
        ];
    }

    protected function imagesMessages(): array
    {
        return [
            'files.array' => 'Deve ser uma lista de arquivos.',
            'files.*.file' => 'Deve ser um arquivo.',
            'files.*.mimes' => 'Deve ser um arquivo de imagem válido (jpg, jpeg, png, gif, webp, svg).',
            'files.*.max' => 'O tamanho máximo do arquivo é de :max kilobytes.',
            'files_to_remove.array' => 'Deve ser uma lista de índices.',
            'files_to_remove.*.string' => 'Deve ser um índice válido.',
            'primary_image_uuid.string' => 'Deve ser um índice válido.',
            'primary_image_uuid.exists' => 'A imagem deve existir.',
        ];
    }

    protected function contentRules(): array
    {
        return [
            'content' => ['nullable', 'string'],
            'files' => ['nullable', 'array'],
            'files.*' => [
                'file',
                'mimes:jpg,jpeg,png,gif,webp,svg',
                'max:' . config('filesystems.max_file_size'),
            ],
            'files_to_remove' => ['nullable', 'array'],
            'files_to_remove.*' => [
                'string',
                Rule::exists('files', 'uuid'),
            ],
        ];
    }

    protected function contentMessages(): array
    {
        return [
            'content.string' => 'Deve ser texto.',
            'files.array' => 'Deve ser uma lista de arquivos.',
            'files.*.file' => 'Deve ser um arquivo.',
            'files.*.mimes' => 'Deve ser um arquivo de imagem válido (jpg, jpeg, png, gif, webp, svg).',
            'files.*.max' => 'O tamanho máximo do arquivo é de :max kilobytes.',
            'files_to_remove.array' => 'Deve ser uma lista de índices.',
            'files_to_remove.*.string' => 'Deve ser um índice válido.',
        ];
    }

    protected function sourcesRules(): array
    {
        return [
            'sources_uuids' => ['nullable', 'array'],
            'sources_uuids.*' => [
                'string',
                Rule::exists('sources', 'uuid'),
            ],
        ];
    }

    protected function sourcesMessages(): array
    {
        return [
            'sources_uuids.array' => 'Deve ser uma lista de fontes.',
            'sources_uuids.*.string' => 'Deve ser um índice válido.',
            'sources_uuids.*.exists' => 'A fonte deve existir.',
        ];
    }
}
