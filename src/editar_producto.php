<?php
// Conectar a la base de datos
$conn = new mysqli('db', 'syb_user', 'syb_password', 'salud_bienestar');

// Verificar conexión
if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}

// Obtener el ID del producto desde la URL
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Consultar los datos del producto
$query = $conn->prepare("SELECT * FROM productos WHERE id = ?");
$query->bind_param("i", $id);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo "Producto no encontrado.";
    exit;
}

$producto = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Producto</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Editar Producto</h1>
    </header>
    <nav>
        <ul>
            <li><a href="index.php">Inicio</a></li>
            <li><a href="productos.php">Productos</a></li>
            <li><a href="agregar_producto.php">Agregar Producto</a></li>
            <li><a href="contacto.html">Contacto</a></li>
        </ul>
    </nav>
    <main>
        <section>
            <h2>Editar Producto</h2>
            <form action="procesar_editar_producto.php" method="POST">
                <input type="hidden" name="id" value="<?php echo $producto['id']; ?>">
                <label for="nombre">Nombre del producto:</label>
                <input type="text" id="nombre" name="nombre" value="<?php echo htmlspecialchars($producto['nombre']); ?>" required>

                <label for="precio">Precio:</label>
                <input type="number" id="precio" name="precio" value="<?php echo htmlspecialchars($producto['precio']); ?>" required>

                <label for="descripcion">Descripción:</label>
                <textarea id="descripcion" name="descripcion" required><?php echo htmlspecialchars($producto['descripcion']); ?></textarea>

                <button type="submit" class="btn">Guardar Cambios</button>
            </form>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Salud y Bienestar</p>
    </footer>
</body>
</html>
