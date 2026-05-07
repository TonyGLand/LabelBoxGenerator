const defaults = {
  labelText: `Small Parts
Fragile
Handle With Care
Batch A-104
QA Hold
Ready To Ship`,
  repeat: true,
  paperSize: "letter",
  orientation: "portrait",
  columns: 3,
  rows: 8,
  marginX: 0.5,
  marginY: 0.5,
  gapX: 0.125,
  gapY: 0.125,
  fontSize: 14,
  padding: 0.08,
  borderWidth: 1,
  radius: 0.04,
  borderStyle: "solid",
  align: "center",
  borderColor: "#1f2933",
  textColor: "#111827"
};

const paperSizes = {
  letter: { label: "Letter", width: 8.5, height: 11, unit: "in" },
  a4: { label: "A4", width: 210, height: 297, unit: "mm" }
};

const elements = {
  sheet: document.getElementById("sheet"),
  sheetSummary: document.getElementById("sheet-summary"),
  boxSize: document.getElementById("box-size"),
  labelCount: document.getElementById("label-count"),
  printPageStyle: document.getElementById("print-page-style"),
  labelText: document.getElementById("label-text"),
  repeat: document.getElementById("repeat-labels"),
  paperSize: document.getElementById("paper-size"),
  orientation: document.getElementById("orientation"),
  columns: document.getElementById("columns"),
  rows: document.getElementById("rows"),
  marginX: document.getElementById("margin-x"),
  marginY: document.getElementById("margin-y"),
  gapX: document.getElementById("gap-x"),
  gapY: document.getElementById("gap-y"),
  fontSize: document.getElementById("font-size"),
  padding: document.getElementById("padding"),
  borderWidth: document.getElementById("border-width"),
  radius: document.getElementById("radius"),
  borderStyle: document.getElementById("border-style"),
  align: document.getElementById("align"),
  borderColor: document.getElementById("border-color"),
  textColor: document.getElementById("text-color"),
  resetButton: document.getElementById("reset-button"),
  printButton: document.getElementById("print-button"),
  sampleButton: document.getElementById("sample-button")
};

const sampleLabels = [
  "Bin A-01",
  "Bin A-02",
  "Bin A-03",
  "Returns",
  "Priority",
  "Packed",
  "Inspection",
  "Spare Cables",
  "Adapters",
  "Manuals",
  "Shelf 3",
  "Archive"
];

function getNumber(element, fallback) {
  const value = Number.parseFloat(element.value);
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getState() {
  return {
    labelText: elements.labelText.value,
    repeat: elements.repeat.checked,
    paperSize: elements.paperSize.value,
    orientation: elements.orientation.value,
    columns: clamp(Math.round(getNumber(elements.columns, defaults.columns)), 1, 12),
    rows: clamp(Math.round(getNumber(elements.rows, defaults.rows)), 1, 20),
    marginX: clamp(getNumber(elements.marginX, defaults.marginX), 0, 2),
    marginY: clamp(getNumber(elements.marginY, defaults.marginY), 0, 2),
    gapX: clamp(getNumber(elements.gapX, defaults.gapX), 0, 1),
    gapY: clamp(getNumber(elements.gapY, defaults.gapY), 0, 1),
    fontSize: clamp(getNumber(elements.fontSize, defaults.fontSize), 6, 48),
    padding: clamp(getNumber(elements.padding, defaults.padding), 0, 0.5),
    borderWidth: clamp(getNumber(elements.borderWidth, defaults.borderWidth), 0, 8),
    radius: clamp(getNumber(elements.radius, defaults.radius), 0, 0.5),
    borderStyle: elements.borderStyle.value,
    align: elements.align.value,
    borderColor: elements.borderColor.value,
    textColor: elements.textColor.value
  };
}

function setState(state) {
  elements.labelText.value = state.labelText;
  elements.repeat.checked = state.repeat;
  elements.paperSize.value = state.paperSize;
  elements.orientation.value = state.orientation;
  elements.columns.value = state.columns;
  elements.rows.value = state.rows;
  elements.marginX.value = state.marginX;
  elements.marginY.value = state.marginY;
  elements.gapX.value = state.gapX;
  elements.gapY.value = state.gapY;
  elements.fontSize.value = state.fontSize;
  elements.padding.value = state.padding;
  elements.borderWidth.value = state.borderWidth;
  elements.radius.value = state.radius;
  elements.borderStyle.value = state.borderStyle;
  elements.align.value = state.align;
  elements.borderColor.value = state.borderColor;
  elements.textColor.value = state.textColor;
}

function getPage(state) {
  const paper = paperSizes[state.paperSize] ?? paperSizes.letter;
  const landscape = state.orientation === "landscape";
  return {
    label: paper.label,
    width: landscape ? paper.height : paper.width,
    height: landscape ? paper.width : paper.height,
    unit: paper.unit
  };
}

function toInches(value, unit) {
  return unit === "mm" ? value / 25.4 : value;
}

function formatDimension(value) {
  return `${value.toFixed(2).replace(/\.?0+$/, "")} in`;
}

function getLabels(state, boxCount) {
  const lines = state.labelText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return Array.from({ length: boxCount }, () => "");
  }

  return Array.from({ length: boxCount }, (_, index) => {
    if (index < lines.length) {
      return lines[index];
    }

    return state.repeat ? lines[index % lines.length] : "";
  });
}

function updateCssVariables(state, page) {
  const root = document.documentElement;
  root.style.setProperty("--page-width", `${page.width}${page.unit}`);
  root.style.setProperty("--page-height", `${page.height}${page.unit}`);
  root.style.setProperty("--columns", state.columns);
  root.style.setProperty("--rows", state.rows);
  root.style.setProperty("--margin-x", `${state.marginX}in`);
  root.style.setProperty("--margin-y", `${state.marginY}in`);
  root.style.setProperty("--gap-x", `${state.gapX}in`);
  root.style.setProperty("--gap-y", `${state.gapY}in`);
  root.style.setProperty("--label-font-size", `${state.fontSize}pt`);
  root.style.setProperty("--label-padding", `${state.padding}in`);
  root.style.setProperty("--label-border-width", `${state.borderWidth}px`);
  root.style.setProperty("--label-border-style", state.borderStyle);
  root.style.setProperty("--label-border-color", state.borderColor);
  root.style.setProperty("--label-text-color", state.textColor);
  root.style.setProperty("--label-radius", `${state.radius}in`);
  root.style.setProperty("--label-align", state.align);
}

function updatePrintPage(page) {
  elements.printPageStyle.textContent = `@page { size: ${page.width}${page.unit} ${page.height}${page.unit}; margin: 0; }`;
}

function renderSheet() {
  const state = getState();
  const page = getPage(state);
  const boxCount = state.columns * state.rows;
  const labels = getLabels(state, boxCount);

  updateCssVariables(state, page);
  updatePrintPage(page);

  elements.sheet.replaceChildren(
    ...labels.map((label) => {
      const box = document.createElement("div");
      box.className = "label-box";
      box.textContent = label;
      box.dataset.empty = label ? "false" : "true";
      return box;
    })
  );

  updateSummary(state, page, boxCount);
  scalePreview();
}

function updateSummary(state, page, boxCount) {
  const pageWidthIn = toInches(page.width, page.unit);
  const pageHeightIn = toInches(page.height, page.unit);
  const usableWidth = pageWidthIn - state.marginX * 2 - state.gapX * (state.columns - 1);
  const usableHeight = pageHeightIn - state.marginY * 2 - state.gapY * (state.rows - 1);
  const boxWidth = Math.max(0, usableWidth / state.columns);
  const boxHeight = Math.max(0, usableHeight / state.rows);
  const direction = state.orientation.charAt(0).toUpperCase() + state.orientation.slice(1);

  elements.sheetSummary.textContent = `${page.label} ${direction.toLowerCase()}, ${state.columns} x ${state.rows} labels`;
  elements.boxSize.textContent = `Label size: ${formatDimension(boxWidth)} x ${formatDimension(boxHeight)}`;
  elements.labelCount.textContent = `${boxCount} ${boxCount === 1 ? "box" : "boxes"}`;
}

function scalePreview() {
  const preview = elements.sheet.parentElement;
  const sheet = elements.sheet;

  sheet.style.transform = "none";
  sheet.style.marginBottom = "0";

  const available = preview.clientWidth - 32;
  const actual = sheet.offsetWidth;
  const scale = actual > available && available > 0 ? available / actual : 1;

  sheet.style.transform = `scale(${scale})`;
  sheet.style.marginBottom = `${sheet.offsetHeight * (scale - 1)}px`;
}

function bindEvents() {
  const liveElements = [
    elements.labelText,
    elements.repeat,
    elements.paperSize,
    elements.orientation,
    elements.columns,
    elements.rows,
    elements.marginX,
    elements.marginY,
    elements.gapX,
    elements.gapY,
    elements.fontSize,
    elements.padding,
    elements.borderWidth,
    elements.radius,
    elements.borderStyle,
    elements.align,
    elements.borderColor,
    elements.textColor
  ];

  liveElements.forEach((element) => {
    element.addEventListener("input", renderSheet);
    element.addEventListener("change", renderSheet);
  });

  document.querySelectorAll(".swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      elements.borderColor.value = swatch.dataset.color;
      elements.textColor.value = swatch.dataset.color;
      renderSheet();
    });
  });

  elements.resetButton.addEventListener("click", () => {
    setState(defaults);
    renderSheet();
  });

  elements.sampleButton.addEventListener("click", () => {
    elements.labelText.value = sampleLabels.join("\n");
    renderSheet();
  });

  elements.printButton.addEventListener("click", () => {
    window.print();
  });

  window.addEventListener("resize", scalePreview);
}

bindEvents();
setState(defaults);
renderSheet();
