(function () {
  const STORAGE_KEY = "cpp_studio_palette_lock_v1";
  const root = document.documentElement;

  const PALETTES = {
    "emerald-mint": {
      "--background": "#F4FBF7",
      "--content": "#D1FAE5",
      "--card": "#FFFFFF",
      "--sidebar": "#ECFDF5",
      "--border": "#D1E7DD",
      "--foreground": "#06281E",
      "--muted-foreground": "#3F6256",
      "--placeholder": "#52796F",
      "--primary": "#10B981",
      "--primary-foreground": "#052E16",
      "--secondary": "#D1FAE5",
      "--secondary-foreground": "#065F46",
      "--accent": "#059669",
      "--code-bg": "#06281E",
      "--code-fg": "#A7F3D0"
    },
    "solar-yellow": {
      "--background": "#FFFDF5",
      "--content": "#FEF9C3",
      "--card": "#FFFFFF",
      "--sidebar": "#FFFBEB",
      "--border": "#E4E4E7",
      "--foreground": "#18181B",
      "--muted-foreground": "#52525B",
      "--placeholder": "#71717A",
      "--primary": "#FACC15",
      "--primary-foreground": "#18181B",
      "--secondary": "#FEF08A",
      "--secondary-foreground": "#713F12",
      "--accent": "#EAB308",
      "--code-bg": "#18181B",
      "--code-fg": "#FEF9C3"
    },
    "royal-indigo": {
      "--background": "#F8FAFC",
      "--content": "#E0E7FF",
      "--card": "#FFFFFF",
      "--sidebar": "#EEF2FF",
      "--border": "#CBD5E1",
      "--foreground": "#0F172A",
      "--muted-foreground": "#475569",
      "--placeholder": "#64748B",
      "--primary": "#6366F1",
      "--primary-foreground": "#FFFFFF",
      "--secondary": "#FEF3C7",
      "--secondary-foreground": "#92400E",
      "--accent": "#4F46E5",
      "--code-bg": "#0F172A",
      "--code-fg": "#E0E7FF"
    },
    "cyber-dark": {
      "--background": "#0D0D10",
      "--content": "#141418",
      "--card": "#18181E",
      "--sidebar": "#121216",
      "--border": "#2E2E36",
      "--foreground": "#FAFAFA",
      "--muted-foreground": "#A1A1AA",
      "--placeholder": "#71717A",
      "--primary": "#FACC15",
      "--primary-foreground": "#09090B",
      "--secondary": "#27272A",
      "--secondary-foreground": "#FDE047",
      "--accent": "#EAB308",
      "--code-bg": "#09090B",
      "--code-fg": "#FDE047"
    }
  };

  function getSavedPalette() {
    try {
      const saved = window.localStorage && window.localStorage.getItem(STORAGE_KEY);
      if (saved && PALETTES[saved]) return saved;
    } catch (_) {}
    return "emerald-mint";
  }

  let currentPalette = getSavedPalette();

  window.setStlPalette = function (paletteKey) {
    const validKey = PALETTES[paletteKey] ? paletteKey : "emerald-mint";
    currentPalette = validKey;
    Object.entries(PALETTES[validKey]).forEach(([k, v]) => root.style.setProperty(k, v));
    root.dataset.theme = validKey;
    try {
      if (window.localStorage) window.localStorage.setItem(STORAGE_KEY, validKey);
    } catch (_) {}
    renderBar();
  };

  function renderBar() {
    let bar = document.getElementById("stl-trinity-theme-bar");
    const header = document.querySelector("header.fixed");
    if (!bar && header) {
      bar = document.createElement("div");
      bar.id = "stl-trinity-theme-bar";
      bar.style.cssText = "background:var(--sidebar);border-top:1px solid var(--border);padding:6px 16px;";
      header.appendChild(bar);
    }
    if (!bar) return;

    const options = [
      { id: "emerald-mint", label: "White + Green (Default)", dot: "#10B981" },
      { id: "solar-yellow", label: "White + Yellow", dot: "#FACC15" },
      { id: "royal-indigo", label: "White + Indigo", dot: "#6366F1" },
      { id: "cyber-dark", label: "Carbon + Yellow", dot: "#18181B" }
    ];

    bar.innerHTML = `
      <div style="max-width:72rem;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;font-size:12px;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-family:monospace;">
          <span style="font-weight:700;color:var(--foreground);">C++ STL Original Full Studio</span>
          <a href="https://yashwant938.github.io/portfolio-/labs/cpp-oop/" style="padding:2px 8px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--foreground);text-decoration:none;">OOP Lab ↗</a>
          <a href="https://yashwant938.github.io/portfolio-/labs/cpp-threading/" style="padding:2px 8px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--foreground);text-decoration:none;">Threading Lab ↗</a>
        </div>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;">
          <span style="font-family:monospace;color:var(--muted-foreground);">Theme (Locked):</span>
          ${options
            .map((p) => {
              const active = currentPalette === p.id;
              return `<button type="button" onclick="window.setStlPalette('${p.id}')" style="display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:8px;font-size:12px;font-weight:${
                active ? "700" : "600"
              };cursor:pointer;border:1px solid ${
                active ? "var(--accent)" : "var(--border)"
              };background:${
                active ? "var(--primary)" : "var(--card)"
              };color:${active ? "var(--primary-foreground)" : "var(--foreground)"};">
                <span style="width:10px;height:10px;border-radius:999px;background:${p.dot};border:1px solid var(--border);display:inline-block;"></span>
                <span>${p.label}</span>
              </button>`;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  // Apply saved or default Green & White theme immediately
  Object.entries(PALETTES[currentPalette]).forEach(([k, v]) => root.style.setProperty(k, v));
  root.dataset.theme = currentPalette;

  // Mount bar as soon as React renders header.fixed
  const obs = new MutationObserver(() => {
    if (document.querySelector("header.fixed") && !document.getElementById("stl-trinity-theme-bar")) {
      renderBar();
    }
  });
  if (document.documentElement) {
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
  window.addEventListener("DOMContentLoaded", renderBar);
})();
