<div align="center">
  <h1>🛡️ Portal SRI - FrontEnd Inteligente</h1>
  <p>Interfaz Premium, Minimalista y Segura construida en <b>Vue 3 + TypeScript</b> y estilizada con <b>TailwindCSS</b> y Glassmorphism para las consultas demográficas y de vehículos.</p>

  [![Vue.js](https://img.shields.io/badge/Vue.js-3.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

<br />

## 🌟 Características

* **Diseño "Obsidian"**: Una paleta desaturada profunda, neomorfismo táctil y bordes extrafinos (0.5px) para minimizar distracciones.
* **Autenticación en 2 Fases**: Integrado al flujo del Backend (PocketBase Proxy), obteniendo primero acceso de colección y validando silenciosamente en segundo plano el Token Master de Consultas.
* **Seguridad (Hardening)**: 
  * Mitigación XSS en renderizado de Vistas usando **DOMPurify**.
  * Almacenamiento seguro usando el ecosistema efímero **SessionStorage**.
  * Validación de Datos Estricta soportando expresiones regulares en formularios HTMl5 (ej: Obliga a 10 dígitos en la búsqueda de Cédulas).
* **Renderizador Dinámico**: Adiós a los JSON crudos. Los resultados de consultas Complejas o Listas de personas se convierten en cuadrículas animadas de Tarjetas Estilizadas automáticamente.
* **Despliegues en un Clic**: Aprovisionado y preparado con reglas estrictas (Headers Content-Security-Policy & anti-clickjacking) para `Vercel` y empaquetado ultra ligero en `Docker`.

## ⚙️ Consultas Soportadas
El panel lateral permite a los usuarios acreditados conectarse a la `API SRI` consultando:
1. Nombres y Apellidos
2. Estado RUC y Establecimientos
3. Cédula y Datos Demográficos
4. Tipos de Licencias
5. Citaciones y Deudas Activas
6. Registro e Historial de Denuncias
7. Propietarios de Vehículos por número de Placa

---

## 🛠️ Instalación y Uso (Desarrollo Local)

Asegúrate de tener [Node.js](https://nodejs.org/es) (versión 18+ recomendada) corriendo en tu máquina. 

1. **Clonar** tu Repositorio:
   ```bash
   git clone git@github.com:hramses1/Front-End-Search-Person.git
   cd Front-End-Search-Person
   ```
2. **Instalar Dependencias**:
   ```bash
   npm install
   ```
3. **Correr el Backend**:
   Asegúrate que tu servidor FastAPI esté corriendo en `http://127.0.0.1:8000/`. El `apiService.ts` intentará despachar todas las peticiones allí.
4. **Alimentar el Servidor Frontend**:
   ```bash
   npm run dev
   ```
   > Ahora dirígete a **`http://localhost:5173/`** en tu navegador.

---

## 🐳 Despliegue con Docker (Opcional - Producción)
El repositorio cuenta con un entorno aislado multifase en Alpine para desplegar una versión de producción ultra veloz sobre un WebServer Nginx nativo.
```bash
# Construir la imagen local
docker build -t portal-sri-frontend .

# Ejecutar el contenedor escuchando en el puerto 8080 del Host local
docker run -d -p 8080:80 portal-sri-frontend
```

## 🛸 Despliegue hacia Vercel
Simplemente vincula este repositorio utilizando Vercel CLI o su consola visual. El archivo `vercel.json` se encargará de inyectar los Headers Estrictos y el Router nativo gestionará tu Single Page Application sin arrojar errores `404` en enlaces compartidos.
