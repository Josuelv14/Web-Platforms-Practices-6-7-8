'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS DOM
========================= */
const formTarea = document.getElementById('form-tarea');
const inputTarea = document.getElementById('input-tarea');
const listaTareas = document.getElementById('lista-tareas');
const mensajeEstado = document.getElementById('mensaje-estado');
const btnLimpiar = document.getElementById('btn-limpiar');
const themeBtns = document.querySelectorAll('[data-theme]');

/* =========================
   ESTADO GLOBAL
========================= */
let tareas = []; // Array de tareas en memoria

/* =========================
   FUNCIONES DE RENDERIZADO
========================= */

/**
 * Crea un elemento de tarea de forma segura usando createElement
 */
function crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = tarea.id;
    
    if (tarea.completada) {
        li.classList.add('task-item--completed');
    }

    // Checkbox para completar
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-item__checkbox';
    checkbox.checked = tarea.completada;

    // Span de texto (seguro contra XSS)
    const span = document.createElement('span');
    span.className = 'task-item__text';
    span.textContent = tarea.texto; 

    // Botón eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn--danger btn--small';
    btnEliminar.textContent = '🗑️';

    // Contenedor de acciones
    const divAcciones = document.createElement('div');
    divAcciones.className = 'task-item__actions';
    divAcciones.appendChild(btnEliminar);

    // Ensamblaje del item
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(divAcciones);

    // Listeners de eventos internos
    checkbox.addEventListener('change', () => toggleTarea(tarea.id));
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

    return li;
}

/**
 * Renderiza todas las tareas en el DOM
 */
function renderizarTareas() {
    // Limpiar la lista actual
    listaTareas.innerHTML = '';
    
    // Si no hay tareas, mostrar estado vacío
    if (tareas.length === 0) {
        const divVacio = document.createElement('div');
        divVacio.className = 'empty-state';
        const p = document.createElement('p');
        p.textContent = '🎉 No hay tareas. ¡Agrega una para comenzar!';
        divVacio.appendChild(p);
        listaTareas.appendChild(divVacio);
        return;
    }

    // Agregar cada tarea al fragmento/lista
    tareas.forEach(tarea => {
        const elemento = crearElementoTarea(tarea);
        listaTareas.appendChild(elemento);
    });
}

/**
 * Muestra mensajes de feedback al usuario
 */
function mostrarMensaje(texto, tipo = 'success') {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = `mensaje mensaje--${tipo}`;
    mensajeEstado.classList.remove('oculto');
    
    setTimeout(() => {
        mensajeEstado.classList.add('oculto');
    }, 3000);
}

/* =========================
   LÓGICA DE NEGOCIO (WEB STORAGE)
========================= */

function cargarTareas() {
    tareas = TareaStorage.getAll();
    renderizarTareas();
}

function agregarTarea(texto) {
    if (!texto.trim()) {
        mostrarMensaje('El texto no puede estar vacío', 'error');
        return;
    }

    const nueva = TareaStorage.crear(texto);
    tareas = TareaStorage.getAll();
    renderizarTareas();
    mostrarMensaje(`✓ Tarea "${nueva.texto}" agregada`);
}

function toggleTarea(id) {
    TareaStorage.toggleCompletada(id);
    tareas = TareaStorage.getAll();
    renderizarTareas();
}

function eliminarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (!confirm(`¿Eliminar "${tarea.texto}"?`)) return;

    TareaStorage.eliminar(id);
    tareas = TareaStorage.getAll();
    renderizarTareas();
    mostrarMensaje('Tarea eliminada', 'success');
}

function limpiarTodo() {
    if (tareas.length === 0) return;
    if (!confirm('¿Seguro que quieres borrar TODAS las tareas?')) return;

    TareaStorage.limpiarTodo();
    tareas = [];
    renderizarTareas();
    mostrarMensaje('Lista de tareas vaciada');
}

/**
 * Cambia los colores de la app y persiste la elección
 */
function aplicarTema(nombreTema) {
    if (nombreTema === 'oscuro') {
        document.documentElement.style.setProperty('--bg-primary', '#1a1a2e');
        document.documentElement.style.setProperty('--card-bg', '#16213e');
        document.documentElement.style.setProperty('--text-primary', '#e0e0e0');
    } else {
        // Tema claro (valores por defecto)
        document.documentElement.style.removeProperty('--bg-primary');
        document.documentElement.style.removeProperty('--card-bg');
        document.documentElement.style.removeProperty('--text-primary');
    }

    // Actualizar clase activa en botones
    themeBtns.forEach(btn => {
        btn.classList.toggle('theme-btn--active', btn.dataset.theme === nombreTema);
    });

    TemaStorage.setTema(nombreTema);
}

/* =========================
   EVENTOS
========================= */

formTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();
    agregarTarea(texto);
    inputTarea.value = '';
});

btnLimpiar.addEventListener('click', limpiarTodo);

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        aplicarTema(btn.dataset.theme);
    });
});

/* =========================
   INICIALIZACIÓN
========================= */

// 1. Cargar tema guardado
const temaGuardado = TemaStorage.getTema();
aplicarTema(temaGuardado);

// 2. Cargar tareas desde localStorage
cargarTareas();

// 3. Saludo inicial si está vacío
if (tareas.length === 0) {
    mostrarMensaje('👋 Bienvenido! Agrega tu primera tarea', 'success');
}