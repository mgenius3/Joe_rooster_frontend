<?php
// Database connection
//dev
// $servername = "localhost";
// $username = "root";
// $password = "root";
// $dbname = "gallery";

//prod
$host = "localhost";
$user = "joeroote_admin";
$password = "SQs8rxBq4AAFFnp";
$dbname = "joeroote_gallery";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Collect form data
$files = $_POST['files']; 
$titles = $_POST['titles']; 
$descriptions = $_POST['descriptions']; 
$filetypes = $_POST['filetypes']; 

// Insert data into MySQL database
for ($i = 0; $i < count($files); $i++) {
    $file_url = $files[$i];
    $title = $titles[$i];
    $description = $descriptions[$i];
    $file_type = $filetypes[$i];

    $stmt = $conn->prepare("INSERT INTO uploads (file_url, title, description, file_type) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $file_url, $title, $description, $file_type);

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "error" => $stmt->error]);
        exit;
    }
}

echo json_encode(["success" => true]);
$conn->close();
?>
