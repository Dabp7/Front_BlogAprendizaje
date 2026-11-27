import { useEffect, useId, useRef, useState } from "react";
import PropTypes from "prop-types";
import { agregarComentario, obtenerComentarios } from "../../services/api";
import "./PostModal.css";
export default function PostModal({ post, onClose }) {
  const dialog = useRef(null),
    titleId = useId(),
    submitLock = useRef(false);
  const [author, setAuthor] = useState(""),
    [text, setText] = useState(""),
    [comments, setComments] = useState([]),
    [status, setStatus] = useState("loading");
  const [loadError, setLoadError] = useState(""),
    [submitError, setSubmitError] = useState(""),
    [success, setSuccess] = useState(""),
    [attempt, setAttempt] = useState(0),
    [sending, setSending] = useState(false);
  useEffect(() => {
    const element = dialog.current,
      previous = document.activeElement,
      overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (element.open) element.close();
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setLoadError("");
    obtenerComentarios(post._id, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setComments(items);
          setStatus("ready");
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setLoadError(error.message);
          setStatus("error");
        }
      });
    return () => controller.abort();
  }, [post._id, attempt]);
  async function submit(event) {
    event.preventDefault();
    if (submitLock.current) return;
    setSubmitError("");
    setSuccess("");
    const cleanAuthor = author.trim(),
      cleanText = text.trim();
    if (cleanAuthor.length < 2 || cleanAuthor.length > 80) {
      setSubmitError("Tu nombre debe tener entre 2 y 80 caracteres.");
      return;
    }
    if (cleanText.length < 3 || cleanText.length > 1000) {
      setSubmitError("El comentario debe tener entre 3 y 1000 caracteres.");
      return;
    }
    submitLock.current = true;
    setSending(true);
    try {
      const comment = await agregarComentario({
        author: cleanAuthor,
        text: cleanText,
        post: post._id,
      });
      setComments((previous) => [
        comment,
        ...previous.filter((item) => item._id !== comment._id),
      ]);
      setAuthor("");
      setText("");
      setSuccess("Comentario publicado. Gracias por participar.");
    } catch (error) {
      setSubmitError(
        `${error.message} Conservamos tu texto para que puedas revisarlo.`,
      );
    } finally {
      submitLock.current = false;
      setSending(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="post-dialog"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Cerrar publicación"
        >
          Cerrar
        </button>
        <span className="post-category">
          {post.category?.name ?? "General"}
        </span>
        <h2 id={titleId}>{post.title}</h2>
        <p className="post-text article-body">{post.text}</p>
        <p className="post-meta">
          {post.date} · {post.author}
        </p>
        <section aria-label="Comentarios" aria-busy={status === "loading"}>
          <h3>Comentarios ({comments.length})</h3>
          {status === "loading" ? (
            <p role="status">Cargando comentarios…</p>
          ) : status === "error" ? (
            <div role="alert">
              <p>{loadError}</p>
              <button onClick={() => setAttempt((value) => value + 1)}>
                Reintentar comentarios
              </button>
            </div>
          ) : !comments.length ? (
            <p>
              No hay comentarios todavía. Podés ser la primera persona en
              participar.
            </p>
          ) : null}
          <div className="comentarios-list">
            {comments.map((comment) => (
              <article key={comment._id} className="comentario-item">
                <strong>{comment.author}</strong>
                <p>{comment.text}</p>
                <time dateTime={comment.createdAt}>
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString("es")
                    : ""}
                </time>
              </article>
            ))}
          </div>
        </section>
        <section className="comment-section">
          <h3>Agregar comentario</h3>
          <form onSubmit={submit} noValidate>
            <label htmlFor={`${titleId}-author`}>Tu nombre</label>
            <input
              id={`${titleId}-author`}
              className="comment-input"
              name="author"
              autoComplete="name"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              maxLength={80}
              disabled={sending}
            />
            <label htmlFor={`${titleId}-comment`}>Tu comentario</label>
            <textarea
              id={`${titleId}-comment`}
              className="comment-textarea"
              name="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={1000}
              rows={4}
              disabled={sending}
            />
            <p className="form-help">
              Nombre de 2 a 80 caracteres. Comentario de 3 a 1000. No compartas
              información privada.
            </p>
            {submitError ? (
              <p className="form-error" role="alert">
                {submitError}
              </p>
            ) : null}
            <p role="status">{success}</p>
            <button
              className="comment-submit-btn"
              type="submit"
              disabled={sending}
            >
              {sending ? "Publicando…" : "Publicar comentario"}
            </button>
          </form>
        </section>
      </div>
    </dialog>
  );
}
PostModal.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.shape({ name: PropTypes.string }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
