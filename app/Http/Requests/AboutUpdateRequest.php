<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AboutUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240'],
            'files.*' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'files_to_remove' => ['nullable', 'array'],
            'files_to_remove.*' => ['string'],
        ];
    }

    /**
     * Custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'title' => 'título',
            'content' => 'conteúdo',
            'cover_image' => 'imagem de capa',
            'files' => 'arquivos',
        ];
    }
}
