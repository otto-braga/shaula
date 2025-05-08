<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Facades\Schema;

class Mention extends Model
{
    use HasFactory;

    protected $table = 'mentions';

    protected $fillable = [
        'mentioner_id',
        'mentioner_type',
        'mentioned_id',
        'mentioned_type',
    ];

    public function getNameAttribute()
    {
        return $this->mentioned->name ?? $this->mentioned->title;
    }

    public function getMentionedNameAttribute()
    {
        return $this->mentioned->name ?? $this->mentioned->title;
    }

    public function getMentionerNameAttribute()
    {
        return $this->mentioner->name ?? $this->mentioner->title;
    }

    // public function mentionedArtworks(): MorphToMany
    // {
    //     return $this->morphedByMany(Artwork::class, 'mentioned', 'mentions');
    // }

    // public function mentionerArtworks(): MorphToMany
    // {
    //     return $this->morphedByMany(Artwork::class, 'mentioner', 'mentions');
    // }


    public function mentioned()
    {
        return $this->morphTo();
    }

    public function mentioner()
    {
        return $this->morphTo();
    }

    public function scopeMentionedClass($builder, $class)
    {
        $instances_ids = $builder->with('mentioned')
            ->where('mentioned_type', $class)
            ->get()
            ->pluck('mentioned_id')
            ->unique();

        return $class::whereIn('id', $instances_ids);
    }

    public function scopeMentionerClass($builder, $class)
    {
        $instances_ids = $builder->with('mentioner')
            ->where('mentioner_type', $class)
            ->get()
            ->pluck('mentioner_id')
            ->unique();

        return $class::whereIn('id', $instances_ids);
    }
}
