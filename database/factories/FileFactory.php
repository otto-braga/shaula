<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => "",
            'original_name' => "dummy",
            'path' => "",
            'collection' => "general",
            'size' => fake()->numberBetween(1, 100),
            'is_primary' => false,
            'fileable_id' => 0,
            'fileable_type' => '',
        ];
    }

    public function type($type)
    {
        $path = "png";
        if ($type == "png") {
            $path = 'png';
        } else if ($type == "pdf") {
            $path = 'pdf';
        }

        return $this->state([
            'path' => $path,
        ]);
    }

    public function configure(): static
    {
        return $this
            ->afterMaking(function (\App\Models\File $user) {
                // ...
            })->afterCreating(function (\App\Models\File $user) {
                if ($user->mime_type == "image/png") {
                    $directory = 'files/dummy';
                    $name = '_dummy_png_'.$user->id;

                    Storage::disk()->makeDirectory($directory);

                    $url = "https://dummyimage.com/" . sprintf('%04d', rand(200, 800)) . "x" . sprintf('%04d', rand(200, 800)) . "/" . sprintf('%06X', mt_rand(0, 0xFFFFFF)) . "/" . sprintf('%06X', mt_rand(0, 0xFFFFFF)) . ".png";
                    $file_storage_path = Storage::disk()->path($directory.'/'.$name.'.png');
                    $file_path = $directory.'/'.$name.'.png';

                    $user->update([
                        'path' => $file_path,
                        'name' => $name,
                    ]);

                    // Check if file already exists.
                    if (file_exists($file_storage_path)) {
                        return;
                    }

                    file_put_contents($file_storage_path, file_get_contents($url));
                    $path = Storage::putFile('s3/files/dummy/', new \Illuminate\Http\File($file_storage_path));
                }
                else if ($user->mime_type == "application/pdf") {
                    $directory = 'files/dummy';
                    $name = '_dummy_pdf_'.$user->id;

                    Storage::disk()->makeDirectory($directory);

                    $url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
                    $file_storage_path = Storage::disk()->path($directory.'/'.$name.'.pdf');
                    $file_path = $directory.'/'.$name.'.pdf';

                    $user->update([
                        'path' => $file_path,
                        'name' => $name,
                    ]);

                    // Check if file already exists.
                    if (file_exists($file_storage_path)) {
                        return;
                    }

                    file_put_contents($file_storage_path, file_get_contents($url));
                    $path = Storage::putFile('public/files/dummy/', new \Illuminate\Http\File($file_storage_path));
                }
            });
    }
}
