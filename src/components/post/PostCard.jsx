import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PostModal from "./PostModal.jsx";
import '../../pages/homePage/HomePage.css';

const PostCard = ({ post }) => {
    const [showModal, setShowModal] = useState(false);
    const { title, text, date, category, author, urlImage, status } = post;



  return (
    <div className={`post-card ${status ? '' : 'inactive'}`}>
      {urlImage && <img src={urlImage} alt="Post" className="post-image" />}

      <div className="post-header">
        <h3 className="post-title">{title}</h3>
        <span className="post-author">@{author}</span>
      </div>

      <p className="post-text">{category.description}</p>
      <p className="post-meta">{date} - {category.name}</p>

      <div className="comment-section">
          <button onClick={() => setShowModal(true)} className="comment-button">
            Ver Más...
          </button>
        </div>

      {showModal && <PostModal post={post} onClose={() => setShowModal(false)} />}

    </div>
  );
};

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  category: PropTypes.string,
  author: PropTypes.string.isRequired,
  urlImage: PropTypes.string,
  status: PropTypes.bool.isRequired,
};

export default PostCard;
