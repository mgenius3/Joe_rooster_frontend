<?php
// Database connection
$host = "localhost";
$user = "root";
$password = "root";
$database = "review_system";

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $conn->real_escape_string($_POST['name']);
    $reviewTitle = $conn->real_escape_string($_POST['reviewTitle']);
    $rating = (int) $_POST['rating'];
    $reviewComment = $conn->real_escape_string($_POST['reviewComment']);
    // Insert into database
    $sql = "INSERT INTO reviews (name, review_title, rating, review_comment) 
            VALUES ('$name', '$reviewTitle', $rating, '$reviewComment')";

    if ($conn->query($sql) === TRUE) {
        echo "Review submitted successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>