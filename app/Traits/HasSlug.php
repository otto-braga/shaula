<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    protected static function bootHasSlug()
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $slug = '';

                if (isset($model->title)) {
                    $slug = (string) Str::slug($model->title);
                } else if (isset($model->name)) {
                    $slug = (string) Str::slug($model->name);
                }

                $model->slug = $slug;
            }
        });

        static::created(function ($model) {
            if (static::where('slug', $model->slug)->count() > 1) {
                $model->update(['slug' => $model->slug.'-'.$model->id]);
            }
        });
    }
}
