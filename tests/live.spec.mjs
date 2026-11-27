import { test, expect } from "@playwright/test";
test("frontend y backend reales completan lectura y comentario persistido", async ({
  page,
}) => {
  test.skip(
    !process.env.BLOG_LIVE,
    "Requiere backend local con seed y MongoDB de demo",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const api = process.env.BLOG_API_URL ?? "http://localhost:3000/kinaloop/v1";
  const { posts } = await fetch(`${api}/post/`).then((response) =>
    response.json(),
  );
  expect(posts.length).toBeGreaterThan(0);
  const post = posts[0];
  const invalid = await fetch(`${api}/comment/addComment/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author: " ", text: "ab", post: post._id }),
  });
  expect(invalid.status).toBe(400);
  const text = `Comentario sintético E2E ${Date.now()}`;
  await page.goto("/");
  await page.getByRole("button", { name: `Leer ${post.title}` }).click();
  const modal = page.getByRole("dialog");
  await modal.getByLabel("Tu nombre", { exact: true }).fill("Persona demo E2E");
  await modal.getByLabel("Tu comentario", { exact: true }).fill(text);
  await modal.getByRole("button", { name: "Publicar comentario" }).click();
  await expect(
    modal.getByText("Comentario publicado. Gracias por participar."),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: `Leer ${post.title}` }).click();
  await expect(
    page.getByRole("dialog").getByText(text, { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "docs/blog-mobile.png", fullPage: true });
});
