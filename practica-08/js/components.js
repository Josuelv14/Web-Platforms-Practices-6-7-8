'use strict';

/* =========================
   COMPONENTES DE UI
========================= */

/**
 * Componente de mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeExito(mensaje) {
  const container = document.createElement('div');
  container.className = 'mensaje-exito';

  const titulo = document.createElement('strong');
  titulo.textContent = '✓ Éxito';

  const texto = document.createElement('p');
  texto.textContent = mensaje;

  container.appendChild(titulo);
  container.appendChild(texto);

  return container;
}

/**
 * Componente de mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeError(mensaje) {
  const container = document.createElement('div');
  container.className = 'mensaje-error';

  const titulo = document.createElement('strong');
  titulo.textContent = '✗ Error';

  const texto = document.createElement('p');
  texto.textContent = mensaje;

  container.appendChild(titulo);
  container.appendChild(texto);

  return container;
}

/**
 * Componente para mostrar los datos del registro en una tarjeta
 * @param {object} datos - Objeto con los datos del formulario
 * @returns {HTMLElement} - Elemento div del DOM
 */
function ResultadoCard(datos) {
  const card = document.createElement('div');
  card.className = 'resultado-card';

  const titulo = document.createElement('h3');
  titulo.textContent = 'Datos registrados correctamente';
  card.appendChild(titulo);

  // Mapeo de nombres de campos a etiquetas legibles
  const labels = {
    nombre: 'Nombre completo',
    email: 'Email',
    telefono: 'Teléfono',
    fecha_nacimiento: 'Fecha de nacimiento',
    genero: 'Género',
    password: 'Contraseña',
    terminos: 'Términos aceptados'
  };

  // Iterar cada entrada del objeto datos de forma segura
  Object.entries(datos).forEach(([clave, valor]) => {
    // Crear el contenedor del item
    const item = document.createElement('div');
    item.className = 'resultado-item';

    const label = document.createElement('strong');
    label.textContent = labels[clave] || clave;

    const valorSpan = document.createElement('span');
    
    // Formatear valores según el tipo de dato
    if (clave === 'password') {
      // Reemplazar contraseña por puntos por seguridad visual
      valorSpan.textContent = '•'.repeat(valor.length);
    } else if (clave === 'terminos') {
      valorSpan.textContent = valor ? 'Sí, aceptados' : 'No';
    } else if (clave === 'genero') {
      const generos = {
        masculino: 'Masculino',
        femenino: 'Femenino',
        otro: 'Otro',
        prefiero_no_decir: 'Prefiero no decir'
      };
      valorSpan.textContent = generos[valor] || valor;
    } else if (clave === 'fecha_nacimiento') {
      // Formatear fecha para que sea legible en español
      const fecha = new Date(valor + 'T00:00:00');
      valorSpan.textContent = fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } else {
      valorSpan.textContent = valor;
    }

    item.appendChild(label);
    item.appendChild(valorSpan);
    card.appendChild(item);
  });

  return card;
}

/**
 * Muestra un mensaje temporal en pantalla (se auto-oculta)
 */
function mostrarMensajeTemporal(contenedor, elemento, duracion = 3000) {
  contenedor.innerHTML = ''; // Limpiar previo
  contenedor.appendChild(elemento);
  contenedor.classList.remove('oculto');

  if (duracion > 0) {
    setTimeout(() => {
      contenedor.classList.add('oculto');
    }, duracion);
  }
}

/**
 * Renderiza la tarjeta de resultados final
 */
function renderizarResultado(datos, contenedor) {
  contenedor.innerHTML = '';
  const card = ResultadoCard(datos);
  contenedor.appendChild(card);
}

/**
 * Resetea el contenedor de resultados al estado inicial
 */
function limpiarResultado(contenedor) {
  contenedor.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = 'No hay datos enviados aún';
  contenedor.appendChild(p);
  contenedor.className = 'resultado-vacio';
}