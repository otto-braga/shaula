<?php

namespace Tests\Feature;

use App\Http\Requests\ExhibitEditRequest;
use App\Http\Resources\ExhibitResource;
use App\Models\Exhibit;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ExhibitDateTest extends TestCase
{
    use RefreshDatabase;

    public function test_exhibits_table_has_start_date_and_end_date_and_no_date_column()
    {
        $this->assertTrue(Schema::hasColumn('exhibits', 'start_date'));
        $this->assertTrue(Schema::hasColumn('exhibits', 'end_date'));
        $this->assertFalse(Schema::hasColumn('exhibits', 'date'));
    }

    public function test_exhibit_model_casts_start_date_and_end_date_to_carbon()
    {
        $exhibit = Exhibit::create([
            'title' => 'Exposição Histórica',
            'start_date' => '2025-03-01',
            'end_date' => '2025-05-15',
        ]);

        $this->assertInstanceOf(Carbon::class, $exhibit->start_date);
        $this->assertInstanceOf(Carbon::class, $exhibit->end_date);
        $this->assertSame('2025-03-01', $exhibit->start_date->format('Y-m-d'));
        $this->assertSame('2025-05-15', $exhibit->end_date->format('Y-m-d'));
    }

    public function test_exhibit_resource_transforms_dates_to_iso_date_strings()
    {
        $exhibit = Exhibit::create([
            'title' => 'Mostra de Arte',
            'start_date' => '2024-10-10',
            'end_date' => '2024-11-20',
        ]);

        $resource = (new ExhibitResource($exhibit))->toArray(Request::create('/'));

        $this->assertSame('2024-10-10', $resource['start_date']);
        $this->assertSame('2024-11-20', $resource['end_date']);
        $this->assertArrayNotHasKey('date', $resource);
    }

    public function test_exhibit_validation_rules_for_dates()
    {
        $rules = (new class extends ExhibitEditRequest {
            public function getRules(): array {
                return $this->indexRules();
            }
        })->getRules();

        // 1. Both valid and end_date >= start_date
        $v1 = Validator::make([
            'title' => 'Título',
            'start_date' => '2025-01-01',
            'end_date' => '2025-06-01',
        ], $rules);
        $this->assertTrue($v1->passes());

        // 2. Both null
        $v2 = Validator::make([
            'title' => 'Título',
            'start_date' => null,
            'end_date' => null,
        ], $rules);
        $this->assertTrue($v2->passes());

        // 3. Only start_date provided
        $v3 = Validator::make([
            'title' => 'Título',
            'start_date' => '2025-01-01',
            'end_date' => null,
        ], $rules);
        $this->assertTrue($v3->passes());

        // 4. Only end_date provided
        $v4 = Validator::make([
            'title' => 'Título',
            'start_date' => null,
            'end_date' => '2025-06-01',
        ], $rules);
        $this->assertTrue($v4->passes());

        // 5. end_date before start_date should fail
        $v5 = Validator::make([
            'title' => 'Título',
            'start_date' => '2025-06-01',
            'end_date' => '2025-01-01',
        ], $rules);
        $this->assertFalse($v5->passes());
        $this->assertArrayHasKey('end_date', $v5->errors()->toArray());

        // 6. Invalid date format should fail
        $v6 = Validator::make([
            'title' => 'Título',
            'start_date' => 'not-a-date',
            'end_date' => null,
        ], $rules);
        $this->assertFalse($v6->passes());
        $this->assertArrayHasKey('start_date', $v6->errors()->toArray());
    }
}
