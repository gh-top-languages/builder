import type { Language, ChartType } from "github-top-languages-lib/types.js";
import { generateChartData        } from "github-top-languages-lib/render/chart.js";
import { renderSvg                } from "github-top-languages-lib/render/svg.js";
import { THEMES                   } from "github-top-languages-lib/constants/themes.js";
import { DEFAULT_CONFIG           } from "github-top-languages-lib/constants/config.js";

type ThemeKey = keyof typeof THEMES;

const DEFAULT_LANGUAGES: Language[] = [
  { lang: "TypeScript", pct: 40.0 },
  { lang: "JavaScript", pct: 25.0 },
  { lang: "CSS",        pct: 15.0 },
  { lang: "HTML",       pct: 12.0 },
  { lang: "Python",     pct: 8.0  },
];

function getSelectValue(id: string, fallback: string): string {
  const el = document.getElementById(id) as HTMLSelectElement | null;
  return el?.value ?? fallback;
}

function renderChart(languages: Language[]): void {
  const preview = document.getElementById("chart-preview");
  if (!preview) return;

  const themeKey  = getSelectValue("theme", "default") as ThemeKey;
  const chartType = getSelectValue("type",  "donut")   as ChartType;
  const theme     = THEMES[themeKey];

  const result = generateChartData(languages, theme, chartType, DEFAULT_CONFIG.WIDTH, false);
  const svg    = renderSvg(
    DEFAULT_CONFIG.WIDTH,
    DEFAULT_CONFIG.HEIGHT,
    theme.bg,
    result.segments,
    result.legend,
    DEFAULT_CONFIG.TITLE,
    theme.text
  );

  preview.innerHTML = svg;

  const svgEl = preview.querySelector("svg");
  if (svgEl) {
    svgEl.setAttribute("viewBox", `0 0 ${DEFAULT_CONFIG.WIDTH} ${DEFAULT_CONFIG.HEIGHT}`);
    svgEl.setAttribute("width", "100%");
    svgEl.removeAttribute("height");
  }
}

function init(): void {
  renderChart(DEFAULT_LANGUAGES);
  document.getElementById("theme")?.addEventListener("change", () => renderChart(DEFAULT_LANGUAGES));
  document.getElementById("type")?.addEventListener("change",  () => renderChart(DEFAULT_LANGUAGES));
}

init();
