<?php

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class About extends Model
{
    use HasFactory, HasUuid, HasFiles;

    protected $table = 'abouts';

    protected $fillable = [
        'title',
        'content',
    ];

    /**
     * Enforce single-row singleton logic for the About model.
     */
    protected static function booted(): void
    {
        static::creating(function (About $about) {
            if (static::query()->exists()) {
                throw new \RuntimeException('Apenas um registro da página Sobre pode existir.');
            }
        });

        static::deleting(function (About $about) {
            throw new \RuntimeException('O registro da página Sobre não pode ser excluído.');
        });
    }

    /**
     * Fetch the singleton About record or create a default instance if absent.
     */
    public static function current(): self
    {
        $about = static::query()->first();

        if (! $about) {
            $about = static::create([
                'title' => 'Sobre',
                'content' => '',
            ]);
        }

        return $about;
    }

    /**
     * Polymorphic files relation.
     */
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    /**
     * Polymorphic cover image relation (collection 'cover' or primary image).
     */
    public function coverImage(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where(function ($query) {
                $query->where('collection', 'cover')
                    ->orWhere('is_primary', true);
            })
            ->latestOfMany();
    }

    /**
     * Accessor for cover_image.
     */
    public function getCoverImageAttribute()
    {
        return $this->getRelationValue('coverImage');
    }

    /**
     * Polymorphic image files relation.
     */
    public function images(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')
            ->where('mime_type', 'like', 'image%');
    }
}
