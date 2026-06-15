<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    private Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key'    => config('cloudinary.api_key'),
                    'api_secret' => config('cloudinary.api_secret'),
                ],
                'url' => ['secure' => true],
            ])
        );
    }

    public function upload(UploadedFile $file, string $folder = 'kidelya'): string
    {
        $result = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            ['folder' => $folder]
        );

        return $result['secure_url'];
    }

    public function delete(string $url): void
    {
        // Extraire le public_id depuis l'URL Cloudinary
        // ex: https://res.cloudinary.com/dappcav1h/image/upload/v123/kidelya/activities/abc.jpg
        if (!str_contains($url, 'cloudinary.com')) {
            return;
        }

        preg_match('/\/upload\/(?:v\d+\/)?(.+)\.\w+$/', $url, $matches);
        if (!empty($matches[1])) {
            $this->cloudinary->uploadApi()->destroy($matches[1]);
        }
    }
}
