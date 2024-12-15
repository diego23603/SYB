<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Producto</title>
    <link rel="stylesheet" href="css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <h1>Agregar Producto</h1>
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
            <h2>Agregar Producto</h2>
            <form action="procesar_producto.php" method="POST">
                <label for="nombre">Nombre del producto:</label>
                <input type="text" id="nombre" name="nombre" required>

                <label for="precio">Precio:</label>
                <input type="number" id="precio" name="precio" required>

                <label for="descripcion">Descripción:</label>
                <textarea id="descripcion" name="descripcion" required></textarea>

                <button type="submit">Agregar Producto</button>
            </form>
        </section>
    </main>
</body>
</html>
