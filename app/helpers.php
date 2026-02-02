<?php

if (!function_exists('storageUrl')) {
    /**
     * Generate a URL for a storage file
     *
     * @param string|null $path
     * @return string
     */
    function storageUrl(?string $path): string
    {
        if (!$path) {
            return '';
        }
        
        return asset('storage/' . $path);
    }
}
