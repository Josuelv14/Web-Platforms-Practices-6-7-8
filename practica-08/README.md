# Práctica 8: Validación Avanzada de Formularios y Componentes DOM

Esta práctica final integra todos los conocimientos adquiridos sobre manipulación del DOM, expresiones regulares (Regex) y eventos de usuario. Se ha desarrollado un sistema de registro robusto que valida datos en tiempo real y procesa la información de forma segura.

##  Funcionalidades Destacadas
* **Validación en Tiempo Real:** Uso de eventos `focusout` e `input` para proporcionar feedback inmediato (bordes de color y mensajes de error).
* **Seguridad (Anti-XSS):** Construcción de toda la interfaz de resultados mediante la API del DOM (`createElement`, `textContent`), evitando el uso de `innerHTML` con datos sensibles.
* **UX Avanzada:** * Botón de envío deshabilitado hasta cumplir requisitos mínimos.
    * Máscara dinámica para teléfonos: `(099) 999-9999`.
    * Indicador de fortaleza de contraseña con 5 niveles de seguridad.
    * Scroll automático hacia el primer error detectado.
* **Procesamiento de Datos:** Uso de `FormData` y `Object.fromEntries` para la recopilación eficiente de información.

##  Tecnologías Utilizadas
* **HTML5:** Formulario con atributo `novalidate`.
* **CSS3:** Estados de validación (`.campo--error`, `.campo--valido`) y animaciones.
* **JavaScript ES6+:** Regex avanzadas, delegación de eventos y arquitectura de servicios.

---

##  Evidencias de la Práctica

### 1. Estado Inicial y UX
![Prueba 1](images/prueba1.png)
![Prueba 1.2](images/prueba1.2.png)
**Escribir** "Jo" → Mensaje "El nombre debe tener al menos 3 caracteres"
![Prueba 1.3](images/prueba1.3.png)
**Escribir** "Juan123" → Mensaje "El nombre solo puede contener letras y espacios"
![Prueba 1.4](images/prueba1.4.png)
**Escribir** "Juan Pérez" → Borde verde, sin mensaje de error

**Descripción:** Vista inicial del formulario. Se observa el botón "Registrarse" deshabilitado y el foco automático en el campo Nombre para mejorar la accesibilidad.

### 2. Validación de Errores Críticos
![Prueba 2](images/prueba2.png)

![Prueba 2.1](images/prueba2.1.png)

![Prueba 2.2](images/prueba2.2.png)

![Prueba 3](images/prueba3.1.png)

![Prueba 4](images/prueba4.1.png)

**Descripción:** Feedback visual ante datos erróneos. Se muestran mensajes específicos para: nombre corto, formato de email inválido, minoría de edad y contraseñas que no coinciden.

### 3. Fortaleza de Contraseña
![Prueba 5](images/prueba5.png)

Esto sucede gracias al evento input que agregamos en app.js. Cada vez que presionas una tecla, se dispara la función evaluarFuerzaPassword del ValidacionService

**Descripción:** Demostración del algoritmo de evaluación de seguridad. El indicador cambia de color y texto (Muy débil -> Fuerte) según el uso de mayúsculas, números y longitud.

### 4. Máscara de Teléfono y Formateo
![Prueba 6](images/prueba3.1.png)
**Descripción:** Aplicación de máscara automática mientras el usuario escribe, limitando la entrada a 10 dígitos y aplicando el formato telefónico estándar.

### 5. Envío Exitoso y Resultado Seguro
![Prueba 7](images/prueba7.png)
**Descripción:** Tras la validación exitosa, se genera una `ResultadoCard`. Se observa el formateo de fecha largo, la traducción de géneros y el enmascaramiento de la contraseña.

### 6. Inspección Técnica (DevTools Console)
![Prueba 8](images/prueba8.png)

![Prueba 8.1](images/prueba8.1.png)

**Descripción:** Verificación en consola del objeto final generado mediante `FormData`, listo para ser enviado a un servicio backend.

---

##  Estructura de la Carpeta
/08-final
├── index.html
├── css/
│    └── styles.css
├── js/
│    ├── validacion.js  <-- Lógica de Regex y Reglas
│    ├── components.js  <-- Generación de elementos DOM
│    └── app.js         <-- Orquestador de Eventos
└── images/             <-- Capturas de evidencia


---
**Estudiante:** Josué Valdez (Alucard)  
**Carrera:** Computación - Quinto Ciclo  
**Docente:** Ing. Pablo Torres  
**Institución:** Universidad Politécnica Salesiana