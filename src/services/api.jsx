import axios from "axios";

const apiBlogAprendizaje = axios.create({
  baseURL: "http://localhost:3000/kinaloop/v1/",
  timeout: 3000,
});

export const listarPost = async () => {
    try{
      return await apiBlogAprendizaje.get("post/");
    }catch(error){
      return { error: true, 
        message: error.message
        };
    }
  };

export const agregarComentario = async (data) => {
    try {
      return await apiBlogAprendizaje.post("comment/addComment/", data);
    } catch (error) {
      return { error: true, message: error.message };
    }
};

export const obtenerComentarios = async (idPost) => {
    try {
      const response = await apiBlogAprendizaje.get(`comment/getCommentsByPost/${idPost}`);
      return response.data.comments;
    } catch (error) {
      return { 
        error: true, 
        message: error.message
      };
    }
  };