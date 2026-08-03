# Guía de Administración — Libertarian Forum

## Sitio

**URL**: https://libertarian-nine.vercel.app

## Acceso al panel

**Admin**: https://libertarian-nine.vercel.app/admin/login

**Atajo**: triple click rápido sobre "LIBERTARIAN FORUM" en el footer de cualquier página.

## Credenciales

- **Email**: `admin@libertarianforum.org`
- **Contraseña**: `Admin123*`

## Crear un ensayo o artículo

1. Entrá al admin → click en **+ NUEVO ARTÍCULO**
2. Completá:
   - **Título** — se genera el slug automáticamente si lo dejás vacío
   - **Idioma** — Español o English
   - **Tipo** — Ensayo o Artículo de opinión
   - **Categoría** — ej: Filosofía, Economía, Política
   - **Autor** — nombre del autor
   - **Descripción corta** — para las tarjetas
   - **Imagen destacada** — opcional (botón "Elegir imagen destacada")
   - **Contenido** — editor rich text (negrita, cursiva, títulos, listas, tablas, imágenes, videos, embeds)
3. Click en **Guardar artículo**

El artículo aparece automáticamente en `/es/ensayos` o `/en/essays`.

## Editar o eliminar

Desde el dashboard del admin, cada artículo tiene botones para **editar** y **eliminar**.

## URLs públicas

| Página | Español | Inglés |
|--------|---------|--------|
| Inicio | `/es` | `/en` |
| Ensayos | `/es/ensayos` | `/en/essays` |
| Nosotros | `/es/nosotros` | `/en/about` |
| Servicios | `/es/servicios` | `/en/services` |
| Contacto | `/es/contacto` | `/en/contact` |

## Cambiar contraseña

La contraseña se cambia generando un nuevo hash bcrypt y actualizando `ADMIN_PASSWORD_HASH`:

```bash
pnpm hash-password "NuevaContraseña*"
```

Copiá el hash resultante y actualizalo en:
- `.env.local` (local)
- Vercel → Project Settings → Environment Variables (producción)

Después redeployá: `pnpm exec vercel --prod`

## Base de datos

- **Proveedor**: Supabase (Postgres)
- **Panel**: https://supabase.com/dashboard/project/srdocibthufmudavokgi
- **Schema**: se sube con `pnpm db:push`
- **Inspeccionar**: `pnpm db:studio`
