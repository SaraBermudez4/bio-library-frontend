# Instalación y Ejecución

## Requisitos
- Node.js 20+
- npm

## Pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/SaraBermudez4/bio-library-frontend
   cd bio-library-frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de entorno:
   ```bash
   cp .env.local.example .env.local
   ```
4. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno
- `NEXT_PUBLIC_USE_MOCKS=true` (usa mocks locales)
- `BACKEND_URL=http://localhost:8080/api` (para backend real)

## Backend
Para desarrollo real, levanta los microservicios backend (ver documentación del backend).

---