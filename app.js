const API_URL = 'https://date.nager.at/api/v3/PublicHolidays/2026/CO';
let contenedorFeriados = null;

/**
 * @returns {HTMLElement|null}
 */
function obtenerContenedor() {
    return document.getElementById('lista-feriados');
}

function mostrarCargando() {
    if (!contenedorFeriados) return;

    contenedorFeriados.innerHTML = `
        <div class="mensaje-carga">
            Cargando feriados de Colombia 2026...
        </div>
    `;
}

/**
 * @param {string} mensaje
 */
function mostrarError(mensaje) {
    if (!contenedorFeriados) return;

    contenedorFeriados.innerHTML = `
        <div class="mensaje-error">
            ${mensaje}
        </div>
    `;
}
/**
 * @param {string} 
 * @returns {string} 
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
 * @param {Object} 
 * @param {number}  
 * @returns {string} 
 */
function crearTarjetaFeriado(feriado, indice) {
    const fechaFormateada = formatearFecha(feriado.date);
    const nombreEspanol = feriado.localName || feriado.name;
    const nombreIngles = feriado.name;
    const tipo = feriado.types ? feriado.types.join(', ') : 'Público';

    return `
        <article class="tarjeta-feriado" style="animation-delay: ${indice * 0.08}s">
            <span class="fecha-feriado"> ${fechaFormateada}</span>
            <h2 class="nombre-espanol">🇨🇴 ${nombreEspanol}</h2>
            <p class="nombre-ingles">🇬🇧 ${nombreIngles}</p>
            <span class="tipo-feriado"> ${tipo}</span>
        </article>
    `;
}

/**
 * @param {Array} 
 */
function renderizarFeriados(feriados) {
    if (!feriados || feriados.length === 0) {
        mostrarError('No se encontraron feriados para Colombia en 2026.');
        return;
    }

    const feriadosOrdenados = [...feriados].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    contenedorFeriados.innerHTML = feriadosOrdenados
        .map((feriado, indice) => crearTarjetaFeriado(feriado, indice))
        .join('');
}

async function obtenerFeriados() {
    mostrarCargando();

    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error del servidor (código ${respuesta.status}). La API no está disponible.`);
        }

        const datos = await respuesta.json();
        renderizarFeriados(datos);
    } catch (error) {
        const esArchivoLocal = window.location.protocol === 'file:';
        const esErrorRed = error instanceof TypeError;

        if (esArchivoLocal && esErrorRed) {
            mostrarError(
                'No se puede conectar a la API abriendo el archivo directamente. ' +
                'Usa un servidor local: en la terminal ejecuta "python -m http.server 8080" ' +
                'y abre http://localhost:8080 en el navegador.'
            );
        } else if (esErrorRed) {
            mostrarError('Sin conexión a internet. Verifica tu red e intenta de nuevo.');
        } else {
            mostrarError(error.message || 'Ocurrió un error inesperado al cargar los feriados.');
        }

        console.error('Error al obtener feriados:', error);
    }
}

function iniciarApp() {
    contenedorFeriados = obtenerContenedor();

    if (!contenedorFeriados) {
        console.error('No se encontró el elemento #lista-feriados en el HTML.');
        return;
    }

    obtenerFeriados();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarApp);
} else {
    iniciarApp();
}



