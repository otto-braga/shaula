<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
