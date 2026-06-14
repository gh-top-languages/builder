import { THEMES                             } from "@gh-top-languages/lib/constants/themes.js";
import type { Language                      } from "@gh-top-languages/lib/types.js";
import { generateChartData                  } from "@gh-top-languages/lib/render/chart.js";
import { renderSvg                          } from "@gh-top-languages/lib/render/svg.js";
import { DEFAULT_CONFIG                     } from "@gh-top-languages/lib/constants/config.js";
import { parseQueryParams, type QueryParams } from "@gh-top-languages/lib/utils/params.js";

import testData from "./data/test-data.json";
const DEFAULT_LANGUAGES = testData as Language[];

function getInputValue(id: string, fallback: string): string {
  const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  return el?.value ?? fallback;
}

function isNoneTheme(): boolean {
  return getInputValue("theme", "default") === "none";
}

function updateColourPickers(): void {
  const container = document.getElementById("colour-pickers");
  if (!container) return;

  if (!isNoneTheme()) {
    container.hidden = true;
    return;
  }

  const count   = parseInt(getInputValue("count", String(DEFAULT_CONFIG.COUNT)), 10);
  const colours = THEMES.default.colours;

  container.hidden  = false;
  container.innerHTML = "";

  const heading       = document.createElement("label");
  heading.textContent = "Colours";
  heading.className   = "section-heading";
  container.appendChild(heading);

  for (let i = 0; i < count; i++) {
    const langName = DEFAULT_LANGUAGES[i]?.lang ?? `Colour ${i + 1}`;
    const colour   = colours[i] ?? "#ffffff";

    const row   = document.createElement("div");
    row.className = "colour-picker-row";

    const label       = document.createElement("label");
    label.htmlFor     = `c${i + 1}`;
    label.textContent = langName;

    const input   = document.createElement("input");
    input.type    = "color";
    input.id      = `c${i + 1}`;
    input.value   = colour;
    input.addEventListener("input", () => renderChart(DEFAULT_LANGUAGES));

    row.appendChild(label);
    row.appendChild(input);
    container.appendChild(row);
  }
}

function buildParams(): ReturnType<typeof parseQueryParams> {
  const count  = getInputValue("count", String(DEFAULT_CONFIG.COUNT));
  const isNone = isNoneTheme();
  const strokeEl = document.getElementById("stroke") as HTMLInputElement | null;

  const query: QueryParams = {
    theme:  isNone ? undefined : getInputValue("theme", "default"),
    type:   getInputValue("type",   "donut"),
    count,
    width:  getInputValue("width",  String(DEFAULT_CONFIG.WIDTH)),
    height: getInputValue("height", String(DEFAULT_CONFIG.HEIGHT)),
    stroke: strokeEl?.checked ? "true" : "false",
  };

  if (isNone) {
    const countNum = parseInt(count, 10);
    for (let i = 1; i <= countNum; i++) {
      const el = document.getElementById(`c${i}`) as HTMLInputElement | null;
      if (el) query[`c${i}`] = el.value.slice(1);
    }
  }

  return parseQueryParams(query);
}

function renderChart(languages: Language[]): void {
  const preview = document.getElementById("chart-preview");
  if (!preview) return;

  const params = buildParams();
  const result = generateChartData(
    languages.slice(0, params.count),
    params.selectedTheme,
    params.chartType,
    params.width,
    params.stroke
  );
  const svg = renderSvg(
    params.width, params.height,
    params.selectedTheme.bg,
    result.segments,
    result.legend,
    params.chartTitle,
    params.selectedTheme.text
  );

  preview.innerHTML = svg;

  const svgEl = preview.querySelector("svg");
  if (svgEl) {
    svgEl.setAttribute("viewBox", `0 0 ${params.width} ${params.height}`);
    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "100%");
  }
}

function clampToMin(el: HTMLInputElement): void {
  const min = parseInt(el.min, 10);
  const val = parseInt(el.value, 10);
  if (Number.isNaN(val) || val < min) el.value = String(min);
}

function init(): void {
  updateColourPickers();
  renderChart(DEFAULT_LANGUAGES);

  const widthEl  = document.getElementById("width")  as HTMLInputElement | null;
  const heightEl = document.getElementById("height") as HTMLInputElement | null;
  if (widthEl)  widthEl.min  = String(DEFAULT_CONFIG.MIN_WIDTH);
  if (heightEl) heightEl.min = String(DEFAULT_CONFIG.MIN_HEIGHT);
  widthEl?.addEventListener( "blur", () => { clampToMin(widthEl);  renderChart(DEFAULT_LANGUAGES); });
  heightEl?.addEventListener("blur", () => { clampToMin(heightEl); renderChart(DEFAULT_LANGUAGES); });

  ["type", "width", "height", "stroke"].forEach(id =>
    document.getElementById(id)?.addEventListener("change", () => renderChart(DEFAULT_LANGUAGES))
  );

  document.getElementById("theme")?.addEventListener("change", () => {
    updateColourPickers();
    renderChart(DEFAULT_LANGUAGES);
  });

  document.getElementById("count")?.addEventListener("change", () => {
    updateColourPickers();
    renderChart(DEFAULT_LANGUAGES);
  });
}

init();
