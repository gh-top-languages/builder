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

function buildEmbedUrl(baseUrl: string): string {
  const q: string[] = [];
  const isNone = isNoneTheme();

  const theme = getInputValue("theme", "default");
  if (!isNone && theme !== "default") q.push(`theme=${theme}`);

  const type = getInputValue("type", "donut");
  if (type !== "donut") q.push(`type=${type}`);

  const count = getInputValue("count", String(DEFAULT_CONFIG.COUNT));
  if (count !== String(DEFAULT_CONFIG.COUNT)) q.push(`count=${count}`);

  const width = getInputValue("width", String(DEFAULT_CONFIG.WIDTH));
  if (width !== String(DEFAULT_CONFIG.WIDTH)) q.push(`width=${width}`);

  const height = getInputValue("height", String(DEFAULT_CONFIG.HEIGHT));
  if (height !== String(DEFAULT_CONFIG.HEIGHT)) q.push(`height=${height}`);

  const strokeEl = document.getElementById("stroke") as HTMLInputElement | null;
  if (strokeEl?.checked) q.push("stroke=true");

  if (isNone) {
    const countNum = parseInt(count, 10);
    for (let i = 1; i <= countNum; i++) {
      const el = document.getElementById(`c${i}`) as HTMLInputElement | null;
      if (el) q.push(`c${i}=${el.value.slice(1)}`);
    }
  }

  return q.length > 0 ? `${baseUrl}?${q.join("&")}` : baseUrl;
}

function updateEmbed(): void {
  const host       = (document.getElementById("api-host")     as HTMLInputElement | null)?.value.trim() || "your-deployment.vercel.app";
  const endpoint   = (document.getElementById("api-endpoint") as HTMLInputElement | null)?.value.trim() || "/api/languages";
  const baseUrl    = `https://${host}${endpoint}`;
  const url        = buildEmbedUrl(baseUrl);
  const embedUrlEl = document.getElementById("embed-url")      as HTMLInputElement | null;
  const embedMdEl  = document.getElementById("embed-markdown") as HTMLInputElement | null;
  if (embedUrlEl) embedUrlEl.value = url;
  if (embedMdEl)  embedMdEl.value  = `![Top Languages](${url})`;
}

function renderChart(languages: Language[]): void {
  const preview = document.getElementById("chart-preview");
  if (!preview) return;

  const params = buildParams();
  const result = generateChartData(
    languages.slice(0, params.count),
    params.selectedTheme,
    params.chartType,
    params.stroke
  );
  const svg = renderSvg(
    params.width, params.height,
    params.selectedTheme.bg,
    result,
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

  updateEmbed();
}

function clampToMin(el: HTMLInputElement): void {
  const min = parseInt(el.min, 10);
  const val = parseInt(el.value, 10);
  if (Number.isNaN(val) || val < min) el.value = String(min);
}

function init(): void {
  updateColourPickers();
  renderChart(DEFAULT_LANGUAGES);

  const countEl  = document.getElementById("count")  as HTMLInputElement | null;
  if (countEl)  {
    countEl.min   = "1";
    countEl.max   = String(DEFAULT_CONFIG.MAX_COUNT);
    countEl.value = String(DEFAULT_CONFIG.COUNT);
  }

  const widthEl  = document.getElementById("width")  as HTMLInputElement | null;
  if (widthEl)  {
    widthEl.min   = String(DEFAULT_CONFIG.MIN_WIDTH);
    widthEl.value = String(DEFAULT_CONFIG.WIDTH);
  }
  widthEl?.addEventListener( "blur", () => {
    clampToMin(widthEl);
    renderChart(DEFAULT_LANGUAGES);
  });

  const heightEl = document.getElementById("height") as HTMLInputElement | null;
  if (heightEl) {
    heightEl.min = String(DEFAULT_CONFIG.MIN_HEIGHT);
    heightEl.value = String(DEFAULT_CONFIG.HEIGHT);
  }
  heightEl?.addEventListener("blur", () => {
    clampToMin(heightEl);
    renderChart(DEFAULT_LANGUAGES);
  });

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

  document.getElementById("api-host")?.addEventListener("input", () => {
    const el = document.getElementById("api-host") as HTMLInputElement | null;
    if (!el) return;

    let val = el.value;
    if (val.startsWith("https://")) val = val.slice(8);
    if (val.startsWith("http://"))  val = val.slice(7);

    const slashIndex = val.indexOf("/");
    if (slashIndex !== -1) {
      const path = val.slice(slashIndex);
      if (path.length > 1) {
        const endpointEl = document.getElementById("api-endpoint") as HTMLInputElement | null;
        if (endpointEl) endpointEl.value = path;
      }
      val = val.slice(0, slashIndex);
    }

    el.value = val;
    updateEmbed();
  });

  document.getElementById("api-endpoint")?.addEventListener("input", updateEmbed);

  document.getElementById("copy-url")?.addEventListener("click", () => {
    const el = document.getElementById("embed-url") as HTMLInputElement | null;
    if (el?.value) void navigator.clipboard.writeText(el.value);
  });

  document.getElementById("copy-markdown")?.addEventListener("click", () => {
    const el = document.getElementById("embed-markdown") as HTMLInputElement | null;
    if (el?.value) void navigator.clipboard.writeText(el.value);
  });
}

init();
