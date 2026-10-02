<?php

namespace Tests\Feature;

use App\Models\About;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\AboutSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles
        foreach (config('authorization.roles') as $roleName => $roleData) {
            Role::firstOrCreate(['name' => $roleName], [
                'label' => $roleData['label'],
                'description' => $roleData['description'],
            ]);
        }
    }

    private function createAdminUser(): User
    {
        $role = Role::where('name', 'admin')->first();
        $user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@shaula.test',
        ]);
        $user->role()->associate($role)->save();

        return $user;
    }

    public function test_abouts_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('abouts'));
        $this->assertTrue(Schema::hasColumn('abouts', 'id'));
        $this->assertTrue(Schema::hasColumn('abouts', 'uuid'));
        $this->assertTrue(Schema::hasColumn('abouts', 'title'));
        $this->assertTrue(Schema::hasColumn('abouts', 'content'));
        $this->assertTrue(Schema::hasColumn('abouts', 'created_at'));
        $this->assertTrue(Schema::hasColumn('abouts', 'updated_at'));
    }

    public function test_about_seeder_creates_default_record()
    {
        $this->seed(AboutSeeder::class);

        $this->assertDatabaseCount('abouts', 1);
        $about = About::first();
        $this->assertNotNull($about);
        $this->assertStringContainsString('SHAULA', $about->content);
        $this->assertStringContainsString('arte potiguar', $about->content);
    }

    public function test_about_model_enforces_single_row_logic()
    {
        $this->seed(AboutSeeder::class);
        $this->assertEquals(1, About::count());

        // Attempting to create a second row must throw an exception
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Apenas um registro da página Sobre pode existir.');

        About::create([
            'title' => 'Segundo Registro Proibido',
            'content' => 'Não deve ser permitido',
        ]);
    }

    public function test_about_model_prevents_deletion()
    {
        $this->seed(AboutSeeder::class);
        $about = About::first();

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('O registro da página Sobre não pode ser excluído.');

        $about->delete();
    }

    public function test_public_about_route_is_accessible_and_renders_inertia_component()
    {
        $this->seed(AboutSeeder::class);

        $response = $this->get(route('public.about'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('about/index')
            ->has('about')
            ->where('about.data.title', fn ($title) => !empty($title))
            ->has('about.data.content')
        );
    }

    public function test_guests_cannot_access_admin_about_routes()
    {
        $this->get(route('about.edit'))->assertRedirect('/login');
        $this->put(route('about.update'), ['content' => 'Teste'])->assertRedirect('/login');
    }

    public function test_admin_user_can_view_about_edit_form()
    {
        $this->seed(AboutSeeder::class);
        $user = $this->createAdminUser();

        $response = $this->actingAs($user)->get(route('about.edit'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/about/edit')
            ->has('about')
            ->where('about.data.id', 1)
        );
    }

    public function test_admin_user_can_update_content_and_title()
    {
        $this->seed(AboutSeeder::class);
        $user = $this->createAdminUser();

        $response = $this->actingAs($user)->put(route('about.update'), [
            'title' => 'Nova História do Shaula',
            'content' => '<p>Novo conteúdo institucional atualizado.</p>',
        ]);

        $response->assertSessionHas('success', true);
        $response->assertRedirect();

        $about = About::first();
        $this->assertEquals('Nova História do Shaula', $about->title);
        $this->assertEquals('<p>Novo conteúdo institucional atualizado.</p>', $about->content);
    }

    public function test_admin_user_can_upload_and_replace_cover_image()
    {
        Storage::fake();
        $this->seed(AboutSeeder::class);
        $user = $this->createAdminUser();

        $coverFile = UploadedFile::fake()->create('cover-test.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($user)->put(route('about.update'), [
            'title' => 'Sobre o Shaula',
            'content' => '<p>Conteúdo com imagem de capa</p>',
            'cover_image' => $coverFile,
        ]);

        $response->assertSessionHas('success', true);

        $about = About::first();
        $about->load('coverImage');
        $this->assertNotNull($about->coverImage);
        $this->assertEquals('cover', $about->coverImage->collection);
        $this->assertTrue((bool) $about->coverImage->is_primary);
        Storage::disk()->assertExists($about->coverImage->path);

        // Verify public route eager loads the cover image
        $publicResponse = $this->get(route('public.about'));
        $publicResponse->assertOk();
        $publicResponse->assertInertia(fn (Assert $page) => $page
            ->component('about/index')
            ->has('about.data.cover_image')
            ->where('about.data.cover_image.uuid', $about->coverImage->uuid)
        );
    }

    public function test_admin_user_can_remove_cover_image()
    {
        Storage::fake();
        $this->seed(AboutSeeder::class);
        $user = $this->createAdminUser();

        // First upload an image
        $coverFile = UploadedFile::fake()->create('cover-test.jpg', 100, 'image/jpeg');
        $this->actingAs($user)->put(route('about.update'), [
            'cover_image' => $coverFile,
        ]);

        $about = About::first();
        $this->assertNotNull($about->coverImage);
        $storedPath = $about->coverImage->path;
        Storage::disk()->assertExists($storedPath);

        // Now remove the cover image
        $response = $this->actingAs($user)->put(route('about.update'), [
            'remove_cover_image' => true,
        ]);

        $response->assertSessionHas('success', true);

        $about->refresh();
        $about->load('coverImage');
        $this->assertNull($about->coverImage);
        Storage::disk()->assertMissing($storedPath);
    }
}
