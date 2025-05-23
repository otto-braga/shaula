<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class ConnectionChecker
{
    public static function isDatabaseReady($connection = null)
    {
        $isReady = true;
        try {
            DB::connection($connection)->getPdo();
        } catch (\Exception $e) {
            $isReady = false;
        }

        dd($isReady);

        return $isReady;
    }

    public static function isRedisReady($connection = null)
    {
        $isReady = true;
        try {
            $redis = Redis::connection($connection);
            $redis->connect();
            $redis->disconnect();
        } catch (\Exception $e) {
            $isReady = false;
        }

        dd($isReady);

        return $isReady;
    }
}
