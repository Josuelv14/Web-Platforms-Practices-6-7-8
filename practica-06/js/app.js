'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */
const formPost = document.querySelector('#form-post');
const inputPostId = document.querySelector('#post-id');
const inputTitulo = document.querySelector('#titulo');
const inputContenido = document.querySelector('#contenido');
const btnSubmit = document.querySelector('#btn-submit');
const btnCancelar = document.querySelector('#btn-cancelar');

const inputBuscar = document.querySelector('#input-buscar');
const btnBuscar = document.querySelector('#btn-buscar');
const btnLimpiar = document.querySelector('#btn-limpiar');

const listaPosts = document.querySelector('#lista-posts');
const mensajeEstado = document.querySelector('#mensaje-estado');
const contador = document.querySelector('#contador strong');

/* =========================
   ESTADO GLOBAL
========================= */
let posts = [];
let postsFiltrados = [];
let modoEdicion = false;

/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Cargar todos los posts desde la API
 */
async function cargarPosts() {
  try {
    // TODO 6.2.1: Mostrar spinner
    mostrarCargando(listaPosts);

    // TODO 6.2.2: Obtener datos de la API
    posts = await ApiService.getPosts(20);

    // TODO 6.2.3: Clonar array para filtros
    postsFiltrados = [...posts];

    // TODO 6.2.4: Renderizar en el DOM
    renderizarPosts(postsFiltrados, listaPosts);

    // TODO 6.2.5: Actualizar el contador visual
    actualizarContador();

  } catch (error) {
    listaPosts.innerHTML = '';
    listaPosts.appendChild(MensajeError(`No se pudieron cargar los posts: ${error.message}`));
  }
}

function actualizarContador() {
  contador.textContent = postsFiltrados.length;
}

function limpiarFormulario() {
  formPost.reset();
  inputPostId.value = '';
  modoEdicion = false;
  btnSubmit.textContent = 'Crear Post';
  btnCancelar.style.display = 'none';
}

function activarModoEdicion(post) {
  modoEdicion = true;
  inputPostId.value = post.id;
  inputTitulo.value = post.title;
  inputContenido.value = post.body;
  btnSubmit.textContent = 'Actualizar Post';
  btnCancelar.style.display = 'inline-block';
  
  formPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
  inputTitulo.focus();
}

/**
 * Crear o actualizar un post
 */
async function guardarPost(datosPost) {
  try {
    btnSubmit.disabled = true;
    btnSubmit.textContent = modoEdicion ? 'Actualizando...' : 'Creando...';

    let resultado;

    if (modoEdicion) {
      // TODO 7.1.1 y 7.1.2: Obtener ID y actualizar vía API
      const id = parseInt(inputPostId.value);
      resultado = await ApiService.updatePost(id, datosPost);
      
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...resultado, id };
      }

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${id} actualizado correctamente`),
        3000
      );

    } else {
      // TODO 7.1.3 y 7.1.4: Crear y agregar al inicio
      resultado = await ApiService.createPost(datosPost);
      posts.unshift(resultado);

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${resultado.id} creado correctamente`),
        3000
      );
    }

    postsFiltrados = [...posts];
    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();
    limpiarFormulario();

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al guardar: ${error.message}`),
      5000
    );
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = modoEdicion ? 'Actualizar Post' : 'Crear Post';
  }
}

/**
 * Eliminar un post
 */
async function eliminarPost(id) {
  // TODO 7.2.1: Confirmación de usuario
  if (!confirm(`¿Eliminar el post #${id}?`)) {
    return;
  }

  try {
    // TODO 7.2.2: Petición DELETE
    await ApiService.deletePost(id);

    // TODO 7.2.3 y 7.2.4: Limpiar arrays locales
    posts = posts.filter(p => p.id !== id);
    postsFiltrados = postsFiltrados.filter(p => p.id !== id);

    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();

    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeExito(`Post #${id} eliminado correctamente`),
      3000
    );

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al eliminar: ${error.message}`),
      5000
    );
  }
}

/**
 * Buscar posts por título o contenido
 */
function buscarPosts(termino) {
  const terminoLower = termino.toLowerCase().trim();

  if (terminoLower === '') {
    // TODO 7.3.1: Resetear filtro
    postsFiltrados = [...posts];
  } else {
    // TODO 7.3.2: Filtrar por texto
    postsFiltrados = posts.filter(post => {
      const tituloMatch = post.title.toLowerCase().includes(terminoLower);
      const bodyMatch = post.body.toLowerCase().includes(terminoLower);
      return tituloMatch || bodyMatch;
    });
  }

  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

function limpiarBusqueda() {
  inputBuscar.value = '';
  postsFiltrados = [...posts];
  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/* =========================
   EVENT LISTENERS
========================= */

formPost.addEventListener('submit', (e) => {
  e.preventDefault();
  const datosPost = {
    title: inputTitulo.value.trim(),
    body: inputContenido.value.trim(),
    userId: 1
  };
  guardarPost(datosPost);
});

btnCancelar.addEventListener('click', () => {
  limpiarFormulario();
});

btnBuscar.addEventListener('click', () => {
  buscarPosts(inputBuscar.value);
});

inputBuscar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    buscarPosts(inputBuscar.value);
  }
});

btnLimpiar.addEventListener('click', () => {
  limpiarBusqueda();
});

listaPosts.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const id = parseInt(e.target.dataset.id);
  const post = posts.find(p => p.id === id);

  if (action === 'editar' && post) {
    activarModoEdicion(post);
  }

  if (action === 'eliminar') {
    eliminarPost(id);
  }
});

/* INICIALIZACIÓN */
cargarPosts();