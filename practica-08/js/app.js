'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */
const formRegistro = document.querySelector('#form-registro');
const inputPassword = document.querySelector('#password');
const inputConfirmarPassword = document.querySelector('#confirmar_password');
const inputTelefono = document.querySelector('#telefono');
const passwordStrength = document.querySelector('#password-strength');
const btnEnviar = document.querySelector('#btn-enviar');
const btnLimpiar = document.querySelector('#btn-limpiar');

const mensajeEstado = document.querySelector('#mensaje-estado');
const resultadoRegistro = document.querySelector('#resultado-registro');

/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Validar un campo individual y mostrar feedback visual inmediato
 */
function validarCampoConFeedback(campo) {
    const resultado = ValidacionService.validarCampo(campo);
    
    if (!resultado.valido) {
        mostrarError(campo, resultado.error);
    } else {
        limpiarError(campo);
    }
}

/**
 * Actualizar el indicador visual de fuerza de contraseña
 */
function actualizarIndicadorFuerza(password) {
    if (!password) {
        passwordStrength.textContent = '';
        passwordStrength.className = 'password-strength';
        return;
    }

    const fuerza = ValidacionService.evaluarFuerzaPassword(password);
    
    passwordStrength.textContent = `Fortaleza: ${fuerza.nivel}`;
    passwordStrength.className = `password-strength ${fuerza.clase}`;
}

/**
 * Verifica si los campos con el atributo 'required' tienen contenido
 */
function verificarCamposLlenos(form) {
    const camposRequeridos = form.querySelectorAll('[required]');
    
    return [...camposRequeridos].every(campo => {
        if (campo.type === 'checkbox') {
            return campo.checked;
        }
        return campo.value.trim() !== '';
    });
}

/**
 * Habilita o deshabilita el botón de enviar según el estado del formulario
 */
function actualizarBotonEnviar(form) {
    const todosLlenos = verificarCamposLlenos(form);
    btnEnviar.disabled = !todosLlenos;
}

/**
 * Procesa los datos, muestra éxito y renderiza la tarjeta de resultados
 */
function procesarEnvio(formData) {
    // Convertir FormData a objeto plano
    const datos = Object.fromEntries(formData);
    
    // Asegurar valor del checkbox de términos
    datos.terminos = formRegistro.querySelector('#terminos').checked;

    // Log para depuración (simulación de envío a servidor)
    console.log('Datos procesados:', datos);

    // Mostrar componente de éxito
    mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito('Registro completado exitosamente. Los datos se muestran abajo.'),
        5000
    );

    // Renderizar tarjeta de resultados con manipulación segura del DOM
    renderizarResultado(datos, resultadoRegistro);

    // Resetear el formulario y estados visuales
    formRegistro.reset();
    
    const campos = formRegistro.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        campo.classList.remove('campo--valido', 'campo--error');
    });

    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';

    actualizarBotonEnviar(formRegistro);

    // Desplazamiento suave hacia el resultado
    resultadoRegistro.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================
   EVENT LISTENERS (MANEJO DE EVENTOS)
========================= */

// Manejo del envío del formulario
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar integridad de todo el formulario
    const formularioValido = ValidacionService.validarFormulario(formRegistro);

    if (!formularioValido) {
        mostrarMensajeTemporal(
            mensajeEstado,
            MensajeError('Por favor, corrige los errores en el formulario antes de continuar.'),
            5000
        );
        
        // Posicionar pantalla en el primer error encontrado
        const primerError = formRegistro.querySelector('.campo--error');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerError.focus();
        }
        return;
    }

    // Si pasa la validación, procesar
    const formData = new FormData(formRegistro);
    procesarEnvio(formData);
});

// Validación al perder el foco (blur/focusout)
formRegistro.addEventListener('focusout', (e) => {
    if (e.target.matches('input, select, textarea')) {
        validarCampoConFeedback(e.target);
    }
});

// Limpieza de errores y actualización de botón mientras el usuario escribe
formRegistro.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea')) {
        const errorDiv = e.target.parentElement.querySelector('.error-mensaje');
        if (errorDiv && errorDiv.textContent) {
            limpiarError(e.target);
        }
    }
    actualizarBotonEnviar(formRegistro);
});

// Fortaleza de contraseña en tiempo real
inputPassword.addEventListener('input', (e) => {
    actualizarIndicadorFuerza(e.target.value);
});

// Aplicación automática de máscara de teléfono ecuatoriano
inputTelefono.addEventListener('input', (e) => {
    aplicarMascaraTelefono(e.target);
});

// Validar coincidencia de contraseñas dinámicamente
inputPassword.addEventListener('input', () => {
    if (inputConfirmarPassword.value) {
        validarCampoConFeedback(inputConfirmarPassword);
    }
});

// Acción del botón limpiar
btnLimpiar.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
        formRegistro.reset();
        
        const campos = formRegistro.querySelectorAll('input, select, textarea');
        campos.forEach(campo => {
            campo.classList.remove('campo--valido', 'campo--error');
            const errorDiv = campo.parentElement.querySelector('.error-mensaje');
            if (errorDiv) errorDiv.textContent = '';
        });

        passwordStrength.textContent = '';
        passwordStrength.className = 'password-strength';

        limpiarResultado(resultadoRegistro);
        mensajeEstado.classList.add('oculto');
        actualizarBotonEnviar(formRegistro);
        document.querySelector('#nombre').focus();
    }
});

/* =========================
   INICIALIZACIÓN
========================= */

// Estado inicial del botón y foco
actualizarBotonEnviar(formRegistro);
const primerCampo = document.querySelector('#nombre');
if (primerCampo) primerCampo.focus();