import { useEffect, useState } from "react";
import "./HomePage.css";
import PostCard from "../../components/post/PostCard";
import { listarPost } from "../../services/api";
export default function HomePage() {
  const [posts, setPosts] = useState([]),
    [status, setStatus] = useState("loading"),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState("Todas");
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError("");
    listarPost(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setPosts(items);
          setStatus("ready");
        }
      })
      .catch((reason) => {
        if (!controller.signal.aborted) {
          setError(reason.message);
          setStatus("error");
        }
      });
    return () => controller.abort();
  }, [attempt]);
  const categories = [
    ...new Set(posts.map((post) => post.category?.name).filter(Boolean)),
  ];
  const filtered = posts.filter(
    (post) =>
      (category === "Todas" || post.category?.name === category) &&
      `${post.title ?? ""} ${post.author ?? ""}`
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <main className="home-container">
      <header className="header">
        <p className="eyebrow">LECTURAS, IDEAS Y PRÁCTICA</p>
        <h1>Blog de aprendizaje</h1>
        <p>Explorá publicaciones y sumá tu comentario a la conversación.</p>
      </header>
      <div className="search-container">
        <div className="search-bar">
          <label>
            Buscar por título o autor
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="search-input"
            />
          </label>
          <label>
            Categoría
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="category-select"
            >
              <option>Todas</option>
              {categories.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <section
        className="homepage-container"
        aria-label="Publicaciones"
        aria-busy={status === "loading"}
      >
        {status === "loading" ? (
          <div className="feed-state" role="status">
            <h2>Cargando publicaciones…</h2>
            <p>Estamos consultando el blog.</p>
          </div>
        ) : status === "error" ? (
          <div className="feed-state" role="alert">
            <h2>No pudimos cargar las publicaciones</h2>
            <p>{error}</p>
            <button onClick={() => setAttempt((value) => value + 1)}>
              Reintentar publicaciones
            </button>
          </div>
        ) : !posts.length ? (
          <div className="feed-state">
            <h2>Todavía no hay publicaciones</h2>
            <p>Volvé pronto para encontrar nuevas lecturas.</p>
            <button onClick={() => setAttempt((value) => value + 1)}>
              Actualizar publicaciones
            </button>
          </div>
        ) : !filtered.length ? (
          <div className="feed-state">
            <h2>No hay resultados con estos filtros</h2>
            <button
              onClick={() => {
                setSearch("");
                setCategory("Todas");
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {filtered.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
      <footer className="blog-footer">
        Proyecto académico · Contenido de demostración en el seed local
      </footer>
    </main>
  );
}
