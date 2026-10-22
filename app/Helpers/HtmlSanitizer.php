<?php

namespace App\Helpers;

class HtmlSanitizer
{
    /**
     * Strip external inline typography, spacing, color, and background styles
     * from pasted HTML while preserving semantic formatting and text-align.
     */
    public static function clean(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        // Remove Word/Office comments and XML namespace tags
        $cleaned = preg_replace('/<!--[\s\S]*?-->/', '', $html) ?? $html;
        $cleaned = preg_replace('/<\/?(?:o|w|m|v):[^>]*>/i', '', $cleaned) ?? $cleaned;

        // Remove <script>, <style>, <meta>, <link> tags
        $cleaned = preg_replace('/<(script|style)[^>]*>[\s\S]*?<\/\1>/i', '', $cleaned) ?? $cleaned;
        $cleaned = preg_replace('/<(meta|link)[^>]*\/?>/i', '', $cleaned) ?? $cleaned;

        // Unwrap legacy <font> tags
        $cleaned = preg_replace('/<\/?font[^>]*>/i', '', $cleaned) ?? $cleaned;

        // Remove external class, face, size, color, bgcolor, lang attributes
        $cleaned = preg_replace('/\s+(?:class|face|size|color|bgcolor|lang)=("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $cleaned) ?? $cleaned;

        // Filter inline style attributes to only preserve text-align
        $cleaned = preg_replace_callback('/\s+style=(["\'])(.*?)\1/is', function (array $matches) {
            $styleString = $matches[2];
            $allowedAlign = ['left', 'right', 'center', 'justify', 'start', 'end'];
            $kept = [];

            foreach (explode(';', $styleString) as $declaration) {
                if (! str_contains($declaration, ':')) {
                    continue;
                }
                [$prop, $val] = explode(':', $declaration, 2);
                $prop = strtolower(trim($prop));
                $val = strtolower(trim($val));

                if ($prop === 'text-align' && in_array($val, $allowedAlign, true)) {
                    $kept[] = "text-align: {$val}";
                }
            }

            return count($kept) > 0 ? ' style="' . implode('; ', $kept) . '"' : '';
        }, $cleaned) ?? $cleaned;

        // Unwrap empty <span>...</span> tags without attributes
        $previous = null;
        while ($previous !== $cleaned) {
            $previous = $cleaned;
            $cleaned = preg_replace('/<span>([\s\S]*?)<\/span>/i', '$1', $cleaned) ?? $cleaned;
        }

        return $cleaned;
    }
}
