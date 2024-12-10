# Usar PHP-FPM con una versión estable
FROM php:8.1-fpm

# Instalar dependencias necesarias, incluyendo Nginx y PHP-MySQL
RUN apt-get update && apt-get install -y \
    nginx \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mysqli gd

# Copiar los archivos de la aplicación web al directorio raíz de Nginx
COPY src/ /var/www/html/

# Copiar la configuración de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Ajustar permisos para garantizar el acceso
RUN chmod -R 755 /var/www/html

# Exponer el puerto 80 para el contenedor
EXPOSE 80

# Iniciar PHP-FPM y Nginx al iniciar el contenedor
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
