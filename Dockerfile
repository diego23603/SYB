FROM nginx:latest

# Instalar PHP y extensiones necesarias
RUN apt-get update && apt-get install -y \
    php-fpm \
    php-mysql

# Copiar los archivos de la aplicación al directorio raíz del servidor web
COPY src/ /usr/share/nginx/html/

# Copiar la configuración de Nginx para PHP
COPY default.conf /etc/nginx/conf.d/default.conf
# Iniciar PHP-FPM junto con Nginx
CMD ["sh", "-c", "php-fpm7.4 -D && nginx -g 'daemon off;'"]
