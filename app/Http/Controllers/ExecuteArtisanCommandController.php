<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class ExecuteArtisanCommandController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $command)
    {
        try {
            // Validate the command input to prevent arbitrary command execution
            if (!preg_match('/^[a-zA-Z0-9:._-]+$/', $command)) {
                return response()->json(['error' => 'Invalid command'], 400);
            }

            if ($command === 'deploy') {
                $output = Artisan::output();

                file_put_contents(base_path('.env'), str_replace(
                    'SESSION_DRIVER=database',
                    'SESSION_DRIVER=file',
                    file_get_contents(base_path('.env'))
                ));



                Artisan::call('config:clear');
                $output .= Artisan::output();

                Artisan::call('event:clear');
                $output .= Artisan::output();

                Artisan::call('view:clear');
                $output .= Artisan::output();

                Artisan::call('route:clear');
                $output .= Artisan::output();



                Artisan::call('cache:clear');
                $output .= Artisan::output();



                Artisan::call("storage:link");
                $output .= Artisan::output();

                Artisan::call('migrate:fresh', ['--seed' => true]);
                $output .= Artisan::output();

                file_put_contents(base_path('.env'), str_replace(
                    'SESSION_DRIVER=file',
                    'SESSION_DRIVER=database',
                    file_get_contents(base_path('.env'))
                ));

                return response()->json([
                    'output' => $output,
                    'status' => 'success'
                ]);
            }
            else if ($command === 'migrate-fresh-seed') {
                // Special case for 'migrate-fresh-seed' command
                Artisan::call('migrate:fresh', ['--seed' => true]);

                return response()->json([
                    'output' => Artisan::output(),
                    'status' => 'success'
                ]);
            }
            else if (!Artisan::hasCommand($command)) {
                return response()->json(['error' => 'Command not found'], 404);
            }

            // Execute the artisan command
            Artisan::call($command, $request->all());

            // Return the output of the command
            return response()->json([
                'output' => Artisan::output(),
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            // Handle any exceptions that occur during command execution
            return response()->json([
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
}
