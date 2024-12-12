<?php

// Database connection settings
$host = 'localhost';
$db = 'gallery';
$user = 'root';
$pass = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Cloudinary configuration
require '../vendor/autoload.php'; // Ensure you have installed Cloudinary's PHP SDK

use Cloudinary\Cloudinary;

$cloudinary = new Cloudinary([
    'cloud' => [
        'cloud_name' => 'mgenius',
        'api_key' => '819296365857262',
        'api_secret' => 'sRfgRyVDNrVT2aMHsBouqfDYKgM'
    ],
]);

$response = ['success' => false];

try {
    if (!empty($_FILES['files']['name']) && isset($_POST['titles']) && isset($_POST['descriptions'])) {
        $titles = $_POST['titles'];
        $descriptions = $_POST['descriptions'];

        $uploadedUrls = [];

        foreach ($_FILES['files']['tmp_name'] as $index => $tmpName) {
            $fileName = $_FILES['files']['name'][$index];
            $fileType = $_FILES['files']['type'][$index];
            $title = $titles[$index];
            $description = $descriptions[$index];

            // Upload file to Cloudinary
            $uploadResult = $cloudinary->uploadApi()->upload($tmpName, [
                'resource_type' => str_starts_with($fileType, 'video/') ? 'video' : 'image',
            ]);

            $fileUrl = $uploadResult['secure_url'];

            // Save to database
            $stmt = $pdo->prepare("INSERT INTO uploads (title, description, file_type, file_url) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $description, $fileType, $fileUrl]);

            $uploadedUrls[] = $fileUrl;
        }

        $response['success'] = true;
        $response['fileUrls'] = $uploadedUrls;
    } else {
        $response['error'] = 'Invalid input: Files, titles, and descriptions are required.';
    }
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
