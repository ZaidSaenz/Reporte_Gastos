// ============================================================
// CATÁLOGO OFICIAL DE PRODUCTOS TUNY - ANCLA
// ============================================================
//
// IMPORTANTE:
//
// - Los nombres deben conservarse exactamente como aparecen
//   en el formato PDF oficial.
// - El orden también debe mantenerse.
// - Cada posición corresponde a un renglón del PDF.
// - No ordenar alfabéticamente esta lista.
//
// ============================================================

const CATALOGO_PRODUCTOS = [
  "TUNY CLÁSICO AGUA 130 g",
  "TUNY CLÁSICO ACEITE 130 g",
  "TUNY CLÁSICO AGUA 295 g",
  "TUNY CLÁSICO ACEITE 295 g",

  "STANDAR TUNY EN AGUA 130 g",
  "STANDAR TUNY EN ACEITE 130 g",
  "STANDAR TUNY EN AGUA 270 g",
  "STANDAR TUNY EN ACEITE 270 g",

  "ENSALADA TUNY SIN MAYONESA 135 g",
  "ENSALADA TUNY SIN MAYONESA 295 g",
  "ENSALADA TUNY CON MAYONESA 135 g",
  "ENSALADA TUNY CON MAYONESA 295 g",

  "POUCH EN AGUA 75 g",
  "POUCH EN ACEITE 75 g",

  "INSTITUCIONAL LATA DE AGUA 1.88 KG",
  "INSTITUCIONAL LATA DE ACEITE 1.88 KG",

  "ANCLA EN AGUA 120 g",
  "ANCLA EN ACEITE 120 g",
  "ANCLA EN AGUA 270 g",
  "ANCLA EN ACEITE 270 g",

  "MARTUNA EN AGUA 130 g",
  "MARTUNA EN ACEITE 130 g"
];


// ============================================================
// RELACIÓN AUTOMÁTICA ENTRE PRODUCTO Y RENGLÓN DEL PDF
// ============================================================

const FILAS_PRODUCTOS_PDF =
  new Map(
    CATALOGO_PRODUCTOS.map(
      (
        producto,
        indice
      ) => [
        producto,
        indice
      ]
    )
  );


// ============================================================
// CATÁLOGO OFICIAL DE CANJES / PROMOCIONALES
// ============================================================
//
// IMPORTANTE:
//
// - Los nombres deben conservarse exactamente como aparecen
//   en el formato PDF oficial.
// - El orden también debe mantenerse.
// - Cada posición corresponde a un renglón del PDF.
//
// ============================================================

const CATALOGO_CANJES = [
  "PALA DE COCINA",
  "KIT DE CUBIERTOS",
  "ENSALADERA",
  "COLADOR"
];


// ============================================================
// RELACIÓN AUTOMÁTICA ENTRE CANJE Y RENGLÓN DEL PDF
// ============================================================

const FILAS_CANJES_PDF =
  new Map(
    CATALOGO_CANJES.map(
      (
        canje,
        indice
      ) => [
        canje,
        indice
      ]
    )
  );