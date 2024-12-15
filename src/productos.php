<?php
$conn = new mysqli('db', 'syb_user', 'syb_password', 'salud_bienestar');

if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Productos</h1>
    </header>
    <nav>
        <ul>
            <li><a href="index.php">Inicio</a></li>
            <li><a href="agregar_producto.php">Agregar Producto</a></li>
            <li><a href="contacto.html">Contacto</a></li>
        </ul>
    </nav>
    <main>
        <section>
            <h2>Nuestros Productos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $query = "SELECT * FROM productos";
                    $result = $conn->query($query);

                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            echo "<tr>
                                    <td>" . htmlspecialchars($row['nombre']) . "</td>
                                    <td>$" . number_format($row['precio'], 2) . "</td>
                                    <td>" . htmlspecialchars($row['descripcion']) . "</td>
                                    <td>
                                        <a href='editar_producto.php?id=" . $row['id'] . "' class='btn btn-edit'>Editar</a>
                                    </td>
                                  </tr>";
                        }
                    } else {
                        echo "<tr><td colspan='4'>No hay productos disponibles.</td></tr>";
                    }
                    ?>
                </tbody>
            </table>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Salud y Bienestar</p>
    </footer>
</body>
</html>
