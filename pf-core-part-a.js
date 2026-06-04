/*!
 * pf-core.js
 * SQPSBLOG — Squarespace Page Blog Filter
 * Hosted: https://raw.githubusercontent.com/ashlyleh/ss-assets/main/pf-core.js
 *
 * Contains:
 *   1. Extended config override injection (reads window.SQPSBLOGConfig)
 *   2. Original blog filter engine (renamed sqpsblog-*)
 *
 * Config is kept separate — paste sqpsblog-config.html into each
 * page's Header Code Injection in Squarespace.
 */

// ── PART A: Extended override injection ───────────────────────────────
// Runs immediately; reads SQPSBLOGConfig extended keys and injects
// a <style> block that overrides hardcoded values in the engine CSS.
// If no extended keys are set, nothing is written.
(function () {
  var cfg = window.SQPSBLOGConfig;
  if (!cfg) return;

  function val(key) {
    return cfg[key] != null ? String(cfg[key]) : null;
  }

  var vars = [];

  // Border radius
  if (val("cardBorderRadius")) {
    var r = val("cardBorderRadius");
    var isRound  = r === "99px" || r === "50%" || parseInt(r) > 24;
    var isSquare = r === "0" || r === "0px";
    vars.push("--sqpsblog-btn-radius: "  + (isSquare ? "0px" : isRound ? "99px" : r));
    vars.push("--sqpsblog-card-radius: " + (isSquare ? "0px" : isRound ? "12px" : r));
    vars.push("--sqpsblog-cta-radius: "  + (isSquare ? "0px" : isRound ? "99px" : r));
  }

  // Font sizes
  if (val("cardTitleSize"))      vars.push("--sqpsblog-title-size: "      + val("cardTitleSize"));
  if (val("cardHeroTitleSize"))  vars.push("--sqpsblog-hero-title-size: " + val("cardHeroTitleSize"));
  if (val("cardExcerptSize"))    vars.push("--sqpsblog-excerpt-size: "    + val("cardExcerptSize"));
  if (val("cardMetaSize"))       vars.push("--sqpsblog-meta-size: "       + val("cardMetaSize"));
  if (val("cardCtaSize"))        vars.push("--sqpsblog-cta-size: "        + val("cardCtaSize"));
  if (val("filterBarSize"))      vars.push("--sqpsblog-bar-size: "        + val("filterBarSize"));

  // Card text colors
  if (val("cardTitleColor"))     vars.push("--sqpsblog-title-color: "     + val("cardTitleColor"));
  if (val("cardExcerptColor"))   vars.push("--sqpsblog-excerpt-color: "   + val("cardExcerptColor"));
  if (val("cardMetaColor"))      vars.push("--sqpsblog-meta-color: "      + val("cardMetaColor"));

  // CTA button
  if (val("ctaBg"))              vars.push("--sqpsblog-cta-bg: "          + val("ctaBg"));
  if (val("ctaBorder"))          vars.push("--sqpsblog-cta-border: "      + val("ctaBorder"));
  if (val("ctaColor"))           vars.push("--sqpsblog-cta-color: "       + val("ctaColor"));

  // Category pill
  if (val("categoryPillBg"))     vars.push("--sqpsblog-pill-bg: "         + val("categoryPillBg"));
  if (val("categoryPillColor"))  vars.push("--sqpsblog-pill-color: "      + val("categoryPillColor"));

  // Filter bar
  if (val("filterBarBg"))        vars.push("--sqpsblog-bar-bg: "          + val("filterBarBg"));
  if (val("filterBarBorder"))    vars.push("--sqpsblog-bar-border: "      + val("filterBarBorder"));

  // Card body padding
  if (val("cardBodyPadding"))    vars.push("--sqpsblog-body-pad: "        + val("cardBodyPadding"));

  if (!vars.length) return;

  var varBlock = "#sqpsblog, [id^=\"sqpsblog\"] {\n  " + vars.join(";\n  ") + ";\n}";

  var overrides = [];

  if (val("cardTitleSize")) {
    overrides.push(
      ".sqpsblog-card-title { font-size: var(--sqpsblog-title-size) !important; }",
      "[data-layout=\"mosaic\"] .sqpsblog-card-title { font-size: var(--sqpsblog-title-size) !important; }"
    );
  }
  if (val("cardHeroTitleSize")) {
    overrides.push(
      ".sqpsblog-card-hero .sqpsblog-card-title { font-size: var(--sqpsblog-hero-title-size) !important; }",
      "[data-layout=\"newsroom\"] .sqpsblog-card-newsroom:nth-child(1) .sqpsblog-card-title { font-size: var(--sqpsblog-hero-title-size) !important; }",
      "[data-layout=\"newsroom\"] .sqpsblog-card-newsroom:nth-child(2) .sqpsblog-card-title { font-size: var(--sqpsblog-hero-title-size) !important; }"
    );
  }
  if (val("cardExcerptSize")) {
    overrides.push(".sqpsblog-card-excerpt { font-size: var(--sqpsblog-excerpt-size) !important; }");
  }
  if (val("cardMetaSize")) {
    overrides.push(
      ".sqpsblog-card-read   { font-size: var(--sqpsblog-meta-size) !important; }",
      ".sqpsblog-card-date   { font-size: var(--sqpsblog-meta-size) !important; }",
      ".sqpsblog-card-author { font-size: var(--sqpsblog-meta-size) !important; }"
    );
  }
  if (val("cardCtaSize")) {
    overrides.push(".sqpsblog-card-cta { font-size: var(--sqpsblog-cta-size) !important; }");
  }
  if (val("filterBarSize")) {
    overrides.push(
      ".sqpsblog-search    { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-dd-label  { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-dd-option { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-sort      { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-clear     { font-size: var(--sqpsblog-bar-size) !important; }"
    );
  }
  if (val("cardTitleColor")) {
    overrides.push(".sqpsblog-card-title { color: var(--sqpsblog-title-color) !important; }");
  }
  if (val("cardExcerptColor")) {
    overrides.push(".sqpsblog-card-excerpt { color: var(--sqpsblog-excerpt-color) !important; }");
  }
  if (val("cardMetaColor")) {
    overrides.push(
      ".sqpsblog-card-read   { color: var(--sqpsblog-meta-color) !important; }",
      ".sqpsblog-card-date   { color: var(--sqpsblog-meta-color) !important; }",
      ".sqpsblog-card-author { color: var(--sqpsblog-meta-color) !important; }"
    );
  }
  if (val("ctaBg") || val("ctaBorder") || val("ctaColor")) {
    var ctaRules = [];
    if (val("ctaBg"))     ctaRules.push("background: var(--sqpsblog-cta-bg)");
    if (val("ctaBorder")) ctaRules.push("border-color: var(--sqpsblog-cta-border)");
    if (val("ctaColor"))  ctaRules.push("color: var(--sqpsblog-cta-color)");
    overrides.push(".sqpsblog-card-cta { " + ctaRules.join("; ") + " !important; }");
    var mosaicRules = [];
    if (val("ctaBg"))     mosaicRules.push("background: var(--sqpsblog-cta-bg)");
    if (val("ctaBorder")) mosaicRules.push("border-color: var(--sqpsblog-cta-border)");
    if (val("ctaColor"))  mosaicRules.push("color: var(--sqpsblog-cta-color)");
    if (mosaicRules.length) overrides.push(".sqpsblog-mosaic-pill { " + mosaicRules.join("; ") + " !important; }");
  }
  if (val("categoryPillBg") || val("categoryPillColor")) {
    var pillRules = [];
    if (val("categoryPillBg"))    pillRules.push("background: var(--sqpsblog-pill-bg)");
    if (val("categoryPillColor")) pillRules.push("color: var(--sqpsblog-pill-color)");
    overrides.push(".sqpsblog-card-cat-pill { " + pillRules.join("; ") + " !important; }");
  }
  if (val("filterBarBg") || val("filterBarBorder")) {
    var barRules = [];
    if (val("filterBarBg"))     barRules.push("background: var(--sqpsblog-bar-bg)");
    if (val("filterBarBorder")) barRules.push("border-color: var(--sqpsblog-bar-border)");
    overrides.push(".sqpsblog-filter-bar { " + barRules.join("; ") + " !important; }");
    if (val("filterBarBorder")) {
      overrides.push(
        ".sqpsblog-filter-bar[data-style=\"option2\"] .sqpsblog-filter-left { border-right-color: var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-filter-bar[data-style=\"option2\"] .sqpsblog-dd-header   { border-left-color:  var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-filter-bar[data-style=\"option2\"] .sqpsblog-sort        { border-left-color:  var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-filter-bar[data-style=\"option2\"] .sqpsblog-layout-wrap { border-left-color:  var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-search-wrap { border-color: var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-dd-header   { border-color: var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-sort        { border-color: var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-layout-wrap { border-color: var(--sqpsblog-bar-border) !important; }",
        ".sqpsblog-card-footer { border-top-color: var(--sqpsblog-bar-border) !important; }"
      );
    }
  }
  if (val("cardBodyPadding")) {
    overrides.push(
      ".sqpsblog-card-body { padding: var(--sqpsblog-body-pad) !important; }",
      "[data-layout=\"newsroom\"] .sqpsblog-card-newsroom:nth-child(2) .sqpsblog-card-body { padding: var(--sqpsblog-body-pad) !important; }"
    );
  }

  var css   = varBlock + "\n\n" + overrides.join("\n");
  var style = document.createElement("style");
  style.id  = "sqpsblog-extended";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
})();

// ── PART B: Blog filter engine ────────────────────────────────────────
// Original engine with all class/variable names updated to sqpsblog-* prefix.

// NOTE FOR SETUP:
// Run: python3 rename-engine.py original-engine.js >> pf-core.js
// Or paste the renamed engine content directly below this line.
//
// The rename script (rename-engine.py) is included in the ss-assets repo.
