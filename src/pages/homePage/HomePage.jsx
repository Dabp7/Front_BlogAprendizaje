import React, { useEffect, useState } from "react";
import './HomePage.css';
import PostCard from '../../components/post/PostCard';
import { listarPost } from '../../services/api';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    useEffect(() => {
        const fetchPosts = async () => {
          const response = await listarPost();
      
          if (response?.error) {
            setErrorMessage("Error al cargar los posts.");
            return;
          }
      
          const data = response.data.posts;
      
          if (!data || data.length === 0) {
            setErrorMessage("Sin datos en la base de datos.");
          } else {
            setPosts(data);
          }
        };
      
        fetchPosts();
    }, []);

    const filteredPost = posts.filter((post) => {
        // Filtro por búsqueda
        const titulo = post.title?.toLowerCase() || '';
        const autor = post.author?.toLowerCase() || '';
        
        // Filtro por categoría
        const categoriaMatch = selectedCategory === 'Todas' || 
                             post.category?.name === selectedCategory;
        
        const searchMatch = titulo.includes(searchTerm.toLowerCase()) ||
                          autor.includes(searchTerm.toLowerCase());
        
        return categoriaMatch && searchMatch;
    });

    return (
        <div className="home-container">
          <header className="header">
            <h1>Blog de aprendizaje</h1>
          </header>

          <div className="search-container">
            <div className="search-bar">
              <input
                  type="text"
                  placeholder="Buscar por título o autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
              />
              <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
              >
                  <option value="Todas">Todas</option>
                  <option value="Taller III">Taller III</option>
                  <option value="Tecnología III">Tecnología III</option>
                  <option value="Práctica Supervisada">Práctica Supervisada</option>
              </select>
            </div>
          </div>

          <div className="homepage-container">
            <div className="posts-grid">
              {errorMessage ? (
                <p className="error-message">{errorMessage}</p>
              ) : filteredPost.length === 0 ? (
                <p className="no-results">No se encontraron resultados</p>
              ) : (
                filteredPost.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    title={post.title}
                    text={post.category.description}
                    date={post.date}
                    category={post.category}
                    author={post.author}
                    urlImage={post.urlImage}
                    status={post.status}
                  />
                ))
              )}
            </div>
          </div>
        </div>
    );
};

export default HomePage;