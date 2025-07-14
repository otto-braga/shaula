<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FetchRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'q' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'q.string' => 'Deve ser texto.',
            'q.max' => 'Não deve ter mais de 255 caracteres.',
        ];
    }
}
