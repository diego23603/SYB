<?php
$servername = "db";
$username = "syb_user";
$password = "syb_password";
$database = "salud_bienestar";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
echo "Conexión exitosa a la base de datos!";
?>
