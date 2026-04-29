'use strict';

/* =========================
   SERVICIO DE STORAGE
========================= */

const TareaStorage = {
    CLAVE: 'tareas_lista',

    /**
     * Obtener todas las tareas desde localStorage
     */
    getAll() {
        try {
            const datos = localStorage.getItem(this.CLAVE);
            if (!datos) {
                return [];
            }
            return JSON.parse(datos);
        } catch (error) {
            console.error('Error al leer tareas:', error);
            return [];
        }
    },

    /**
     * Guardar todas las tareas en localStorage
     */
    guardar(tareas) {
        try {
            localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
        } catch (error) {
            console.error('Error al guardar tareas:', error);
        }
    },

    /**
     * Crear una nueva tarea y persistirla
     */
    crear(texto) {
        // Obtener todas las tareas
        const tareas = this.getAll();
        
        // Crear objeto nueva tarea
        const nueva = {
            id: Date.now(), // ID único usando timestamp
            texto: texto.trim(),
            completada: false
        };
        
        // Agregar al array
        tareas.push(nueva);
        
        // Guardar array actualizado
        this.guardar(tareas);
        
        // Retornar el objeto creado
        return nueva;
    },

    /**
     * Alternar estado completada/pendiente
     */
    toggleCompletada(id) {
        // Obtener todas las tareas
        const tareas = this.getAll();
        
        // Buscar la tarea por id
        const tarea = tareas.find(t => t.id === id);
        
        // Si existe, invertir su estado
        if (tarea) {
            tarea.completada = !tarea.completada;
            this.guardar(tareas);
        }
    },

    /**
     * Eliminar una tarea por su ID
     */
    eliminar(id) {
        // Obtener tareas
        const tareas = this.getAll();
        
        // Filtrar para excluir la tarea con ese id
        const filtradas = tareas.filter(t => t.id !== id);
        
        // Guardar el nuevo array
        this.guardar(filtradas);
    },

    /**
     * Eliminar todas las tareas del localStorage
     */
    limpiarTodo() {
        localStorage.removeItem(this.CLAVE);
    }
};

/* =========================
   SERVICIO DE TEMA
========================= */

const TemaStorage = {
    CLAVE: 'tema_app',

    /**
     * Obtiene el tema guardado o 'claro' por defecto
     */
    getTema() {
        return localStorage.getItem(this.CLAVE) || 'claro';
    },

    /**
     * Guarda la preferencia de tema
     */
    setTema(tema) {
        localStorage.setItem(this.CLAVE, tema);
    }
};