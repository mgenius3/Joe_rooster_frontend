<?php
// Database connection
//dev
// $host = "localhost";
// $user = "root";
// $password = "root";
// $database = "review_system";

//prod
$host = "localhost";
$user = "joeroote_admin";
$password = "SQs8rxBq4AAFFnp";
$database = "joeroote_review_system";

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Fetch testimonials from database
$sql = "SELECT name, review_title, rating, review_comment FROM reviews ORDER BY created_at DESC LIMIT 5";
$result = $conn->query($sql);

$testimonials = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $testimonials[] = $row;
    }
}

// Send response
header('Content-Type: application/json');
echo json_encode($testimonials);

$conn->close();
?>