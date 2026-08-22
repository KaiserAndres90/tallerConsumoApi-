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
    const feriadosOrdenados = [...feriados].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    contenedorFeriados.innerHTML = feriadosOrdenados
        .map((feriado, indice) => crearTarjetaFeriado(feriado, indice))
        .join('');
}

async function obtenerFeriados() {
    mostrarCargando();

    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();
    renderizarFeriados(datos);
}

function iniciarApp() {
    contenedorFeriados = obtenerContenedor();

    obtenerFeriados();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarApp);
} else {
    iniciarApp();
}



