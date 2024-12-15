<?php
$conn = new mysqli('db', 'syb_user', 'syb_password', 'salud_bienestar');

if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$nombre = $_POST['nombre'];
$precio = $_POST['precio'];
$descripcion = $_POST['descripcion'];

$query = $conn->prepare("UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?");
$query->bind_param("sdsi", $nombre, $precio, $descripcion, $id);

if ($query->execute()) {
    header("Location: productos.php");
    exit;
} else {
    echo "Error al actualizar el producto: " . $query->error;
}
?>
