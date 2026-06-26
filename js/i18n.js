// ============================================================
// INTERNATIONALIZATION
// ============================================================

const TRANSLATIONS = Object.freeze({
  es: {
    app: {
      title: "Control de gastos",
      subtitle: "Registro privado en tu dispositivo"
    },
    dashboard: {
      title: "Gasto acumulado",
      subtitle: "Resumen de tus movimientos",
      today: "Hoy",
      week: "Esta semana",
      month: "Este mes"
    },
    expense: {
      title: "Nuevo gasto",
      subtitle: "Registro rápido",
      amount: "Importe",
      date: "Fecha",
      description: "Descripción opcional",
      descriptionPlaceholder:
        "Ej. Compra semanal",
      category: "Categoría",
      subcategory: "Subcategoría",
      selectCategory:
        "Selecciona una categoría",
      selectSubcategory:
        "Selecciona una subcategoría",
      customCategory:
        "Nombre de la categoría",
      customSubcategory:
        "Especifica el tipo de gasto",
      save: "Guardar gasto",
      update: "Actualizar gasto",
      cancelEdit: "Cancelar edición",
      saved:
        "Gasto guardado correctamente.",
      updated:
        "Gasto actualizado correctamente.",
      deleted: "El gasto fue eliminado.",
      invalidAmount:
        "Escribe un importe mayor a cero.",
      categoryRequired:
        "Selecciona una categoría.",
      customCategoryRequired:
        "Escribe el nombre de la categoría.",
      customSubcategoryRequired:
        "Escribe el tipo de gasto.",
      saveError:
        "No fue posible guardar el gasto en este dispositivo."
    },
    recent: {
      title: "Categorías recientes",
      subtitle: "Acceso rápido",
      help:
        "Toca una categoría para usarla en el formulario."
    },
    history: {
      title: "Historial de gastos",
      subtitle: "Movimientos por día",
      empty:
        "Todavía no hay gastos guardados.",
      copy: "Copiar",
      copied:
        "El resumen del día fue copiado.",
      copyError:
        "No fue posible copiar el resumen.",
      edit: "Editar",
      delete: "Eliminar",
      deleteConfirm:
        "¿Eliminar este gasto?",
      total: "Total del día",
      noDescription:
        "Sin descripción"
    },
    settings: {
      title: "Configuración",
      open: "Abrir configuración",
      close: "Cerrar configuración",
      language: "Idioma",
      visualStyle: "Estilo visual",
      palette: "Paleta de colores",
      currency: "Moneda",
      modern: "Moderno",
      pixel: "Pixel art",
      office: "Oficina",
      export: "Exportar respaldo",
      import: "Importar respaldo",
      clear: "Borrar todos los datos",
      clearConfirm:
        "¿Borrar todos los gastos y preferencias guardados?",
      backupCreated:
        "Respaldo descargado correctamente.",
      backupRestored:
        "Respaldo restaurado correctamente.",
      backupError:
        "No fue posible procesar el respaldo.",
      dataCleared:
        "Los datos locales fueron eliminados."
    },
    general: {
      other: "Otros",
      close: "Cerrar"
    },
    categories: {
      food: "Comida",
      transportation: "Transporte",
      home: "Hogar",
      services: "Servicios",
      health: "Salud",
      personal: "Personal",
      entertainment: "Entretenimiento",
      education: "Educación",
      financial: "Finanzas",
      other: "Otros"
    },
    subcategories: {
      groceries: "Supermercado",
      restaurants: "Restaurantes",
      delivery: "Entrega a domicilio",
      snacks: "Botanas y bebidas",
      fuel: "Gasolina",
      publicTransport: "Transporte público",
      taxi: "Taxi o transporte por aplicación",
      parking: "Estacionamiento",
      vehicleMaintenance:
        "Mantenimiento del vehículo",
      rent: "Renta",
      cleaning: "Limpieza",
      repairs: "Reparaciones",
      furniture: "Muebles",
      householdItems:
        "Artículos para el hogar",
      electricity: "Electricidad",
      water: "Agua",
      gasService: "Gas",
      internet: "Internet",
      phone: "Teléfono",
      subscriptions: "Suscripciones",
      medicine: "Medicamentos",
      medicalConsultation:
        "Consulta médica",
      dental: "Dentista",
      laboratory: "Laboratorio",
      personalCare: "Cuidado personal",
      clothing: "Ropa",
      footwear: "Calzado",
      beauty: "Belleza",
      gifts: "Regalos",
      movies: "Cine",
      games: "Videojuegos",
      events: "Eventos",
      hobbies: "Pasatiempos",
      travel: "Viajes",
      courses: "Cursos",
      books: "Libros",
      schoolSupplies:
        "Material escolar",
      tuition: "Colegiatura",
      debtPayment: "Pago de deuda",
      bankFees: "Comisiones bancarias",
      insurance: "Seguros",
      taxes: "Impuestos",
      other: "Otros"
    },
    palettes: {
      magenta: "Magenta",
      ocean: "Océano",
      emerald: "Esmeralda",
      violet: "Violeta",
      amber: "Ámbar",
      powder: "Azul pastel",
      sage: "Verde salvia",
      warmGray: "Gris cálido"
    }
  },

  en: {
    app: {
      title: "Expense Tracker",
      subtitle: "Private records on your device"
    },
    dashboard: {
      title: "Accumulated spending",
      subtitle: "Expense summary",
      today: "Today",
      week: "This week",
      month: "This month"
    },
    expense: {
      title: "New expense",
      subtitle: "Quick entry",
      amount: "Amount",
      date: "Date",
      description: "Optional description",
      descriptionPlaceholder:
        "Example: Weekly groceries",
      category: "Category",
      subcategory: "Subcategory",
      selectCategory:
        "Select a category",
      selectSubcategory:
        "Select a subcategory",
      customCategory:
        "Category name",
      customSubcategory:
        "Specify the expense type",
      save: "Save expense",
      update: "Update expense",
      cancelEdit: "Cancel editing",
      saved:
        "Expense saved successfully.",
      updated:
        "Expense updated successfully.",
      deleted: "The expense was deleted.",
      invalidAmount:
        "Enter an amount greater than zero.",
      categoryRequired:
        "Select a category.",
      customCategoryRequired:
        "Enter the category name.",
      customSubcategoryRequired:
        "Enter the expense type.",
      saveError:
        "The expense could not be saved on this device."
    },
    recent: {
      title: "Recent categories",
      subtitle: "Quick access",
      help:
        "Select a category to use it in the form."
    },
    history: {
      title: "Expense history",
      subtitle: "Daily records",
      empty:
        "No expenses have been saved yet.",
      copy: "Copy",
      copied:
        "The daily summary was copied.",
      copyError:
        "The summary could not be copied.",
      edit: "Edit",
      delete: "Delete",
      deleteConfirm:
        "Delete this expense?",
      total: "Daily total",
      noDescription:
        "No description"
    },
    settings: {
      title: "Settings",
      open: "Open settings",
      close: "Close settings",
      language: "Language",
      visualStyle: "Visual style",
      palette: "Color palette",
      currency: "Currency",
      modern: "Modern",
      pixel: "Pixel art",
      office: "Office",
      export: "Export backup",
      import: "Import backup",
      clear: "Delete all data",
      clearConfirm:
        "Delete all saved expenses and preferences?",
      backupCreated:
        "Backup downloaded successfully.",
      backupRestored:
        "Backup restored successfully.",
      backupError:
        "The backup could not be processed.",
      dataCleared:
        "Local data was deleted."
    },
    general: {
      other: "Other",
      close: "Close"
    },
    categories: {
      food: "Food",
      transportation: "Transportation",
      home: "Home",
      services: "Services",
      health: "Health",
      personal: "Personal",
      entertainment: "Entertainment",
      education: "Education",
      financial: "Financial",
      other: "Other"
    },
    subcategories: {
      groceries: "Groceries",
      restaurants: "Restaurants",
      delivery: "Delivery",
      snacks: "Snacks and drinks",
      fuel: "Fuel",
      publicTransport:
        "Public transportation",
      taxi: "Taxi or rideshare",
      parking: "Parking",
      vehicleMaintenance:
        "Vehicle maintenance",
      rent: "Rent",
      cleaning: "Cleaning",
      repairs: "Repairs",
      furniture: "Furniture",
      householdItems:
        "Household items",
      electricity: "Electricity",
      water: "Water",
      gasService: "Gas service",
      internet: "Internet",
      phone: "Phone",
      subscriptions: "Subscriptions",
      medicine: "Medicine",
      medicalConsultation:
        "Medical consultation",
      dental: "Dental",
      laboratory: "Laboratory",
      personalCare: "Personal care",
      clothing: "Clothing",
      footwear: "Footwear",
      beauty: "Beauty",
      gifts: "Gifts",
      movies: "Movies",
      games: "Games",
      events: "Events",
      hobbies: "Hobbies",
      travel: "Travel",
      courses: "Courses",
      books: "Books",
      schoolSupplies:
        "School supplies",
      tuition: "Tuition",
      debtPayment: "Debt payment",
      bankFees: "Bank fees",
      insurance: "Insurance",
      taxes: "Taxes",
      other: "Other"
    },
    palettes: {
      magenta: "Magenta",
      ocean: "Ocean",
      emerald: "Emerald",
      violet: "Violet",
      amber: "Amber",
      powder: "Powder blue",
      sage: "Sage",
      warmGray: "Warm gray"
    }
  }
});

function getNestedTranslation(
  source,
  key
) {
  return key
    .split(".")
    .reduce(
      (current, part) =>
        current?.[part],
      source
    );
}

function getActiveLanguage() {
  if (
    typeof getSettings === "function"
  ) {
    return getSettings().language || "es";
  }

  return (
    document.documentElement.lang || "es"
  ).slice(0, 2);
}

function t(key, replacements = {}) {
  const language = getActiveLanguage();

  const value =
    getNestedTranslation(
      TRANSLATIONS[language],
      key
    ) ??
    getNestedTranslation(
      TRANSLATIONS.es,
      key
    ) ??
    key;

  if (typeof value !== "string") {
    return key;
  }

  return Object.entries(replacements)
    .reduce(
      (text, [name, replacement]) =>
        text.replaceAll(
          `{${name}}`,
          String(replacement)
        ),
      value
    );
}

function applyTranslations() {
  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      element.textContent = t(
        element.dataset.i18n
      );
    });

  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach((element) => {
      element.placeholder = t(
        element.dataset.i18nPlaceholder
      );
    });

  document
    .querySelectorAll(
      "[data-i18n-aria-label]"
    )
    .forEach((element) => {
      element.setAttribute(
        "aria-label",
        t(
          element.dataset
            .i18nAriaLabel
        )
      );
    });

  document
    .querySelectorAll(
      "[data-i18n-title]"
    )
    .forEach((element) => {
      element.title = t(
        element.dataset.i18nTitle
      );
    });
}

function getCategoryLabel(
  categoryId,
  customCategory = ""
) {
  if (categoryId === "other") {
    return customCategory || t(
      "categories.other"
    );
  }

  return t(
    `categories.${categoryId}`
  );
}

function getSubcategoryLabel(
  subcategoryId,
  customSubcategory = ""
) {
  if (!subcategoryId) {
    return "";
  }

  if (subcategoryId === "other") {
    return customSubcategory || t(
      "subcategories.other"
    );
  }

  return t(
    `subcategories.${subcategoryId}`
  );
}

function getExpenseCategoryLabel(expense) {
  const category = getCategoryLabel(
    expense.categoryId,
    expense.customCategory
  );

  const subcategory =
    getSubcategoryLabel(
      expense.subcategoryId,
      expense.customSubcategory
    );

  return subcategory
    ? `${category} · ${subcategory}`
    : category;
}

function getLocale() {
  return getActiveLanguage() === "en"
    ? "en-US"
    : "es-MX";
}

function formatCurrency(value) {
  const settings =
    typeof getSettings === "function"
      ? getSettings()
      : DEFAULT_SETTINGS;

  return new Intl.NumberFormat(
    getLocale(),
    {
      style: "currency",
      currency:
        settings.currency || "MXN"
    }
  ).format(Number(value) || 0);
}

function formatTime(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    getLocale(),
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);
}

function formatFullDate(dateKey) {
  const date =
    typeof createLocalDateFromKey ===
    "function"
      ? createLocalDateFromKey(dateKey)
      : new Date(dateKey);

  if (
    !date ||
    Number.isNaN(date.getTime())
  ) {
    return dateKey;
  }

  return new Intl.DateTimeFormat(
    getLocale(),
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  ).format(date);
}

function formatCompactDate(dateKey) {
  const date =
    typeof createLocalDateFromKey ===
    "function"
      ? createLocalDateFromKey(dateKey)
      : new Date(dateKey);

  if (
    !date ||
    Number.isNaN(date.getTime())
  ) {
    return dateKey;
  }

  const todayKey =
    typeof getLocalDateKey === "function"
      ? getLocalDateKey()
      : "";

  if (dateKey === todayKey) {
    return t("dashboard.today");
  }

  return new Intl.DateTimeFormat(
    getLocale(),
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        new Date().getFullYear()
          ? "numeric"
          : undefined
    }
  ).format(date);
}
