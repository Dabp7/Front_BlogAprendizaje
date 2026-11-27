# Verificación

Fecha: 2026-11-27. Windows, Node22.15.0 y npm10.9.2.

- `npm ci` / instalación inicial: aprobada.
- `npm run lint`: aprobado.
- `npm run build`: aprobado, Vite6.4.6 y111 módulos.
- `npm audit fix` y auditoría posterior: cero vulnerabilidades.
- `BLOG_LIVE=1 npm test`: cinco pruebas Playwright aprobadas. Cuatro usan fallos/control de red deterministas; la quinta usa Back_BlogAprendizaje real en localhost3000, MongoDB8 replica set temporal y seed sintético.
- Prueba real: API rechaza comentario inválido con400; la UI publica uno válido y lo vuelve a leer después de recargar. No usa mocks en ese recorrido.
- Escape restituye foco, los errores conservan formulario, y390px no produce overflow horizontal.
- Captura de la demo real en `docs/blog-mobile.png`.

Se mantuvieron rutas y contrato del backend. Se corrigieron labels explícitos para que el nombre accesible del textarea siga estable después de escribir y validar.
