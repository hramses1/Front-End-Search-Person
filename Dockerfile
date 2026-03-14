# Etapa 1: Build y compilación (Node)
FROM node:20-alpine as build-stage

# Configurar directorio de trabajo
WORKDIR /app

# Copiar configuración de dependencias y package
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el grueso de la aplicación
COPY . .

# Construir para ambiente de producción
RUN npm run build

# Etapa 2: Servidor estático ultra ligero con NGINX
FROM nginx:alpine as production-stage

# Remover contenido default de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar el built de Vite (dist)
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar archivo local de conf de Nginx opcional si existe (o usar default para SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Comando para correr nginx
CMD ["nginx", "-g", "daemon off;"]
