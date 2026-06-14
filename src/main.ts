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

function buildParams(): ReturnType<typeof parseQueryParams> {
  const query: QueryParams = {
    theme:  getInputValue("theme",  "default"),
    type:   getInputValue("type",   "donut"),
    count:  getInputValue("count",  String(DEFAULT_CONFIG.COUNT)),
    width:  getInputValue("width",  String(DEFAULT_CONFIG.WIDTH)),
    height: getInputValue("height", String(DEFAULT_CONFIG.HEIGHT)),
  };
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
    false
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
    svgEl.removeAttribute("height");
  }
}

function init(): void {
  renderChart(DEFAULT_LANGUAGES);
  ["theme", "type", "count", "width", "height"].forEach(id =>
    document.getElementById(id)?.addEventListener("change", () => renderChart(DEFAULT_LANGUAGES))
  );
}

init();
