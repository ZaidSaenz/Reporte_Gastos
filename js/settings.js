// ============================================================
// APPLICATION SETTINGS
// ============================================================

const AVAILABLE_THEMES = Object.freeze([
  "default",
  "matte",
  "pixel-art",
  "cyberpunk"
]);

// Add new icon files here when the icon library is ready.
// Example:
// {
//   id: "pixel-coin",
//   label: "Pixel coin",
//   src: "./assets/icons/pixel-coin.svg"
// }
const ADD_BUTTON_ICONS = Object.freeze([
  {
    id: "default",
    labelKey: "settings.iconDefault",
    src: ""
  }
]);

function getAddButtonIcon(iconId) {
  return (
    ADD_BUTTON_ICONS.find(
      (icon) => icon.id === iconId
    ) || ADD_BUTTON_ICONS[0]
  );
}

function populateAddButtonIconSelect() {
  const select =
    document.querySelector(
      "#select-add-button-icon"
    );

  if (!select) {
    return;
  }

  const currentValue =
    getSettings().addButtonIcon ||
    "default";

  select.replaceChildren();

  ADD_BUTTON_ICONS.forEach((icon) => {
    const option =
      document.createElement("option");

    option.value = icon.id;
    option.textContent = icon.labelKey
      ? t(icon.labelKey)
      : icon.label;

    select.append(option);
  });

  select.value = getAddButtonIcon(
    currentValue
  ).id;
}

function applyAddButtonIcon(settings) {
  const image =
    document.querySelector(
      "#add-expense-icon"
    );

  const fallback =
    document.querySelector(
      "#add-expense-icon-fallback"
    );

  if (!image || !fallback) {
    return;
  }

  const icon = getAddButtonIcon(
    settings.addButtonIcon
  );

  if (!icon.src) {
    image.removeAttribute("src");
    image.classList.add("is-hidden");
    fallback.classList.remove("is-hidden");
    return;
  }

  image.onload = () => {
    image.classList.remove("is-hidden");
    fallback.classList.add("is-hidden");
  };

  image.onerror = () => {
    image.removeAttribute("src");
    image.classList.add("is-hidden");
    fallback.classList.remove("is-hidden");
  };

  image.src = icon.src;
}

function getValidTheme(themeName) {
  return AVAILABLE_THEMES.includes(
    themeName
  )
    ? themeName
    : "default";
}

function applyApplicationSettings(
  settings = getSettings()
) {
  const root = document.documentElement;

  const selectedTheme =
    getValidTheme(
      settings.visualStyle
    );

  root.lang =
    settings.language || "es";

  /*
   * Nuevo sistema:
   *
   * <html data-theme="pixel-art">
   */
  root.dataset.theme =
    selectedTheme;

  /*
   * Elimina atributos pertenecientes
   * al sistema visual anterior.
   */
  delete root.dataset.visualStyle;
  delete root.dataset.palette;

  /*
   * Conservamos temporalmente el nombre
   * "visualStyle" dentro de storage.js.
   *
   * De esta manera no rompemos ajustes
   * guardados ni respaldos anteriores.
   */
  const fieldValues = {
    "#select-language":
      settings.language || "es",

    "#select-visual-style":
      selectedTheme,

    "#select-currency":
      settings.currency || "MXN"
  };

  Object.entries(fieldValues).forEach(
    ([selector, value]) => {
      const field =
        document.querySelector(selector);

      if (field) {
        field.value = value;
      }
    }
  );

  const budgetInput =
    document.querySelector(
      "#monthly-budget-input"
    );

  if (budgetInput) {
    const budget =
      Number(settings.monthlyBudget) || 0;

    budgetInput.value =
      budget > 0
        ? budget.toFixed(2)
        : "";
  }

  /*
   * Obtiene del tema activo el color
   * usado por la barra del navegador
   * y la aplicación instalada.
   */
  const themeColor =
    getComputedStyle(root)
      .getPropertyValue(
        "--page-background"
      )
      .trim() || "#222522";

  document
    .querySelector(
      'meta[name="theme-color"]'
    )
    ?.setAttribute(
      "content",
      themeColor
    );

  applyTranslations();
  populateAddButtonIconSelect();
  applyAddButtonIcon(settings);

  document.dispatchEvent(
    new CustomEvent(
      "settingschanged",
      {
        detail: {
          ...settings,
          visualStyle: selectedTheme
        }
      }
    )
  );
}

function openSettingsDialog() {
  const dialog =
    document.querySelector(
      "#settings-dialog"
    );

  if (!dialog) {
    return;
  }

  if (
    typeof dialog.showModal ===
    "function"
  ) {
    if (!dialog.open) {
      dialog.showModal();
    }
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeSettingsDialog() {
  const dialog =
    document.querySelector(
      "#settings-dialog"
    );

  if (!dialog) {
    return;
  }

  if (
    typeof dialog.close ===
    "function"
  ) {
    if (dialog.open) {
      dialog.close();
    }
  } else {
    dialog.removeAttribute("open");
  }
}

function updateSetting(
  settingName,
  settingValue
) {
  const nextSettings = {
    ...getSettings(),
    [settingName]: settingValue
  };

  if (!saveSettings(nextSettings)) {
    return false;
  }

  applyApplicationSettings(
    nextSettings
  );

  return true;
}

function normalizeOptionalBudget(value) {
  const text = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[$€£¥]/g, "")
    .replace(",", ".");

  if (!text) {
    return 0;
  }

  const budget = Number(text);

  if (
    !Number.isFinite(budget) ||
    budget < 0
  ) {
    return null;
  }

  return Number(
    budget.toFixed(2)
  );
}

function saveMonthlyBudget() {
  const input =
    document.querySelector(
      "#monthly-budget-input"
    );

  if (!input) {
    return;
  }

  const budget =
    normalizeOptionalBudget(
      input.value
    );

  if (budget === null) {
    input.value = "";

    updateSetting(
      "monthlyBudget",
      0
    );

    return;
  }

  input.value =
    budget > 0
      ? budget.toFixed(2)
      : "";

  updateSetting(
    "monthlyBudget",
    budget
  );
}

function downloadBackup() {
  const backup =
    createLocalBackup();

  const blob = new Blob(
    [
      JSON.stringify(
        backup,
        null,
        2
      )
    ],
    {
      type: "application/json"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `expense-tracker-backup-${getLocalDateKey()}.json`;

  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  if (
    typeof showAppMessage ===
    "function"
  ) {
    showAppMessage(
      t("settings.backupCreated")
    );
  }
}

async function importBackupFile(file) {
  if (!file) {
    return;
  }

  try {
    const text =
      await file.text();

    const backup =
      JSON.parse(text);

    if (!restoreLocalBackup(backup)) {
      throw new Error(
        "Invalid backup format."
      );
    }

    applyApplicationSettings(
      getSettings()
    );

    if (
      typeof refreshApplication ===
      "function"
    ) {
      refreshApplication();
    }

    if (
      typeof showAppMessage ===
      "function"
    ) {
      showAppMessage(
        t("settings.backupRestored")
      );
    }

    closeSettingsDialog();
  } catch (error) {
    console.error(
      "Unable to restore backup:",
      error
    );

    if (
      typeof showAppMessage ===
      "function"
    ) {
      showAppMessage(
        t("settings.backupError"),
        true
      );
    }
  }
}

function clearStoredApplicationData() {
  if (
    !window.confirm(
      t("settings.clearConfirm")
    )
  ) {
    return;
  }

  if (!clearApplicationData()) {
    return;
  }

  applyApplicationSettings(
    getSettings()
  );

  if (
    typeof refreshApplication ===
    "function"
  ) {
    refreshApplication();
  }

  if (
    typeof showAppMessage ===
    "function"
  ) {
    showAppMessage(
      t("settings.dataCleared")
    );
  }

  closeSettingsDialog();
}

function initializeSettings() {
  populateAddButtonIconSelect();

  document
    .querySelector(
      "#open-settings-button"
    )
    ?.addEventListener(
      "click",
      openSettingsDialog
    );

  document
    .querySelector(
      "#close-settings-button"
    )
    ?.addEventListener(
      "click",
      closeSettingsDialog
    );

  document
    .querySelector(
      "#select-language"
    )
    ?.addEventListener(
      "change",
      (event) => updateSetting(
        "language",
        event.target.value
      )
    );

  document
    .querySelector(
      "#select-visual-style"
    )
    ?.addEventListener(
      "change",
      (event) => updateSetting(
        "visualStyle",
        event.target.value
      )
    );

  document
    .querySelector(
      "#select-currency"
    )
    ?.addEventListener(
      "change",
      (event) => updateSetting(
        "currency",
        event.target.value
      )
    );

  document
    .querySelector(
      "#monthly-budget-input"
    )
    ?.addEventListener(
      "change",
      saveMonthlyBudget
    );

  document
    .querySelector(
      "#select-add-button-icon"
    )
    ?.addEventListener(
      "change",
      (event) => updateSetting(
        "addButtonIcon",
        event.target.value
      )
    );

  document
    .querySelector(
      "#export-backup-button"
    )
    ?.addEventListener(
      "click",
      downloadBackup
    );

  document
    .querySelector(
      "#import-backup-button"
    )
    ?.addEventListener(
      "click",
      () => document
        .querySelector(
          "#backup-file-input"
        )
        ?.click()
    );

  document
    .querySelector(
      "#backup-file-input"
    )
    ?.addEventListener(
      "change",
      async (event) => {
        const [file] =
          event.target.files;

        await importBackupFile(file);

        event.target.value = "";
      }
    );

  document
    .querySelector(
      "#clear-data-button"
    )
    ?.addEventListener(
      "click",
      clearStoredApplicationData
    );

  applyApplicationSettings(
    getSettings()
  );
}