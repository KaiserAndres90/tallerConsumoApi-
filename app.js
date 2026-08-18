/**
 * Aplicación de Feriados de Colombia 2026
 * Consume la API de Nager.Date y muestra los días festivos en tarjetas dinámicas.
 */

// URL de la API de feriados públicos de Colombia 2026
const API_URL = 'https://date.nager.at/api/v3/PublicHolidays/2026/CO';

// Referencia al contenedor principal donde se renderizan las tarjetas
const contenedorFeriados = document.getElementById('lista-feriados');

/**
 * Muestra un mensaje de carga mientras se obtienen los datos de la API.
 */
function mostrarCargando() {
    contenedorFeriados.innerHTML = `
        <div class="mensaje-carga">
            ⏳ Cargando feriados de Colombia 2026...
        </div>
    `;
}

/**
 * Muestra un mensaje de error cuando falla la petición a la API.
 * @param {string} mensaje - Descripción del error ocurrido.
 */
function mostrarError(mensaje) {
    contenedorFeriados.innerHTML = `
        <div class="mensaje-error">
            ❌ ${mensaje}
        </div>
    `;
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato legible en español.
 * @param {string} fechaISO - Fecha en formato ISO.
 * @returns {string} Fecha formateada (ej: "lunes, 1 de enero de 2026").
 */
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO + 'T00:00:00');
    return fecha.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Crea el HTML de una tarjeta individual para un feriado.
 * @param {Object} feriado - Objeto con los datos del feriado desde la API.
 * @param {number} indice - Índice para la animación escalonada.
 * @returns {string} HTML de la tarjeta.
 */
function crearTarjetaFeriado(feriado, indice) {
    const fechaFormateada = formatearFecha(feriado.date);
    const nombreEspanol = feriado.localName || feriado.name;
    const nombreIngles = feriado.name;
    const tipo = feriado.types ? feriado.types.join(', ') : 'Público';

    return `
        <article class="tarjeta-feriado" style="animation-delay: ${indice * 0.08}s">
            <span class="fecha-feriado">📅 ${fechaFormateada}</span>
            <h2 class="nombre-espanol">🇨🇴 ${nombreEspanol}</h2>
            <p class="nombre-ingles">🇬🇧 ${nombreIngles}</p>
            <span class="tipo-feriado">📌 ${tipo}</span>
        </article>
    `;
}

/**
 * Renderiza todas las tarjetas de feriados en el contenedor.
 * @param {Array} feriados - Lista de feriados obtenidos de la API.
 */
function renderizarFeriados(feriados) {
    if (!feriados || feriados.length === 0) {
        mostrarError('No se encontraron feriados para Colombia en 2026.');
        return;
    }

    // Ordenar feriados por fecha ascendente
    const feriadosOrdenados = [...feriados].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    contenedorFeriados.innerHTML = feriadosOrdenados
        .map((feriado, indice) => crearTarjetaFeriado(feriado, indice))
        .join('');
}

/**
 * Obtiene los feriados de Colombia 2026 desde la API de Nager.Date.
 * Utiliza async/await para manejar la petición de forma asíncrona.
 */
async function obtenerFeriados() {
    mostrarCargando();

    try {
        const respuesta = await fetch(API_URL);

        // Verificar que la respuesta HTTP sea exitosa
        if (!respuesta.ok) {
            throw new Error(`Error del servidor (código ${respuesta.status}). La API no está disponible.`);
        }

        const datos = await respuesta.json();
        renderizarFeriados(datos);

    } catch (error) {
        // Distinguir entre error de red y otros errores
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            mostrarError('Sin conexión a internet. Verifica tu red e intenta de nuevo.');
        } else {
            mostrarError(error.message || 'Ocurrió un error inesperado al cargar los feriados.');
        }

        console.error('Error al obtener feriados:', error);
    }
}

// Iniciar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', obtenerFeriados);
