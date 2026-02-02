<?php
// Create database script
$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'atsense_db';

try {
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $conn->exec($sql);
    
    echo "Database '$database' created successfully!\n";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
