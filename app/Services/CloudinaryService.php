<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    private ?Cloudinary $client = null;

    private function client(): Cloudinary
    {
        if ($this->client === null) {
            $this->client = new Cloudinary(
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

        return $this->client;
    }

    public function upload(UploadedFile $file, string $folder = 'kidelya'): string
    {
        $result = $this->client()->uploadApi()->upload(
            $file->getRealPath(),
            ['folder' => $folder]
        );

        return $result['secure_url'];
    }

    public function delete(string $url): void
    {
        if (!str_contains($url, 'cloudinary.com')) {
            return;
        }

        preg_match('/\/upload\/(?:v\d+\/)?(.+)\.\w+$/', $url, $matches);
        if (!empty($matches[1])) {
            $this->client()->uploadApi()->destroy($matches[1]);
        }
    }
}
