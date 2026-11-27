import { useState } from "react";
import PropTypes from "prop-types";
import PostModal from "./PostModal.jsx";
export default function PostCard({ post }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="post-card">
      {post.urlImage ? (
        <img
          src={post.urlImage}
          alt=""
          className="post-image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      ) : null}
      <div className="post-header">
        <span className="post-category">
          {post.category?.name ?? "General"}
        </span>
        <h2 className="post-title">{post.title}</h2>
        <span className="post-author">
          Por {post.author || "Equipo del blog"}
        </span>
      </div>
      <p className="post-text">
        {post.category?.description ?? post.text?.slice(0, 180)}
      </p>
      <p className="post-meta">{post.date ?? ""}</p>
      <button
        onClick={() => setOpen(true)}
        className="comment-button"
        aria-label={`Leer ${post.title}`}
      >
        Leer y comentar
      </button>
      {open ? <PostModal post={post} onClose={() => setOpen(false)} /> : null}
    </article>
  );
}
PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    urlImage: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    }),
  }).isRequired,
};
