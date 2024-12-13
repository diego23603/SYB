const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 3000;
require('dotenv').config();


app.use(express.static(__dirname + '/src/css'));  
app.use(express.static(__dirname + '/src/js'));   
// No es necesario servir la carpeta html, ya que usaremos EJS como motor de plantillas

// Configuración para usar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/html'); // Define correctamente la ruta a las vistas EJS

// Configurar el middleware para leer el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true', // Convierte el valor de la cadena a booleano
  },
});


// Configurar las rutas
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');  // Cambiado a renderizar login.ejs
});

app.get('/register', (req, res) => {
  res.render('register'); // Cambiado a renderizar register.ejs
});

app.get('/dashboard', async (req, res) => {
  try {
    // Obtener todos los productos
    const result = await pool.query('SELECT * FROM products');
    const products = result.rows;
    res.render('dashboard', { products }); // Renderiza dashboard.ejs con productos
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.send('Error al obtener productos');
  }
});

app.get('/add-product', (req, res) => {
  res.render('add-product'); // Cambiado a renderizar add-product.ejs
});

// Ruta para registrar un usuario
app.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Verifica que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.send('Las contraseñas no coinciden');
  }

  try {
    // Verifica si el correo electrónico ya está registrado
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.send('El correo electrónico ya está registrado');
    }

    // Inserta el nuevo usuario en la base de datos
    await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
    res.redirect('/login'); // Redirige al login sin mensaje
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.send('Error al registrar el usuario');
  }
});

// Ruta para hacer login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      // Usuario encontrado, iniciar sesión
      res.redirect('/dashboard'); // Redirige al dashboard sin mensaje
    } else {
      res.send('Credenciales incorrectas');
    }
  } catch (err) {
    console.error(err);
    res.send('Error en la base de datos');
  }
});

// Ruta para agregar un producto
app.post('/add-product', async (req, res) => {
  const { name, description, price, stock } = req.body;

  try {
    await pool.query('INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4)', [name, description, price, stock]);
    res.redirect('/dashboard'); // Redirige al dashboard después de agregar producto
  } catch (err) {
    console.error('Error al agregar el producto:', err);
    res.send('Error al agregar el producto');
  }
});

// Ruta para eliminar un producto
app.post('/delete-product', async (req, res) => {
  const { id } = req.body;

  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.redirect('/dashboard'); // Redirige al dashboard después de eliminar
  } catch (err) {
    console.error('Error al eliminar el producto:', err);
    res.send('Error al eliminar el producto');
  }
});

// Ruta para editar un producto

app.get('/edit-product/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener los datos del producto desde la base de datos
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.send('Producto no encontrado');
    }

    const product = result.rows[0];

    // Renderizar la página de edición de producto con los datos del producto
    res.render('edit-product', { product });
  } catch (err) {
    console.error('Error al obtener el producto:', err);
    res.send('Error al obtener el producto');
  }
});


app.post('/edit-product', async (req, res) => {
  const { id, name, description, price, stock } = req.body;

  console.log('Datos recibidos:', req.body);  // Verifica que los datos lleguen correctamente al servidor

  if (!name || !description || !price || !stock) {
    return res.send('Todos los campos son obligatorios.');
  }

  try {
    await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5',
      [name, description, price, stock, id]
    );
    res.redirect('/dashboard'); // Redirige al dashboard después de editar el producto
  } catch (err) {
    console.error('Error al editar el producto:', err);
    res.send('Error al editar el producto');
  }
});




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
