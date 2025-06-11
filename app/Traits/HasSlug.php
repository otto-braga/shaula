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

    protected static function booted()
    {
        // Update the slug on update if title or name is set
        static::updating(function ($model) {
            if (isset($model->title) || isset($model->name)) {
                $slug = (string) Str::slug($model->title ?? $model->name);
                $model->slug = $slug;
            }
        });
    }
}
