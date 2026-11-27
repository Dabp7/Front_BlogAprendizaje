import axios from "axios";
const configured =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/kinaloop/v1/";
const api = axios.create({
  baseURL: `${configured.replace(/\/+$/, "")}/`,
  timeout: 8000,
});
function failure(error) {
  if (axios.isCancel(error)) throw error;
  const message = error.response?.data?.message;
  throw new Error(
    typeof message === "string" && message.length < 300
      ? message
      : error.response
        ? "La API no pudo completar la solicitud. Intentá nuevamente."
        : "No se pudo conectar con la API. Revisá la conexión y reintentá.",
  );
}
export async function listarPost(signal) {
  try {
    const { data } = await api.get("post/", { signal });
    if (!Array.isArray(data.posts))
      throw new Error("La API devolvió un listado de publicaciones inválido.");
    return data.posts;
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error;
    return failure(error);
  }
}
export async function obtenerComentarios(idPost, signal) {
  try {
    const { data } = await api.get(
      `comment/getCommentsByPost/${encodeURIComponent(idPost)}`,
      { signal },
    );
    if (!Array.isArray(data.comments))
      throw new Error("La API devolvió un listado de comentarios inválido.");
    return data.comments;
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error;
    return failure(error);
  }
}
export async function agregarComentario(comment) {
  try {
    const { data } = await api.post("comment/addComment/", comment);
    if (!data.comment?._id)
      throw new Error(
        "No se pudo confirmar el comentario. Actualizá la lista antes de volver a enviarlo.",
      );
    return data.comment;
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error;
    return failure(error);
  }
}
