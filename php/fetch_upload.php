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

// Fetch data from the database
$sql = "SELECT * FROM uploads";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    // Collect rows as an array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Return JSON response
    echo json_encode(["success" => true, "data" => $data]);
} else {
    echo json_encode(["success" => false, "message" => "No records found"]);
}

$conn->close();
?>
