document.getElementById("formCotizacion").addEventListener("submit", async function (event) {
    event.preventDefault();
    await cotizarSeguro();
});

async function cotizarSeguro() {
    const añoActual = new Date().getFullYear();

    // Datos de marcas y precios base (pueden venir de un archivo JSON simulado)
    const marcas = await fetchDatos("https://mockapi.example.com/marcas");
    const versiones = await fetchDatos("https://mockapi.example.com/versiones");

    // Obtener datos del formulario
    const marcaSeleccionada = document.getElementById("marca").value.toLowerCase();
    const año = parseInt(document.getElementById("año").value);
    const versionSeleccionada = document.getElementById("version").value.toLowerCase();

    // Validar entrada del año con operadores avanzados
    if (isNaN(año) || año < 1900 || año > añoActual) {
        mostrarMensaje("Por favor, ingresa un año válido.");
        return;
    }

    // Obtener marca y versión usando operadores avanzados
    const { precioBase = 0 } = marcas.find(m => m.nombre === marcaSeleccionada) || {};
    const { factor: factorVersion = 1 } = versiones.find(v => v.nombre === versionSeleccionada) || {};

    if (!precioBase) {
        mostrarMensaje("Marca no válida.");
        return;
    }

    // Calcular el factor según el año
    const factorAño = año >= añoActual ? 1.2 : año >= 2010 ? 1.0 : 0.8;

    // Calcular el presupuesto usando operadores avanzados
    const presupuestoFinal = (precioBase * factorAño * factorVersion).toFixed(2);

    // Mostrar el presupuesto y guardar en el localStorage
    mostrarMensaje(`El presupuesto para tu seguro es: $${presupuestoFinal}`);
    guardarCotizacion({ marcaSeleccionada, año, versionSeleccionada, presupuestoFinal });
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
    document.getElementById("resultado").textContent = mensaje;
}

// Guardar cotización en localStorage
function guardarCotizacion(cotizacion) {
    localStorage.setItem("cotizacion", JSON.stringify(cotizacion));
}

// Cargar cotización guardada (asincronía opcional)
window.addEventListener("load", async function () {
    const cotizacionGuardada = JSON.parse(localStorage.getItem("cotizacion"));
    const mensaje = cotizacionGuardada
        ? `Última cotización: $${cotizacionGuardada.presupuestoFinal}`
        : "No tienes cotizaciones previas.";
    mostrarMensaje(mensaje);

    // Simular un fetch para actualizar marcas y versiones al cargar
    const marcas = await fetchDatos("https://mockapi.example.com/marcas");
    console.log("Datos de marcas cargados:", marcas);
});

// Función para realizar solicitudes AJAX con Fetch
async function fetchDatos(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.statusText}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return [];
    }
}
