<?php
$servername = "db";
$username = "syb_user";
$password = "syb_password";
$database = "salud_bienestar";

$conn = new mysqli($servername, $username, $password, $database);

$id = $_GET["id"];

$sql = "DELETE FROM productos WHERE id=$id";
if ($conn->query($sql) === TRUE) {
    echo "Producto eliminado exitosamente!";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
<a href="productos.php">Volver a la lista de productos</a>
