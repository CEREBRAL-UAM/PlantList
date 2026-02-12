FROM node:20

WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias dentro del contenedor
RUN npm install

# Copiamos el resto del código del frontend
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Ejecutamos Vite en modo desarrollo accesible desde fuera
CMD ["npm", "run", "dev", "--", "--host"]