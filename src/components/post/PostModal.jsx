import React, { useState, useEffect } from 'react';
import { agregarComentario, obtenerComentarios } from '../../services/api'; 
import './PostModal.css';

const PostModal = ({ post, onClose }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
         const comentarios = await obtenerComentarios(post._id);
         setComentarios(comentarios);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };
    fetchComentarios();
  }, [post._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const commentData = {
      author,
      text,
      post: post._id
    };
  
    try {
      const response = await agregarComentario(commentData);
      
      if(!response.error){

        const nuevosComentarios = await obtenerComentarios(post._id);
        setComentarios(nuevosComentarios);
        setAuthor('');
        setText('');

      }else{
        setErrorMessage("Error al agregar el comentario.");
      }
    }catch(error){
      setErrorMessage("Error al agregar el comentario.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}> X </button>
        <img src={post.urlImage} className="modal-image" />
        <h2>{post.title}</h2>
        <p className="post-text">{post.text}</p>
        <p className="post-meta">{post.date} - {post.category.name}</p>
        
        <div className="comentarios-list">
          <h4>Comentarios({comentarios.length})</h4>
          {comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <div key={comentario._id} className="comentario-item">
                <strong>{comentario.author}</strong>
                <p>{comentario.text}</p>
                <small>{(comentario.createdAt).slice(0,10)}</small>
              </div>
            ))
          ) : (
            <p>No hay comentarios aún</p>
          )}
        </div>
        <div className="comment-section">
          <h4>Agregar Comentario</h4>
          <form onSubmit={handleSubmit}>
            <input
              className="comment-input"
              name='author'
              type="text"
              placeholder="Tu nombre"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              
            />
            
            <textarea
              name='text'
              placeholder="Escribe un comentario..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="comment-textarea"
              rows="4"
            />
           
            <button type="submit" className="comment-submit-btn">Comentar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;