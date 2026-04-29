'use strict';

/* =========================
   API SERVICE
========================= */

const ApiService = {
  baseUrl: 'https://jsonplaceholder.typicode.com',

  /**
   * Método genérico para hacer peticiones HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      // fetch NO lanza error en 4xx/5xx - debemos verificar response.ok
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  },

  /**
   * GET - Obtener todos los posts
   */
  async getPosts(limit = 10) {
    return this.request(`/posts?_limit=${limit}`);
  },

  /**
   * GET - Obtener un post por ID
   */
  async getPostById(id) {
    return this.request(`/posts/${id}`);
  },

  /**
   * POST - Crear un nuevo post
   */
  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  /**
   * PUT - Actualizar un post completo
   */
  async updatePost(id, postData) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    });
  },

  /**
   * DELETE - Eliminar un post
   */
  async deletePost(id) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * GET - Buscar posts por userId
   */
  async getPostsByUser(userId) {
    return this.request(`/posts?userId=${userId}`);
  }
};