# Blog de aprendizaje · frontend

Lectura de publicaciones y participación mediante comentarios, conectado a [Back_BlogAprendizaje](https://github.com/Dabp7/Back_BlogAprendizaje). React, Vite, Axios y React Router. Mantiene el propósito académico del proyecto y usa datos sintéticos para la demo.

## Ejecutar

```sh
git clone https://github.com/Dabp7/Front_BlogAprendizaje.git
cd Front_BlogAprendizaje
npm ci
npm run dev
```

Configure `.env` a partir de `.env.example` si la API no está en `http://localhost:3000/kinaloop/v1/`. `VITE_API_BASE_URL` incluye el prefijo de las rutas; nunca incluya credenciales en variables Vite porque se publican en el navegador. El backend debe permitir el origen local y tener su seed de demostración.

## Recorrido de la demo

1. Con la API detenida aparece un error comprensible y el botón Reintentar publicaciones. Iníciela y reintente sin recargar la página.
2. Abra una publicación. Los comentarios distinguen carga, listado vacío y error con su propio reintento.
3. Envíe nombre vacío o comentario muy corto: la UI explica el límite y no envía una petición inválida.
4. Escriba un nombre de 2 a 80 caracteres y comentario de 3 a 1000. Al publicarlo aparece en el listado y se limpia el formulario.
5. Si falla la API durante el envío, el texto permanece para revisarlo. Cerrar con Escape devuelve el foco al botón de lectura.

La búsqueda y la categoría se combinan. Una API vacía se distingue de filtros sin resultados. La interfaz se puede recorrer con teclado y se adapta a 390 px sin scroll horizontal.

## Contrato con el backend

- `GET post/` devuelve `{posts: [...]}`.
- `GET comment/getCommentsByPost/:id` devuelve `{comments: [...]}`.
- `POST comment/addComment/` recibe `{author,text,post}` y devuelve `{comment: {...}}` tras persistirlo.
- Los errores usan un `message` público; las respuestas no válidas no se interpretan como listas vacías ni como envíos exitosos.

El backend vuelve a validar límites y referencias: la validación del navegador no es una medida de autorización. No comparta datos privados en los comentarios de una demo pública.

## Comprobaciones

```sh
npm run lint
npm run build
npx playwright install chromium
npm test
```

Playwright cubre API detenida/reintento, carga y vacío, filtros, comentarios inválidos y válidos, error de envío conservando texto, Escape/foco y ancho móvil. Estas pruebas usan respuestas HTTP controladas para reproducir fallos.

Para comprobar además el recorrido con MongoDB y backend reales, prepare su seed y ejecute:

```powershell
$env:BLOG_LIVE='1'
npm test
```

El test live crea un comentario sintético en la base de demo; use una base exclusiva de pruebas. Se omite explícitamente si `BLOG_LIVE` no está definido. El resultado de las comprobaciones ejecutadas está en `docs/verification.md`.

El build queda en `dist`. Para producción, configure la URL real de la API antes de compilar y sirva `index.html` como fallback de React Router. CI ejecuta instalación limpia, lint, build y Playwright.
