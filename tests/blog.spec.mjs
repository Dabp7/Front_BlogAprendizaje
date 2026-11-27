import { test, expect } from "@playwright/test";
const post = {
  _id: "507f1f77bcf86cd799439011",
  title: "Aprender con pruebas",
  text: "Un ejemplo sintético para practicar desarrollo y validación.",
  date: "2026-11-26",
  author: "Equipo demo",
  status: true,
  category: {
    name: "Taller III",
    description: "Ideas para construir y comprobar software.",
  },
};
const route = "**/kinaloop/v1/**";
test("API detenida, reintento y lectura con teclado", async ({ page }) => {
  let fail = true;
  await page.route(route, async (request) => {
    if (fail) await request.abort("failed");
    else await request.fulfill({ json: { posts: [post] } });
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "No pudimos cargar las publicaciones" }),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Reintentar publicaciones" }).click();
  await expect(page.getByRole("heading", { name: post.title })).toBeVisible();
  await page.getByLabel("Buscar por título o autor").fill("no existe");
  await expect(
    page.getByRole("heading", { name: "No hay resultados con estos filtros" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await expect(
    page.getByRole("button", { name: `Leer ${post.title}` }),
  ).toBeVisible();
});
test("loading y vacío se distinguen de un error", async ({ page }) => {
  let release;
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  await page.route(route, async (request) => {
    await pending;
    await request.fulfill({ json: { posts: [] } });
  });
  await page.goto("/");
  await expect(page.getByText("Cargando publicaciones…")).toBeVisible();
  release();
  await expect(
    page.getByRole("heading", { name: "Todavía no hay publicaciones" }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
test("valida comentarios, conserva texto ante error y publica sin doble envío", async ({
  page,
}) => {
  let submissions = 0;
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route(route, async (request) => {
    const url = request.request().url();
    if (url.includes("/post/"))
      return request.fulfill({ json: { posts: [post] } });
    if (url.includes("/getCommentsByPost/"))
      return request.fulfill({ json: { comments: [] } });
    submissions++;
    if (submissions === 1)
      return request.fulfill({
        status: 503,
        json: { message: "No se pudo publicar en este momento." },
      });
    return request.fulfill({
      status: 201,
      json: {
        comment: {
          _id: "507f1f77bcf86cd799439022",
          ...request.request().postDataJSON(),
          createdAt: "2026-11-26T12:00:00Z",
        },
      },
    });
  });
  await page.goto("/");
  const open = page.getByRole("button", { name: `Leer ${post.title}` });
  await open.click();
  const modal = page.getByRole("dialog");
  await expect(modal.getByText(/No hay comentarios todavía/)).toBeVisible();
  await modal.getByRole("button", { name: "Publicar comentario" }).click();
  await expect(modal.getByRole("alert")).toContainText("Tu nombre");
  expect(submissions).toBe(0);
  await modal.getByLabel("Tu nombre", { exact: true }).fill("Persona demo");
  await modal.getByLabel("Tu comentario", { exact: true }).fill("ab");
  await modal.getByRole("button", { name: "Publicar comentario" }).click();
  await expect(modal.getByRole("alert")).toContainText("3 y 1000");
  expect(submissions).toBe(0);
  await modal
    .getByLabel("Tu comentario", { exact: true })
    .fill("Comentario válido de demostración");
  await modal.getByRole("button", { name: "Publicar comentario" }).click();
  await expect(modal.getByRole("alert")).toContainText("Conservamos tu texto");
  await expect(modal.getByLabel("Tu comentario", { exact: true })).toHaveValue(
    "Comentario válido de demostración",
  );
  await modal.getByRole("button", { name: "Publicar comentario" }).click();
  await expect(
    modal.getByText("Comentario publicado. Gracias por participar."),
  ).toBeVisible();
  await expect(
    modal.getByText("Comentario válido de demostración", { exact: true }),
  ).toBeVisible();
  await expect(modal.getByLabel("Tu comentario", { exact: true })).toHaveValue(
    "",
  );
  await page.keyboard.press("Escape");
  await expect(modal).toHaveCount(0);
  await expect(open).toBeFocused();
  expect(errors).toEqual([]);
});
test("comentarios con error tienen reintento y móvil sin overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let fail = true;
  await page.route(route, (request) =>
    request.request().url().includes("/post/")
      ? request.fulfill({ json: { posts: [post] } })
      : fail
        ? request.fulfill({
            status: 503,
            json: { message: "Comentarios no disponibles" },
          })
        : request.fulfill({ json: { comments: [] } }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: `Leer ${post.title}` }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Comentarios no disponibles",
  );
  fail = false;
  await page.getByRole("button", { name: "Reintentar comentarios" }).click();
  await expect(page.getByText(/No hay comentarios todavía/)).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
