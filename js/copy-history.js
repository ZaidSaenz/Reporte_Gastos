// ============================================================
// REPORTE LISTO PARA COPIAR EN WHATSAPP
// ============================================================
//
// Este módulo:
// - Guarda tienda, demo, región, supervisor y horario.
// - Agrupa las piezas vendidas por producto.
// - Registra canjes como lista de promocionales + cantidad.
// - Genera el texto listo para copiar.
// - Expone funciones para que pdf.js pueda leer los canjes.
// - Conserva los datos aunque se cierre la página.
//
// ============================================================

const CLAVE_DATOS_REPORTE =
  "tuny_ancla_datos_reporte_v2";

const CLAVE_CANJES_POR_DIA =
  "tuny_ancla_canjes_por_dia_v3";


const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];


const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];


// ============================================================
// INICIO
// ============================================================

function iniciarReporteWhatsapp() {
  cargarDatosGeneralesReporte();
  llenarSelectorCanjes();
  cargarCanjesDeHoy();

  agregarEventoSiExiste(
    "#input-tienda",
    "input",
    guardarDatosGeneralesDesdeFormulario
  );

  agregarEventoSiExiste(
    "#input-demo",
    "input",
    guardarDatosGeneralesDesdeFormulario
  );

  agregarEventoSiExiste(
    "#input-region",
    "input",
    guardarDatosGeneralesDesdeFormulario
  );

  agregarEventoSiExiste(
    "#input-supervisor",
    "input",
    guardarDatosGeneralesDesdeFormulario
  );

  agregarEventoSiExiste(
    "#input-horario",
    "input",
    guardarDatosGeneralesDesdeFormulario
  );

  agregarEventoSiExiste(
    "#btn-agregar-canje",
    "click",
    agregarCanje
  );

  agregarEventoSiExiste(
    "#input-cantidad-canje",
    "keydown",
    manejarEnterCantidadCanje
  );

  agregarEventoSiExiste(
    "#btn-copiar-reporte",
    "click",
    copiarReporteWhatsapp
  );

  actualizarReporteWhatsapp();
}


function agregarEventoSiExiste(
  selector,
  evento,
  callback
) {
  const elemento =
    document.querySelector(
      selector
    );

  if (!elemento) {
    return;
  }

  elemento.addEventListener(
    evento,
    callback
  );
}


// ============================================================
// DATOS GENERALES
// ============================================================

function obtenerDatosGeneralesReporte() {
  return leerJSON(
    CLAVE_DATOS_REPORTE,
    {
      tienda: "",
      demo: "",
      region: "Tijuana B.C.",
      supervisor: "",
      horario: ""
    }
  );
}


function guardarDatosGeneralesReporte(
  datos
) {
  return guardarJSON(
    CLAVE_DATOS_REPORTE,
    datos
  );
}


function cargarDatosGeneralesReporte() {
  const datos =
    obtenerDatosGeneralesReporte();

  asignarValorSiExiste(
    "#input-tienda",
    datos.tienda || ""
  );

  asignarValorSiExiste(
    "#input-demo",
    datos.demo || ""
  );

  asignarValorSiExiste(
    "#input-region",
    datos.region || "Tijuana B.C."
  );

  asignarValorSiExiste(
    "#input-supervisor",
    datos.supervisor || ""
  );

  asignarValorSiExiste(
    "#input-horario",
    datos.horario || ""
  );
}


function asignarValorSiExiste(
  selector,
  valor
) {
  const elemento =
    document.querySelector(
      selector
    );

  if (!elemento) {
    return;
  }

  elemento.value =
    valor;
}


function obtenerValorFormulario(
  selector
) {
  const elemento =
    document.querySelector(
      selector
    );

  if (!elemento) {
    return "";
  }

  return elemento
    .value
    .trim();
}


function guardarDatosGeneralesDesdeFormulario() {
  const datos = {
    tienda:
      obtenerValorFormulario(
        "#input-tienda"
      ),

    demo:
      obtenerValorFormulario(
        "#input-demo"
      ),

    region:
      obtenerValorFormulario(
        "#input-region"
      ),

    supervisor:
      obtenerValorFormulario(
        "#input-supervisor"
      ),

    horario:
      obtenerValorFormulario(
        "#input-horario"
      )
  };

  guardarDatosGeneralesReporte(
    datos
  );

  actualizarReporteWhatsapp();
}


// ============================================================
// CATÁLOGO DE CANJES EN LA INTERFAZ
// ============================================================

function llenarSelectorCanjes() {
  const selector =
    document.querySelector(
      "#input-canje"
    );

  if (!selector) {
    return;
  }

  selector.innerHTML =
    "";

  const opcionInicial =
    document.createElement(
      "option"
    );

  opcionInicial.value =
    "";

  opcionInicial.textContent =
    "Elige un canje";

  selector.appendChild(
    opcionInicial
  );

  if (
    typeof CATALOGO_CANJES ===
    "undefined"
  ) {
    console.warn(
      "No se encontró CATALOGO_CANJES. Revisa js/catalogo.js."
    );

    return;
  }

  CATALOGO_CANJES.forEach(
    (
      canje
    ) => {
      const opcion =
        document.createElement(
          "option"
        );

      opcion.value =
        canje;

      opcion.textContent =
        canje;

      selector.appendChild(
        opcion
      );
    }
  );
}


// ============================================================
// CANJES DEL DÍA
// ============================================================
//
// Formato actual:
//
// [
//   {
//     canje: "PALA DE COCINA",
//     cantidad: 2
//   },
//   {
//     canje: "KIT DE CUBIERTOS",
//     cantidad: 1
//   }
// ]
//
// ============================================================

function obtenerCanjesDeHoy() {
  const registros =
    leerJSON(
      CLAVE_CANJES_POR_DIA,
      {}
    );

  const claveFecha =
    obtenerClaveFechaLocal();

  const registro =
    registros[
      claveFecha
    ];

  if (!Array.isArray(registro)) {
    return [];
  }

  return registro
    .map(
      normalizarCanje
    )
    .filter(
      (
        item
      ) =>
        item.canje &&
        item.cantidad > 0
    );
}


function normalizarCanje(
  item
) {
  const canje =
    String(
      item?.canje ?? ""
    )
      .trim();

  const cantidad =
    Number(
      item?.cantidad
    );

  return {
    canje,

    cantidad:
      Number.isInteger(
        cantidad
      ) &&
      cantidad > 0
        ? cantidad
        : 0
  };
}


function guardarCanjesDeHoy(
  canjes
) {
  const registros =
    leerJSON(
      CLAVE_CANJES_POR_DIA,
      {}
    );

  const claveFecha =
    obtenerClaveFechaLocal();

  registros[
    claveFecha
  ] = canjes
    .map(
      normalizarCanje
    )
    .filter(
      (
        item
      ) =>
        item.canje &&
        item.cantidad > 0
    );

  return guardarJSON(
    CLAVE_CANJES_POR_DIA,
    registros
  );
}


function cargarCanjesDeHoy() {
  actualizarListaCanjes();
  actualizarContadorCanjes();
}


function obtenerCantidadCanjesDeHoy() {
  return obtenerCanjesDeHoy()
    .reduce(
      (
        total,
        item
      ) =>
        total +
        item.cantidad,
      0
    );
}


function agregarCanje() {
  const selector =
    document.querySelector(
      "#input-canje"
    );

  const inputCantidad =
    document.querySelector(
      "#input-cantidad-canje"
    );

  if (
    !selector ||
    !inputCantidad
  ) {
    mostrarMensaje(
      "No se encontró la captura de canjes.",
      true
    );

    return;
  }

  const canje =
    selector
      .value
      .trim();

  const cantidad =
    Number(
      inputCantidad
        .value
        .trim()
    );

  if (!canje) {
    mostrarMensaje(
      "Selecciona el canje entregado.",
      true
    );

    return;
  }

  if (
    !Number.isInteger(
      cantidad
    ) ||
    cantidad <= 0
  ) {
    mostrarMensaje(
      "La cantidad del canje debe ser un número entero mayor a cero.",
      true
    );

    return;
  }

  const canjes =
    obtenerCanjesDeHoy();

  const existente =
    canjes.find(
      (
        item
      ) =>
        item.canje === canje
    );

  if (existente) {
    existente.cantidad +=
      cantidad;
  } else {
    canjes.push({
      canje,
      cantidad
    });
  }

  guardarCanjesDeHoy(
    canjes
  );

  inputCantidad.value =
    "1";

  actualizarListaCanjes();
  actualizarContadorCanjes();
  actualizarReporteWhatsapp();

  mostrarMensaje(
    "Canje agregado."
  );
}


function manejarEnterCantidadCanje(
  evento
) {
  if (
    evento.key !==
    "Enter"
  ) {
    return;
  }

  evento.preventDefault();
  agregarCanje();
}


function quitarCanjeRegistrado(
  canje
) {
  const canjes =
    obtenerCanjesDeHoy()
      .filter(
        (
          item
        ) =>
          item.canje !== canje
      );

  guardarCanjesDeHoy(
    canjes
  );

  actualizarListaCanjes();
  actualizarContadorCanjes();
  actualizarReporteWhatsapp();

  mostrarMensaje(
    "Canje eliminado."
  );
}


function actualizarListaCanjes() {
  const contenedor =
    document.querySelector(
      "#lista-canjes"
    );

  if (!contenedor) {
    return;
  }

  contenedor.innerHTML =
    "";

  const canjes =
    obtenerCanjesDeHoy();

  if (
    canjes.length ===
    0
  ) {
    const mensaje =
      document.createElement(
        "p"
      );

    mensaje.className =
      "texto-ayuda";

    mensaje.textContent =
      "Todavía no hay canjes registrados.";

    contenedor.appendChild(
      mensaje
    );

    return;
  }

  canjes.forEach(
    (
      item
    ) => {
      const fila =
        crearFilaCanjeRegistrado(
          item
        );

      contenedor.appendChild(
        fila
      );
    }
  );
}


function crearFilaCanjeRegistrado(
  item
) {
  const plantilla =
    document.querySelector(
      "#plantilla-canje-registrado"
    );

  if (!plantilla) {
    const fila =
      document.createElement(
        "article"
      );

    fila.className =
      "fila-canje-registrado";

    fila.textContent =
      `${item.canje}: ${item.cantidad}`;

    return fila;
  }

  const fragmento =
    plantilla.content
      .cloneNode(
        true
      );

  const fila =
    fragmento.querySelector(
      ".fila-canje-registrado"
    );

  fila.querySelector(
    ".nombre-canje-registrado"
  ).textContent =
    item.canje;

  fila.querySelector(
    ".cantidad-canje-registrado"
  ).textContent =
    String(
      item.cantidad
    );

  fila.querySelector(
    ".btn-quitar-canje"
  ).addEventListener(
    "click",
    () =>
      quitarCanjeRegistrado(
        item.canje
      )
  );

  return fila;
}


function actualizarContadorCanjes() {
  const contador =
    document.querySelector(
      "#contador-canjes"
    );

  if (!contador) {
    return;
  }

  contador.textContent =
    String(
      obtenerCantidadCanjesDeHoy()
    );
}


function obtenerResumenCanjesPdf() {
  const canjes =
    obtenerCanjesDeHoy();

  if (
    typeof FILAS_CANJES_PDF ===
    "undefined"
  ) {
    return canjes.map(
      (
        item,
        indice
      ) => ({
        ...item,
        fila:
          indice
      })
    );
  }

  const canjesNoReconocidos =
    canjes.filter(
      (
        item
      ) =>
        !FILAS_CANJES_PDF.has(
          item.canje
        )
    );

  if (
    canjesNoReconocidos.length >
    0
  ) {
    throw new Error(
      "Hay canjes que no tienen un renglón asignado en el PDF: " +
      canjesNoReconocidos
        .map(
          (
            item
          ) =>
            item.canje
        )
        .join(
          ", "
        )
    );
  }

  return canjes.map(
    (
      item
    ) => ({
      ...item,

      fila:
        FILAS_CANJES_PDF.get(
          item.canje
        )
    })
  );
}


// ============================================================
// FECHA DEL REPORTE
// ============================================================

function formatearFechaReporte(
  fecha = new Date()
) {
  return (
    `${DIAS_SEMANA[fecha.getDay()]} ` +
    `${fecha.getDate()} de ` +
    `${MESES[fecha.getMonth()]} ` +
    `${fecha.getFullYear()}`
  );
}


// ============================================================
// AGRUPAR PRODUCTOS REPETIDOS
// ============================================================

function agruparProductosParaReporte(
  ventas
) {
  const agrupados =
    new Map();

  ventas.forEach(
    (
      venta
    ) => {
      venta.productos
        .forEach(
          (
            item
          ) => {
            const cantidadAnterior =
              agrupados.get(
                item.producto
              ) || 0;

            agrupados.set(
              item.producto,
              cantidadAnterior +
              item.cantidad
            );
          }
        );
    }
  );

  return [
    ...agrupados.entries()
  ]
    .map(
      (
        [
          producto,
          cantidad
        ]
      ) => ({
        producto,
        cantidad
      })
    );
}


// ============================================================
// GENERAR TEXTO PARA WHATSAPP
// ============================================================

function generarTextoReporteWhatsapp() {
  const datos =
    obtenerDatosGeneralesReporte();

  const ventas =
    obtenerVentasDeHoy();

  const productos =
    agruparProductosParaReporte(
      ventas
    );

  const canjes =
    obtenerCanjesDeHoy();

  const totalCanjes =
    obtenerCantidadCanjesDeHoy();

  const bloques = [
    `Fecha: ${formatearFechaReporte()}`,

    `Tienda: ${
      datos.tienda ||
      "[Escribe la tienda]"
    }`,

    `Demo: ${
      datos.demo ||
      "[Escribe el nombre]"
    }`,

    `Región: ${
      datos.region ||
      "[Escribe la región]"
    }`
  ];

  productos.forEach(
    (
      {
        producto,
        cantidad
      }
    ) => {
      const piezas =
        cantidad === 1
          ? "pieza"
          : "piezas";

      bloques.push(
        `${producto}\n` +
        `#${cantidad} ${piezas} de atún`
      );
    }
  );

  let bloqueCanje =
    `Canje\n` +
    `#${totalCanjes}`;

  if (
    canjes.length >
    0
  ) {
    bloqueCanje +=
      `\n\nProducto entregado:\n`;

    canjes.forEach(
      (
        item
      ) => {
        bloqueCanje +=
          `\n#${item.cantidad} ${item.canje}`;
      }
    );
  }

  bloques.push(
    bloqueCanje
  );

  return bloques.join(
    "\n\n"
  );
}

// ============================================================
// MOSTRAR EL REPORTE
// ============================================================

function actualizarReporteWhatsapp() {
  const textarea =
    document.querySelector(
      "#reporte-whatsapp"
    );

  if (!textarea) {
    return;
  }

  textarea.value =
    generarTextoReporteWhatsapp();
}


// ============================================================
// COPIAR EL REPORTE
// ============================================================

async function copiarReporteWhatsapp() {
  const textarea =
    document.querySelector(
      "#reporte-whatsapp"
    );

  const texto =
    textarea.value;

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator
        .clipboard
        .writeText(
          texto
        );

    } else {
      copiarTextoConMetodoAlternativo(
        textarea
      );
    }

    mostrarMensaje(
      "Reporte copiado. Ya puedes pegarlo en WhatsApp."
    );

  } catch (
    error
  ) {
    console.error(
      "No fue posible copiar el reporte:",
      error
    );

    mostrarMensaje(
      "No se pudo copiar automáticamente. Mantén presionado el texto y cópialo manualmente.",
      true
    );
  }
}


function copiarTextoConMetodoAlternativo(
  textarea
) {
  textarea.focus();
  textarea.select();

  textarea.setSelectionRange(
    0,
    textarea.value.length
  );

  const copiado =
    document.execCommand(
      "copy"
    );

  textarea.blur();

  if (!copiado) {
    throw new Error(
      "El navegador rechazó la copia."
    );
  }
}