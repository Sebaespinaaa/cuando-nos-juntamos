# Cuando nos juntamos 🗓️

Aplicación web para coordinar y gestionar reuniones entre personas. Construida con **Next.js 14**, **Supabase** y **Tailwind CSS**.

## Stack tecnológico

- [Next.js 14](https://nextjs.org/) — Framework React con App Router
- [Supabase](https://supabase.com/) — Base de datos PostgreSQL + autenticación
- [Tailwind CSS](https://tailwindcss.com/) — Estilos utilitarios
- [TypeScript](https://www.typescriptlang.org/) — Tipado estático
- [date-fns](https://date-fns.org/) — Manejo de fechas
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Hash de contraseñas

## Requisitos previos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com/)

## Instalación

1. **Clona el repositorio:**

```bash
git clone https://github.com/Sebaespinaaa/cuando-nos-juntamos.git
cd cuando-nos-juntamos
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura las variables de entorno:**

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configura la base de datos:**

Ejecuta el schema en tu proyecto de Supabase:

```bash
# Desde el SQL Editor de Supabase, ejecuta el contenido de:
supabase/schema.sql
```

5. **Inicia el servidor de desarrollo:**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter |

## Estructura del proyecto

```
src/
├── app/              # Rutas y páginas (App Router)
│   ├── admin/        # Panel de administración
│   ├── api/          # API Routes
│   ├── login/        # Página de login
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Página principal
├── components/       # Componentes reutilizables
├── contexts/         # Contextos de React
├── hooks/            # Custom hooks
├── lib/              # Utilidades y configuración (Supabase client, etc.)
├── middleware.ts     # Middleware de autenticación
└── types/            # Tipos TypeScript
supabase/
└── schema.sql        # Schema de la base de datos
```

## Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase (solo servidor) | ✅ |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación | ✅ |

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard de Vercel
3. Vercel detectará automáticamente Next.js y realizará el build

## Licencia

MIT
