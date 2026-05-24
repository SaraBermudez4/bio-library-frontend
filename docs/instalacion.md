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
- `NEXT_PUBLIC_USE_MOCKS=true` — usa mocks locales, no requiere backend
- `BACKEND_URL=http://localhost:8090/api` — apunta al API gateway (punto de entrada único del backend)

## Backend
Para desarrollo real, levanta los microservicios backend (ver documentación del backend).

---

## Ver esta documentación (Docsify)

1. Instala Docsify CLI (solo la primera vez):
   ```bash
   npm install -g docsify-cli
   ```
2. Sirve la documentación:
   ```bash
   docsify serve docs
   ```
3. Abre `http://localhost:3000` en el navegador.

---