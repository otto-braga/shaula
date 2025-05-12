<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MentionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mention_types = collect(config('mention_types'));

        foreach (config('mention_types') as $mention_type) {
            $type = $mention_type['type'];
            $query = $type::all();
            $query->each(function ($item) use ($mention_types) {
                $mentioner = $item;
                for ($i = 0; $i < rand(0, 6); $i++) {
                    $mentioned = $mention_types->shuffle()->first()['type']::inRandomOrder()->first();
                    $mentioner->mentioned()->create([
                        'mentioner_id' => $mentioner->id,
                        'mentioner_type' => $mentioner::class,
                        'mentioned_id' => $mentioned->id,
                        'mentioned_type' => $mentioned::class,
                    ]);
                    $mentioner->save();
                }
            });
        }
    }
}
