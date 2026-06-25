/*!
 * pf-core.js
 * SQPSBLOG — Squarespace Page Blog Filter
 * Hosted: https://cdn.jsdelivr.net/gh/ashlyleh/ss-assets@main/pf-core.js
 *
 * Contains:
 *   1. Extended config override injection (reads window.SQPSBLOGConfig)
 *   2. Blog filter engine (sqpsblog-* namespace)
 */

// ── PART A: Extended override injection ───────────────────────────────
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
  if (val("cardTitleFont")) {
    var tf = cfg["cardTitleFont"];
    var fontVal = tf === "heading" ? "var(--heading-font-font-family, var(--headingFontFamily, inherit))"
                : tf === "body"    ? "var(--body-font-font-family, var(--bodyFontFamily, inherit))"
                : tf;
    vars.push("--sqpsblog-title-font: " + fontVal);
  }
  if (val("cardHeroTitleSize"))  vars.push("--sqpsblog-hero-title-size: " + val("cardHeroTitleSize"));
  if (val("cardExcerptSize"))    vars.push("--sqpsblog-excerpt-size: "    + val("cardExcerptSize"));
  if (val("cardMetaSize"))       vars.push("--sqpsblog-meta-size: "       + val("cardMetaSize"));
  if (val("cardCtaSize"))        vars.push("--sqpsblog-cta-size: "        + val("cardCtaSize"));
  if (val("filterBarSize"))      vars.push("--sqpsblog-bar-size: "        + val("filterBarSize"));

  // Card text colors
  if (val("cardTitleColor"))     vars.push("--sqpsblog-title-color: "     + val("cardTitleColor"));
  if (val("cardExcerptColor"))   vars.push("--sqpsblog-excerpt-color: "   + val("cardExcerptColor"));
  if (val("cardMetaColor"))      vars.push("--sqpsblog-meta-color: "      + val("cardMetaColor"));

  // Individual meta item styling
  if (val("readTimeColor"))     vars.push("--sqpsblog-read-color: "      + val("readTimeColor"));
  if (val("readTimeSize"))      vars.push("--sqpsblog-read-size: "       + val("readTimeSize"));
  if (val("authorColor"))       vars.push("--sqpsblog-author-color: "    + val("authorColor"));
  if (val("authorSize"))        vars.push("--sqpsblog-author-size: "     + val("authorSize"));
  if (val("dateColor"))         vars.push("--sqpsblog-date-color: "      + val("dateColor"));
  if (val("dateSize"))          vars.push("--sqpsblog-date-size: "       + val("dateSize"));

  // CTA button CSS vars
  if (val("ctaBg"))              vars.push("--sqpsblog-cta-bg: "          + val("ctaBg"));
  if (val("ctaBorder"))          vars.push("--sqpsblog-cta-border: "      + val("ctaBorder"));
  if (val("ctaColor"))           vars.push("--sqpsblog-cta-color: "       + val("ctaColor"));
  if (val("ctaPaddingX"))        vars.push("--sqpsblog-cta-px: "          + val("ctaPaddingX"));
  if (val("ctaPaddingY"))        vars.push("--sqpsblog-cta-py: "          + val("ctaPaddingY"));
  if (val("ctaFontWeight"))      vars.push("--sqpsblog-cta-weight: "      + val("ctaFontWeight"));

  // Category pill
  if (val("categoryPillBg"))          vars.push("--sqpsblog-pill-bg: "         + val("categoryPillBg"));
  if (val("categoryPillColor"))       vars.push("--sqpsblog-pill-color: "      + val("categoryPillColor"));
  if (val("categoryPillPaddingX"))    vars.push("--sqpsblog-pill-px: "         + val("categoryPillPaddingX"));
  if (val("categoryPillPaddingY"))    vars.push("--sqpsblog-pill-py: "         + val("categoryPillPaddingY"));
  if (val("categoryPillFontWeight"))  vars.push("--sqpsblog-pill-weight: "     + val("categoryPillFontWeight"));
  if (val("categoryPillRadius"))      vars.push("--sqpsblog-pill-radius: "     + val("categoryPillRadius"));
  if (val("categoryPillBorderWidth")) vars.push("--sqpsblog-pill-border-w: "   + val("categoryPillBorderWidth"));
  if (val("categoryPillBorderColor")) vars.push("--sqpsblog-pill-border-c: "   + val("categoryPillBorderColor"));

  // Filter bar
  if (val("filterBarBg"))           vars.push("--sqpsblog-bar-bg: "           + val("filterBarBg"));
  if (val("filterBarBorder"))       vars.push("--sqpsblog-bar-border: "       + val("filterBarBorder"));
  if (val("filterBarTextColor"))    vars.push("--sqpsblog-bar-text-color: "   + val("filterBarTextColor"));
  if (val("filterBarPlaceholderColor")) vars.push("--sqpsblog-placeholder-color: " + val("filterBarPlaceholderColor"));

  // Card body padding
  if (val("cardBodyPadding"))    vars.push("--sqpsblog-body-pad: "        + val("cardBodyPadding"));

  // ── Build override CSS rules ─────────────────────────────────────────
  var overrides = [];

  // Font sizes
  if (val("cardTitleSize") || val("cardTitleFont")) {
    var titleRules = [];
    if (val("cardTitleSize")) titleRules.push("font-size: var(--sqpsblog-title-size)");
    if (val("cardTitleFont")) titleRules.push("font-family: var(--sqpsblog-title-font)");
    overrides.push(
      ".sqpsblog-card-title { " + titleRules.join("; ") + " !important; }",
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
  if (val("cardExcerptSize"))
    overrides.push(".sqpsblog-card-excerpt { font-size: var(--sqpsblog-excerpt-size) !important; }");
  if (val("cardMetaSize")) {
    overrides.push(
      ".sqpsblog-card-read   { font-size: var(--sqpsblog-meta-size) !important; }",
      ".sqpsblog-card-date   { font-size: var(--sqpsblog-meta-size) !important; }",
      ".sqpsblog-card-author { font-size: var(--sqpsblog-meta-size) !important; }"
    );
  }
  if (val("cardCtaSize"))
    overrides.push(".sqpsblog-card-cta { font-size: var(--sqpsblog-cta-size) !important; }");
  if (val("filterBarSize")) {
    overrides.push(
      ".sqpsblog-search    { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-dd-label  { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-dd-option { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-sort      { font-size: var(--sqpsblog-bar-size) !important; }",
      ".sqpsblog-clear     { font-size: var(--sqpsblog-bar-size) !important; }"
    );
  }

  // Card text colors
  if (val("cardTitleColor"))
    overrides.push(".sqpsblog-card-title { color: var(--sqpsblog-title-color) !important; }");
  if (val("cardExcerptColor"))
    overrides.push(".sqpsblog-card-excerpt { color: var(--sqpsblog-excerpt-color) !important; }");
  if (val("cardMetaColor")) {
    overrides.push(
      ".sqpsblog-card-read   { color: var(--sqpsblog-meta-color) !important; }",
      ".sqpsblog-card-date   { color: var(--sqpsblog-meta-color) !important; }",
      ".sqpsblog-card-author { color: var(--sqpsblog-meta-color) !important; }"
    );
  }

  // Individual meta overrides (these override cardMetaColor/cardMetaSize)
  if (val("readTimeColor")) overrides.push(".sqpsblog-card-read   { color: var(--sqpsblog-read-color) !important; }");
  if (val("readTimeSize"))  overrides.push(".sqpsblog-card-read   { font-size: var(--sqpsblog-read-size) !important; }");
  if (val("authorColor"))   overrides.push(".sqpsblog-card-author { color: var(--sqpsblog-author-color) !important; }");
  if (val("authorSize"))    overrides.push(".sqpsblog-card-author { font-size: var(--sqpsblog-author-size) !important; }");
  if (val("dateColor"))     overrides.push(".sqpsblog-card-date   { color: var(--sqpsblog-date-color) !important; }");
  if (val("dateSize"))      overrides.push(".sqpsblog-card-date   { font-size: var(--sqpsblog-date-size) !important; }");

  // Meta positioning — each item can sit at a corner of the card body
  // Positions: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  var metaPositions = {
    readTime: cfg["readTimePosition"] || null,
    author:   cfg["authorPosition"]   || null,
    date:     cfg["datePosition"]     || null
  };
  var anyMetaPos = metaPositions.readTime || metaPositions.author || metaPositions.date;
  if (anyMetaPos) {
    // Card body needs relative positioning for absolute children
    overrides.push(".sqpsblog-card-body { position: relative !important; }");
    // Hide empty containers if their children are repositioned
    if (metaPositions.readTime) {
      overrides.push(".sqpsblog-card-meta { display: none !important; }");
    }
    var footerMoved = metaPositions.author && metaPositions.date;
    if (footerMoved) {
      overrides.push(".sqpsblog-card-footer { display: none !important; }");
    }

    var posMap = {
      "top-left":     "top: 0; left: 0;",
      "top-right":    "top: 0; right: 0;",
      "bottom-left":  "bottom: 0; left: 0;",
      "bottom-right": "bottom: 0; right: 0;"
    };
    var selMap = {
      readTime: ".sqpsblog-card-read",
      author:   ".sqpsblog-card-author",
      date:     ".sqpsblog-card-date"
    };
    for (var mk in metaPositions) {
      var mp = metaPositions[mk];
      if (mp && posMap[mp]) {
        var needsBottom = mp.indexOf("bottom") === 0;
        overrides.push(
          selMap[mk] + " { position: absolute !important; " + posMap[mp] + " margin: 0 !important; padding: 4px 0 !important; z-index: 2; }"
        );
        // If placing at bottom, add padding to card-body so content doesn't overlap
        if (needsBottom) {
          overrides.push(".sqpsblog-card-bottom { padding-bottom: 28px !important; }");
        }
      }
    }
  }

  // CTA button — grid cards and non-overlay newsroom cards only.
  // Overlay cards (newsroom hero :nth-child(1), mosaic, standalone hero) keep
  // their white-on-dark defaults from the base stylesheet.
  if (val("ctaBg") || val("ctaBorder") || val("ctaColor") ||
      val("ctaPaddingX") || val("ctaPaddingY") || val("ctaFontWeight") || val("ctaTextTransform")) {
    var ctaRules = [];
    if (val("ctaBg"))            ctaRules.push("background: var(--sqpsblog-cta-bg)");
    if (val("ctaBorder"))        ctaRules.push("border-color: var(--sqpsblog-cta-border)");
    if (val("ctaColor"))         ctaRules.push("color: var(--sqpsblog-cta-color)");
    if (val("ctaPaddingX") || val("ctaPaddingY")) {
      var py = val("ctaPaddingY") || "5px";
      var px = val("ctaPaddingX") || "14px";
      ctaRules.push("padding: " + py + " " + px);
    }
    if (val("ctaFontWeight"))    ctaRules.push("font-weight: var(--sqpsblog-cta-weight)");
    if (val("ctaTextTransform")) {
      var tx = cfg["ctaTextTransform"];
      ctaRules.push("text-transform: " + (tx === "titlecase" ? "capitalize" : tx));
    }
    var ctaBlock = ctaRules.join("; ");
    // Grid cards
    overrides.push("[data-layout=\"grid\"] .sqpsblog-card-cta { " + ctaBlock + " !important; }");
    // Newsroom secondary split card (:nth-child(2)) and standard cards (:nth-child(n+3)) — not overlay
    overrides.push("[data-layout=\"newsroom\"] .sqpsblog-card-newsroom:nth-child(2) .sqpsblog-card-cta { " + ctaBlock + " !important; }");
    overrides.push("[data-layout=\"newsroom\"] .sqpsblog-card-newsroom:nth-child(n+3) .sqpsblog-card-cta { " + ctaBlock + " !important; }");
    // Newsroom hero (:nth-child(1)), mosaic pill, and standalone hero intentionally excluded — white-on-dark styles remain
  }

  // CTA alignment — applies globally across all layouts
  if (val("ctaAlign")) {
    var align = cfg["ctaAlign"];
    if (align === "center" || align === "right") {
      overrides.push(
        ".sqpsblog-card-bottom { align-items: " + (align === "right" ? "flex-end" : "center") + " !important; }"
      );
    } else if (align === "full") {
      overrides.push(
        ".sqpsblog-card-cta { display: block !important; text-align: center !important; width: 100% !important; box-sizing: border-box !important; }"
      );
    }
    // left is default — no override needed
  }

  // Category pill
  if (val("categoryPillBg") || val("categoryPillColor") ||
      val("categoryPillPaddingX") || val("categoryPillPaddingY") ||
      val("categoryPillFontWeight") || val("categoryPillTextTransform")) {
    var pillRules = [];
    if (val("categoryPillBg"))         pillRules.push("background: var(--sqpsblog-pill-bg)");
    if (val("categoryPillColor"))      pillRules.push("color: var(--sqpsblog-pill-color)");
    if (val("categoryPillFontWeight")) pillRules.push("font-weight: var(--sqpsblog-pill-weight)");
    if (val("categoryPillPaddingX") || val("categoryPillPaddingY")) {
      var ppy = val("categoryPillPaddingY") || "4px";
      var ppx = val("categoryPillPaddingX") || "10px";
      pillRules.push("padding: " + ppy + " " + ppx);
    }
    if (val("categoryPillRadius")) pillRules.push("border-radius: var(--sqpsblog-pill-radius)");
    if (val("categoryPillBorderWidth") || val("categoryPillBorderColor")) {
      var pbw = val("categoryPillBorderWidth") || "1px";
      var pbc = val("categoryPillBorderColor") || "transparent";
      pillRules.push("border: " + pbw + " solid " + pbc);
    }
    if (val("categoryPillTextTransform")) {
      var ptx = cfg["categoryPillTextTransform"];
      pillRules.push("text-transform: " + (ptx === "titlecase" ? "capitalize" : ptx));
    }
    // Apply to both regular and mosaic pill variants
    overrides.push(".sqpsblog-card-cat-pill { " + pillRules.join("; ") + " !important; }");
    overrides.push(".sqpsblog-card-cat-pill--mosaic { " + pillRules.join("; ") + " !important; }");
  }

  // Pill container layout + position (applies whenever count > 1 OR position/layout set)
  var multiPill = cfg["categoryPillCount"] && cfg["categoryPillCount"] !== 1;
  if (multiPill || val("categoryPillPosition") || val("categoryPillLayout")) {
    var pos = cfg["categoryPillPosition"] || "top-right";
    var layout = cfg["categoryPillLayout"] || "row";
    var vert = pos.indexOf("top") === 0 ? "flex-start" : "flex-end";
    var horiz = pos.indexOf("left") !== -1 ? "flex-start" : "flex-end";
    var dir = layout === "stack" ? "column" : "row";
    var gap = val("categoryPillGap") || "6px";
    // Inset padding so pills don't touch the card edges
    var inset = val("categoryPillInset") || "12px";
    overrides.push(
      ".sqpsblog-card-img { display: flex !important; flex-direction: " + dir + " !important; flex-wrap: " + (layout === "stack" ? "nowrap" : "wrap") + " !important; align-items: " + horiz + " !important; justify-content: " + vert + " !important; gap: " + gap + " !important; padding: " + inset + " !important; box-sizing: border-box; }",
      ".sqpsblog-card-img img { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; z-index: 0; }",
      ".sqpsblog-card-img .sqpsblog-card-cat-pill { position: relative !important; top: auto !important; right: auto !important; z-index: 2; }",
      "[data-layout=\"mosaic\"] .sqpsblog-card-cat-pill { position: absolute !important; width: auto !important; max-width: calc(100% - 24px); }"
    );
  }

  // Filter bar
  if (val("filterBarBg") || val("filterBarBorder")) {
    var barRules = [];
    if (val("filterBarBg"))     barRules.push("background: var(--sqpsblog-bar-bg)");
    if (val("filterBarBorder")) barRules.push("border-color: var(--sqpsblog-bar-border)");
    overrides.push(".sqpsblog-filter-bar { " + barRules.join("; ") + " !important; }");
    // Mobile dropdown panels + accordion headers share the bar background
    if (val("filterBarBg")) {
      overrides.push(
        ".sqpsblog-mob-acc-header { background: var(--sqpsblog-bar-bg) !important; }",
        ".sqpsblog-mob-acc-opts   { background: var(--sqpsblog-bar-bg) !important; }",
        ".sqpsblog-dd-panel       { background: var(--sqpsblog-bar-bg) !important; }"
      );
    }
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

  // Filter bar text color — search input, dropdowns, sort, labels
  if (val("filterBarTextColor")) {
    overrides.push(
      ".sqpsblog-search      { color: var(--sqpsblog-bar-text-color) !important; }",
      ".sqpsblog-dd-label    { color: var(--sqpsblog-bar-text-color) !important; }",
      ".sqpsblog-dd-option   { color: var(--sqpsblog-bar-text-color) !important; }",
      ".sqpsblog-sort        { color: var(--sqpsblog-bar-text-color) !important; }",
      ".sqpsblog-clear       { color: var(--sqpsblog-bar-text-color) !important; }"
    );
  }

  // Filter bar placeholder color (search "Search posts…" text)
  if (val("filterBarPlaceholderColor")) {
    overrides.push(
      ".sqpsblog-search::placeholder { color: var(--sqpsblog-placeholder-color) !important; opacity: 1 !important; }"
    );
  }

  // Filter bar text transform — affects labels, dropdown text, sort, search placeholder
  if (val("filterBarTextTransform")) {
    var ftx = cfg["filterBarTextTransform"];
    var ftxVal = ftx === "titlecase" ? "capitalize" : ftx;
    overrides.push(
      ".sqpsblog-search::placeholder { text-transform: " + ftxVal + " !important; }",
      ".sqpsblog-dd-label  { text-transform: " + ftxVal + " !important; }",
      ".sqpsblog-sort      { text-transform: " + ftxVal + " !important; }",
      ".sqpsblog-clear     { text-transform: " + ftxVal + " !important; }"
    );
  }

  // Card body padding
  if (val("cardBodyPadding")) {
    overrides.push(
      ".sqpsblog-card-body { padding: var(--sqpsblog-body-pad) !important; }",
      "[data-layout=\"newsroom\"] .sqpsblog-card-newsroom:nth-child(2) .sqpsblog-card-body { padding: var(--sqpsblog-body-pad) !important; }"
    );
  }

  if (!vars.length && !overrides.length) return;

  var varBlock = vars.length
    ? "#sqpsblog, [id^=\"sqpsblog\"] {\n  " + vars.join(";\n  ") + ";\n}"
    : "";

  var css   = varBlock + (varBlock && overrides.length ? "\n\n" : "") + overrides.join("\n");
  var style = document.createElement("style");
  style.id  = "sqpsblog-extended";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
})();


// ── PART B: Blog filter engine ──────────────────────────────────────────
!function(){"use strict";var e="sqpsblog",o="sqpsblog-layout";function r(){var r=window.SQPSBLOGConfig;r&&(Array.isArray(r)||(r=[r]),r.forEach(function(r){r&&r.blogUrl&&function r(t){var a={},s=[],i=[],d=0,n=null,l="",c={categories:new Set,tags:new Set,authors:new Set,years:new Set,search:"",sort:"newest",layout:"grid"};function m(e,o,r,t,i){fetch(r?e+"?format=json&offset="+r:e+"?format=json").then(function(e){return e.json()}).then(function(d){var n,c=d.items||[],p=d.pagination||{};o=o.concat(c);var h=p.nextPageOffset;if(c.length>0&&null!=h&&h!==r)m(e,o,h,t,i);else{if((s=(n=o,n.map(function(e){var o,r,t,s,i,d=(o=e.body||"",r=document.createElement("div"),r.innerHTML=o,["nav","header","footer",'[class*="pager"]','[class*="pagination"]','[class*="Pager"]','[class*="BlogItem-pager"]','[class*="blog-item-pager"]','[class*="BlogList-item-pager"]','[class*="item-pagination"]','[class*="item-pagination-title"]','[class*="BlogItem-pagination"]','[class*="post-nav"]','[class*="prev"]','[class*="next"]'].forEach(function(e){try{r.querySelectorAll(e).forEach(function(e){for(var o=e;o.parentNode&&o.parentNode!==r&&1===o.parentNode.children.length;)o=o.parentNode;o.parentNode&&o.parentNode.removeChild(o)})}catch(o){}}),r.textContent||r.innerText||""),n=Math.max(1,Math.ceil(d.split(/\s+/).filter(Boolean).length/a.wordsPerMinute)),l=e.sourceUrl||"",c=!0===e.passthrough&&l?l:e.fullUrl||"#";return{id:e.id||e.urlId||"",title:f(e.title||""),excerpt:f((t=e.excerpt||"",s=document.createElement("div"),s.innerHTML=t,s.textContent||s.innerText||"")),body:d,categories:(e.categories||[]).map(function(e){return f(e).trim()}),tags:(e.tags||[]).map(function(e){return f(e).trim()}),author:f(e.author&&e.author.displayName||""),publishOn:e.publishOn||0,fullUrl:e.fullUrl||"#",linkUrl:c,thumbnail:e.assetUrl||e.thumbnailUrl||"",readTime:n,year:(i=e.publishOn,i?String(new Date(i).getFullYear()):"")}}))).length>0)try{var u=s.map(function(e){var o=Object.assign({},e);return delete o.body,o});sessionStorage.setItem(l,JSON.stringify({updatedOn:i,posts:u}))}catch(g){}L(),b(t)}}).catch(function(){t.innerHTML="<p style=\"padding:60px 0;text-align:center;font:300 15px/1.65 'DM Sans',sans-serif;color:#6E6E6E\">Unable to load posts — check the blog URL in your config.</p>"})}function f(e){var o=document.createElement("textarea");return o.innerHTML=e,o.value}function p(e){var o={},r={},t={},s={};function i(e,o){var r=Object.keys(e);if(o&&o.length){var t=o.map(function(e){return e.toLowerCase().trim()});r.sort(function(e,o){var r=t.indexOf(e.toLowerCase().trim()),a=t.indexOf(o.toLowerCase().trim());return -1!==r&&-1!==a?r-a:-1!==r?-1:-1!==a?1:e.localeCompare(o)})}else r.sort();return r.map(function(o){return{value:o,count:e[o]}})}return e.forEach(function(e){e.categories.forEach(function(e){o[e]=(o[e]||0)+1}),e.tags.forEach(function(e){r[e]=(r[e]||0)+1}),e.author&&(t[e.author]=(t[e.author]||0)+1),e.year&&(s[e.year]=(s[e.year]||0)+1)}),{categories:i(o,a.customCategories),tags:i(r,a.customTags),authors:i(t,[]),years:Object.keys(s).sort().reverse().map(function(e){return{value:e,count:s[e]}})}}function b(r){r.innerHTML="",r.setAttribute("data-layout",c.layout),r.style.setProperty("--sqpsblog-grid-cols",a.gridColumns),r.style.setProperty("--sqpsblog-news-cols",a.newsroomColumns),r.style.setProperty("--sqpsblog-overlay-hi",(a.imageOverlayOpacity/100).toFixed(2)),r.style.setProperty("--sqpsblog-overlay-lo",(a.imageOverlayOpacity/100*.35).toFixed(2)),r.style.setProperty("--sqpsblog-card-gap",a.cardGap+"px"),r.style.setProperty("--sqpsblog-hero-h",a.heroHeight+"px"),r.style.setProperty("--sqpsblog-split-h",a.splitHeight+"px"),r.style.setProperty("--sqpsblog-card-h",a.cardHeight+"px"),r.style.setProperty("--sqpsblog-img-h",a.cardImageHeight+"px");var t=String(a.splitRatio).split("/"),i=(t[0]||"60")+"fr "+(t[1]||"40")+"fr";r.style.setProperty("--sqpsblog-split-cols",i),r.style.setProperty("--sqpsblog-excerpt-lines",a.excerptLines),r.style.setProperty("--sqpsblog-hover-scale",a.hoverZoom),r.setAttribute("data-hover-zoom",1!==a.hoverZoom?"1":"0"),r.style.setProperty("--sqpsblog-card-border-w",a.cardBorderWidth+"px"),r.style.setProperty("--sqpsblog-card-border-c",a.cardBorderColor),function r(t,i){if(t.appendChild(function o(r){var t=M("div",e+"-mobile-filter-wrap"),i=document.createElement("a");i.className=e+"-mobile-filter-btn "+E,i.setAttribute("role","button"),i.setAttribute("tabindex","0"),i.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;display:block;"><path fill-opacity="0" d="M0 0h24v24H0V0Z"/><path d="M11 18h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1ZM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1Zm4 6h10c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1Z"/></svg><span>'+_(a.mobileFilterLabel||"Filter")+"</span>",i.style.cssText="display:inline-flex;align-items:center;gap:8px;";var d=M("div",e+"-mobile-filter-panel");a.showSearch&&d.appendChild(u(r));var n=p(s),l={categories:{key:"categories",label:a.labelAllCategories,items:n.categories},tags:{key:"tags",label:a.labelAllTags,items:n.tags},authors:{key:"authors",label:a.labelAllAuthors,items:n.authors},years:{key:"years",label:a.labelAllYears,items:n.years}};a.filterBy.forEach(function(o){var t=l[o];t&&t.items.length&&d.appendChild(function o(r,t){var s=M("div",e+"-mob-acc");s.setAttribute("data-key",r.key),s.setAttribute("data-default",r.label);var i=M("div",e+"-mob-acc-header"),d=M("span",e+"-mob-acc-lbl");d.textContent=r.label;var n=M("span",e+"-mob-acc-chev");n.innerHTML='<svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',i.appendChild(d),i.appendChild(n);var l=M("div",e+"-mob-acc-opts");r.items.forEach(function(o){var s="object"==typeof o?o.value:o,i="object"==typeof o?o.count:null,n=M("label",e+"-mob-acc-row"),m=document.createElement("input");m.type="checkbox",m.value=s,m.className=e+"-mob-acc-cb",c[r.key].has(s)&&(m.checked=!0),m.addEventListener("change",function(){this.checked?c[r.key].add(s):c[r.key].delete(s);var o=c[r.key].size;d.textContent=0===o?r.label:o+" "+a.labelSelected,t.querySelectorAll("."+e+'-custom-dd[data-key="'+r.key+'"]').forEach(function(t){var i=t.querySelector("."+e+'-dd-option input[value="'+s+'"]');i&&(i.checked=o>0&&c[r.key].has(s));var d=t.querySelector("."+e+"-dd-label"),n=t.getAttribute("data-default");d&&(d.textContent=0===o?n:o+" "+a.labelSelected)}),h(t),x(t),B(t),y(t),a.enableUrlParams&&z()});var f=M("span","");f.textContent=a.showFilterCounts&&null!==i?s+" ("+i+")":s,n.appendChild(m),n.appendChild(f),l.appendChild(n)});var m=c[r.key]?c[r.key].size:0;return m>0&&(d.textContent=m+" "+a.labelSelected),i.addEventListener("click",function(){s.classList.toggle("open"),n.style.transform=s.classList.contains("open")?"rotate(180deg)":""}),s.appendChild(i),s.appendChild(l),s}(t,r))}),a.showSort&&d.appendChild(g(r));var m=document.createElement("a");function f(){d.classList.toggle("open")}return m.className=e+"-mobile-show-btn "+E,m.setAttribute("role","button"),m.setAttribute("tabindex","0"),m.textContent="Show "+s.length+" results",m.style.cssText="display:inline-flex;width:auto;margin-top:16px;cursor:pointer;",m.addEventListener("click",function(){d.classList.remove("open")}),d.appendChild(m),i.addEventListener("click",f),i.addEventListener("keydown",function(e){("Enter"===e.key||" "===e.key)&&f()}),t.appendChild(i),t.appendChild(d),t}(t)),t.appendChild(function r(t,i){var d=M("div",e+"-filter-bar");if(d.setAttribute("role","search"),d.setAttribute("aria-label","Filter blog posts"),d.setAttribute("data-style",a.filterBarStyle),d.style.setProperty("--sqpsblog-search-min-w",a.searchMinWidth+"px"),a.showSearch){var n=M("div",e+"-filter-left");n.appendChild(u(i)),d.appendChild(n)}else d.setAttribute("data-no-search","1");var l,m,f,b,h=M("div",e+"-filter-right"),$=p(s),_={categories:{key:"categories",label:a.labelAllCategories,items:$.categories},tags:{key:"tags",label:a.labelAllTags,items:$.tags},authors:{key:"authors",label:a.labelAllAuthors,items:$.authors},years:{key:"years",label:a.labelAllYears,items:$.years}};a.filterBy.forEach(function(o){var r,t,s,d,n,l,m,f,p,b,u=_[o];u&&u.items.length&&h.appendChild((r=u,t=i,s=document.createElement("div"),s.className=e+"-custom-dd",s.setAttribute("data-key",r.key),s.setAttribute("data-default",r.label),d=document.createElement("div"),d.className=e+"-dd-header",d.setAttribute("type","button"),d.setAttribute("aria-haspopup","listbox"),d.setAttribute("aria-expanded","false"),d.setAttribute("aria-label",r.label),n=document.createElement("span"),n.className=e+"-dd-label",n.textContent=r.label,l=document.createElement("span"),l.className=e+"-dd-chevron",l.innerHTML='<svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',d.appendChild(n),d.appendChild(l),d.addEventListener("click",function(o){o.stopPropagation();var r=s.classList.contains("open");t.querySelectorAll("."+e+"-custom-dd.open").forEach(function(o){o.classList.remove("open");var r=o.querySelector("."+e+"-dd-header");r&&r.setAttribute("aria-expanded","false")}),r||(s.classList.add("open"),d.setAttribute("aria-expanded","true"))}),s.appendChild(d),m=document.createElement("div"),m.className=e+"-dd-backdrop",m.addEventListener("click",function(){s.classList.remove("open")}),s.appendChild(m),f=document.createElement("div"),f.className=e+"-dd-panel",f.addEventListener("click",function(e){e.stopPropagation()}),p=document.createElement("div"),p.className=e+"-dd-options",r.items.forEach(function(o){var s="object"==typeof o?o.value:o,i="object"==typeof o?o.count:null,d=document.createElement("label");d.className=e+"-dd-option";var l=document.createElement("input");l.type="checkbox",l.value=s,c[r.key].has(s)&&(l.checked=!0),l.addEventListener("change",function(){this.checked?c[r.key].add(s):c[r.key].delete(s);var o=c[r.key].size;n.textContent=0===o?r.label:o+" selected",t.querySelectorAll("."+e+'-mob-acc[data-key="'+r.key+'"]').forEach(function(t){var i=t.querySelector("."+e+'-mob-acc-cb[value="'+s+'"]');i&&(i.checked=o>0&&c[r.key].has(s));var d=t.querySelector("."+e+"-mob-acc-lbl"),n=t.getAttribute("data-default");d&&(d.textContent=0===o?n:o+" "+a.labelSelected)}),x(t),B(t),y(t),a.enableUrlParams&&z()});var m=document.createElement("span");m.textContent=a.showFilterCounts&&null!==i?s+" ("+i+")":s,d.appendChild(l),d.appendChild(m),p.appendChild(d)}),b=c[r.key]?c[r.key].size:0,b>0&&(n.textContent=b+" "+a.labelSelected),f.appendChild(p),s.appendChild(f),s))}),a.showSort&&h.appendChild(g(i)),a.showLayoutToggle&&h.appendChild((l=i,m=M("div",e+"-layout-wrap"),["grid","newsroom","mosaic"].forEach(function(r){var t,i=document.createElement("button");i.className=e+"-layout-btn"+(c.layout===r?" active":""),i.setAttribute("data-layout",r),i.setAttribute("aria-label",r.charAt(0).toUpperCase()+r.slice(1)+" layout"),i.innerHTML=(t=r,"grid"===t?'<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>':"newsroom"===t?'<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="8" rx="1.5" fill="currentColor"/><rect x="1" y="11" width="6" height="4" rx="1" fill="currentColor"/><rect x="9" y="11" width="6" height="4" rx="1" fill="currentColor"/></svg>':"mosaic"===t?'<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="9" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="4" rx="1.5" fill="currentColor"/><rect x="9" y="7" width="6" height="8" rx="1.5" fill="currentColor"/><rect x="1" y="12" width="6" height="3" rx="1" fill="currentColor"/></svg>':""),i.title=r.charAt(0).toUpperCase()+r.slice(1),i.addEventListener("click",function(){if(c.layout=r,localStorage.setItem(o,r),l.setAttribute("data-layout",r),l.querySelectorAll("."+e+"-layout-btn").forEach(function(e){e.classList.toggle("active",e.getAttribute("data-layout")===r)}),a.showHero&&"newsroom"!==r){var t=l.querySelector("."+e+"-hero-slot");if(!t&&s.length>0){t=M("div",e+"-hero-slot");var i=v(s[0],"hero");i.classList.add("visible"),t.appendChild(i);var d=l.querySelector("."+e+"-grid");d?l.insertBefore(t,d):l.appendChild(t)}t&&(t.style.display="")}else{var t=l.querySelector("."+e+"-hero-slot");t&&(t.style.display="none")}y(l)}),m.appendChild(i)}),m)),h.appendChild((f=i,b=document.createElement("button"),b.className=e+"-clear",b.textContent=a.resetText,b.style.opacity="0.35",b.style.pointerEvents="none",b.addEventListener("click",function(){c.categories.clear(),c.tags.clear(),c.authors.clear(),c.years.clear(),c.search="",f.querySelectorAll("."+e+"-search").forEach(function(e){e.value=""}),f.querySelectorAll("."+e+"-search-clear").forEach(function(e){e.style.display="none"}),f.querySelectorAll("."+e+'-dd-option input[type="checkbox"]').forEach(function(e){e.checked=!1}),f.querySelectorAll("."+e+"-custom-dd").forEach(function(o){var r=o.querySelector("."+e+"-dd-label");r&&(r.textContent=o.getAttribute("data-default"))}),f.querySelectorAll("."+e+"-mob-acc").forEach(function(o){var r=o.querySelector("."+e+"-mob-acc-lbl");r&&(r.textContent=o.getAttribute("data-default")),o.classList.remove("open");var t=o.querySelector("."+e+"-mob-acc-chev");t&&(t.style.transform=""),o.querySelectorAll("."+e+"-mob-acc-cb").forEach(function(e){e.checked=!1})}),x(f),y(f)}),b)),d.appendChild(h);var q=M("div",e+"-bar-wrap");return q.setAttribute("data-align",a.filterBarAlign),q.appendChild(d),q}(i,t)),a.showPostCount){var d=M("div",e+"-post-count");d.style.cssText="font-size:13px !important;margin:10px 0 !important;color:var(--paragraphSmallColor,#999);letter-spacing:0.03em;font-family:inherit;line-height:1.4;",t.appendChild(d)}if(a.showActiveFilters&&t.appendChild(M("div",e+"-chips")),a.showHero&&"newsroom"!==c.layout&&s.length>0){var n=M("div",e+"-hero-slot"),l=v(s[0],"hero");l.classList.add("visible"),n.appendChild(l),t.appendChild(n)}t.appendChild(M("div",e+"-grid"));var m=M("div",e+"-no-results");m.textContent=a.noResultsText,m.style.display="none",t.appendChild(m),y(t)}(r,p(s)),function o(r){(r.ownerDocument||document).addEventListener("click",function(o){r.querySelectorAll("."+e+"-custom-dd.open").forEach(function(o){o.classList.remove("open");var r=o.querySelector("."+e+"-dd-header");r&&r.setAttribute("aria-expanded","false")})})}(r),!a.cardUseThemeBg&&a.cardBg?r.style.setProperty("--sqpsblog-card-bg",a.cardBg):r.style.setProperty("--sqpsblog-card-bg","var(--siteBackgroundColor, #fff)")}function h(o){var r=o.querySelector("."+e+"-mobile-show-btn");r&&(r.textContent="Show "+i.length+" results")}function u(o){var r,t=M("div",e+"-search-wrap"),s=document.createElement("input");s.type="text",s.className=e+"-search",s.placeholder=a.searchPlaceholder,s.setAttribute("aria-label",a.searchPlaceholder||"Search posts");var i=document.createElement("button");return i.className=e+"-search-clear",i.innerHTML='<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',i.setAttribute("aria-label","Clear search"),i.style.display="none",i.addEventListener("click",function(){s.value="",c.search="",i.style.display="none",y(o),a.enableUrlParams&&z(),s.focus()}),s.addEventListener("input",function(){var e=this.value;i.style.display=e?"flex":"none",clearTimeout(r),r=setTimeout(function(){c.search=e.toLowerCase().trim(),y(o),a.enableUrlParams&&z()},250)}),t.appendChild(s),t.appendChild(i),t}function g(o){var r=document.createElement("select");return r.className=e+"-sort",r.setAttribute("aria-label","Sort posts"),[{v:"newest",l:a.labelSortNewest},{v:"oldest",l:a.labelSortOldest},{v:"readtime",l:a.labelSortReadTime}].forEach(function(e){var o=document.createElement("option");o.value=e.v,o.textContent=e.l,r.appendChild(o)}),r.addEventListener("change",function(){c.sort=this.value,y(o),a.enableUrlParams&&z()}),r}function x(o){var r=c.categories.size||c.tags.size||c.authors.size||c.years.size||c.search,t=o.querySelector("."+e+"-clear");t&&(t.style.opacity=r?"1":"0.35",t.style.pointerEvents=r?"":"none")}function y(o){var r,t,l,m=s.slice(),f=c.categories.size||c.tags.size||c.authors.size||c.years.size;if((m=m.filter(function(e){if(c.search){var o;if(!c.search.split(",").map(function(e){return e.trim()}).filter(Boolean)["and"===a.filterLogic?"every":"some"](function(o){var r=RegExp("\\b"+o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");return r.test(e.title)||r.test(e.excerpt)||a.searchBody&&r.test(e.body)}))return!1}return!f||("and"===a.filterLogic?(!c.categories.size||!!e.categories.some(function(e){return c.categories.has(e)}))&&(!c.tags.size||!!e.tags.some(function(e){return c.tags.has(e)}))&&(!c.authors.size||!!c.authors.has(e.author))&&(!c.years.size||!!c.years.has(e.year)):!!(c.categories.size&&e.categories.some(function(e){return c.categories.has(e)})||c.tags.size&&e.tags.some(function(e){return c.tags.has(e)})||c.authors.size&&c.authors.has(e.author)||c.years.size&&c.years.has(e.year)))})).sort(function(e,o){return"oldest"===c.sort?e.publishOn-o.publishOn:"readtime"===c.sort?e.readTime-o.readTime:o.publishOn-e.publishOn}),i=m,a.showPostCount){var p=o.querySelector("."+e+"-post-count");if(p){var b=s.length;p.textContent=i.length<b?a.labelShowing+" "+i.length+" "+a.labelOf+" "+b+" "+a.labelPostPlural:b+" "+(1!==b?a.labelPostPlural:a.labelPostSingular)}}h(o);var u=window.innerWidth<=900;a.showHero&&"newsroom"!==c.layout&&!u&&(i=i.filter(function(e){return e.fullUrl!==s[0].fullUrl})),a.showActiveFilters&&B(o);var g=o.querySelector("."+e+"-mobile-filter-btn");if(g){var x=c.categories.size+c.tags.size+c.authors.size+c.years.size+(c.search?1:0),y=a.mobileFilterLabel||"Filter",$=g.querySelector("span");$&&($.textContent=x>0?y+" \xb7 "+x:y)}a.enableUrlParams&&z(),t=(r=o).querySelector("."+e+"-grid"),l=r.querySelector("."+e+"-no-results"),t&&(n&&(n.disconnect(),n=null),t.querySelectorAll("."+e+"-card").forEach(function(e){e.classList.remove("visible")}),setTimeout(function(){t.innerHTML="",d=0;var o=r.querySelector("."+e+"-hero-slot");if(!i.length){l&&(l.style.display="block"),o&&(o.style.display="none");return}l&&(l.style.display="none"),o&&(o.style.display=a.showHero&&"newsroom"!==c.layout?"":"none"),function o(r,t){var s=t.querySelector("."+e+"-load-more");s&&s.remove();var l=d,m=i.slice(l,l+a.batchSize);m.forEach(function(e){r.appendChild(v(e,c.layout))}),d=l+m.length;var f=r.querySelectorAll("."+e+"-card:not(.visible)"),p=new IntersectionObserver(function(e){e.forEach(function(e){e.isIntersecting&&(e.target.classList.add("visible"),p.unobserve(e.target))})},{threshold:.04,rootMargin:"200px 0px 200px 0px"});if(f.forEach(function(e){p.observe(e)}),n=p,d<i.length){if("button"===a.loadMoreMode){var b=M("button",e+"-load-more");b.textContent=a.loadMoreText||"Load more",b.addEventListener("click",function(){b.disabled=!0,b.innerHTML="";var s=M("div",e+"-load-more-spinner");try{s.animate([{transform:"rotate(0deg)"},{transform:"rotate(360deg)"}],{duration:700,iterations:1/0,easing:"linear"})}catch(i){}var d=document.createElement("span");d.textContent=a.loadingText||"Loading posts\u2026",b.appendChild(s),b.appendChild(d),setTimeout(function(){b.remove(),o(r,t)},120)}),t.appendChild(b)}else{var h=M("div",e+"-sentinel");r.appendChild(h);var u=new IntersectionObserver(function(e){e[0].isIntersecting&&(u.disconnect(),h.remove(),o(r,t))},{rootMargin:"0px 0px 600px 0px"});u.observe(h)}}}(t,r)},t.children.length?180:0))}function $(o){var r=M("div",e+"-loading"),t=M("div",e+"-spinner");r.appendChild(t);var s=M("p",e+"-loading-text");s.textContent=a.loadingText||"Loading posts\u2026",r.appendChild(s),o.innerHTML="",o.appendChild(r)}function v(o,r){var t=document.createElement("a");if(t.href=o.linkUrl||o.fullUrl,t.setAttribute("aria-label",o.title),t.className=e+"-card "+e+"-card-"+r,t.setAttribute("data-categories",o.categories.join(",")),t.setAttribute("data-tags",o.tags.join(",")),t.setAttribute("data-author",o.author),t.setAttribute("data-year",o.year),"mosaic"===r){o.thumbnail?t.style.backgroundImage="url("+q(o.thumbnail)+")":t.style.background="#1a1a1a";var s=a.showCategory?P(o.categories,e,"mosaic"):"";return t.innerHTML=s+'<div class="'+e+'-mosaic-overlay"></div><div class="'+e+'-mosaic-body"><h2 class="'+e+'-card-title">'+_(o.title)+"</h2>"+(a.showReadTime?'<p class="'+e+'-card-read">'+o.readTime+" min\xa0read</p>":"")+(false===a.showCta?"":a.ctaText?'<span class="'+e+"-mosaic-pill"+(a.ctaFollowSiteStyle?" "+e+"-mosaic-pill--styled":"")+'">'+_(a.ctaText)+"</span>":"")+"</div>",t}var i=a.showCategory?P(o.categories,e,""):"",d=o.thumbnail?'<div class="'+e+'-card-img"><img src="'+q(o.thumbnail)+'" alt="'+q(o.title)+'" loading="lazy">'+i+"</div>":'<div class="'+e+"-card-img "+e+'-card-img-empty">'+i+"</div>",n='<div class="'+e+'-card-meta">'+(a.showReadTime?'<span class="'+e+'-card-read">'+o.readTime+" min read</span>":"")+"</div>",l=a.showAuthor&&o.author||a.showDate?'<div class="'+e+'-card-footer">'+(a.showAuthor&&o.author?'<span class="'+e+'-card-author">'+_(o.author)+"</span>":"<span></span>")+(a.showDate?'<span class="'+e+'-card-date">'+function e(o){if(!o)return"";var r=new Date(o),t=a.dateDisplayFormat||"LL",s=a.dateDisplayCustomFormat||"",i="DMY"===(a.dateOrder||"MDY"),d=["January","February","March","April","May","June","July","August","September","October","November","December"],n=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],l=r.getDate(),c=r.getMonth(),m=r.getFullYear(),f=r.getDay();if("L"===t){var p=String(c+1).padStart(2,"0"),b=String(l).padStart(2,"0");return i?b+"/"+p+"/"+m:p+"/"+b+"/"+m}if("LL"===t)return i?l+" "+d[c]+" "+m:d[c]+" "+l+", "+m;if("LLLL"===t)return i?n[f]+", "+l+" "+d[c]+" "+m:n[f]+", "+d[c]+" "+l+", "+m;if("custom"!==t||!s)return i?l+" "+d[c]+" "+m:d[c]+" "+l+", "+m;var h=s;return(h=(h=(h=h.replace(/MMMM/g,d[c]).replace(/MMM/g,["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][c]).replace(/MM/g,String(c+1).padStart(2,"0")).replace(/\bM\b/g,String(c+1))).replace(/YYYY/g,String(m)).replace(/YY/g,String(m).slice(-2))).replace(/dddd/g,n[f]).replace(/ddd/g,["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][f]).replace(/dd/g,["Su","Mo","Tu","We","Th","Fr","Sa"][f])).replace(/DD/g,String(l).padStart(2,"0")).replace(/\bD\b/g,String(l))}(o.publishOn)+"</span>":"")+"</div>":"";return t.innerHTML=d+'<div class="'+e+'-card-body">'+n+'<h2 class="'+e+'-card-title">'+_(o.title)+"</h2>"+(a.showExcerpt&&o.excerpt?'<p class="'+e+'-card-excerpt">'+_(o.excerpt)+"</p>":"")+'<div class="'+e+'-card-bottom">'+(false===a.showCta?"":a.ctaText?'<span class="'+e+"-card-cta"+(a.ctaFollowSiteStyle?" "+e+"-card-cta--styled":"")+'">'+_(a.ctaText)+"</span>":"")+l+"</div></div>",t}function P(cats,e,mod){if(!cats||!cats.length)return"";var max=a.categoryPillCount;var limit="all"===max?cats.length:"number"==typeof max?max:1;var cls=mod?e+"-card-cat-pill "+e+"-card-cat-pill--"+mod:e+"-card-cat-pill";return cats.slice(0,limit).map(function(c){return'<span class="'+cls+'">'+_(c)+"</span>"}).join("")}function _(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function q(e){return String(e).replace(/"/g,"&quot;")}var w="#000000",k="#ffffff",C="99px",S="12px",A="99px",E="";function z(){var e=new URLSearchParams;c.search&&e.set("search",c.search),c.categories.size&&c.categories.forEach(function(o){e.append("category",o)}),c.tags.size&&c.tags.forEach(function(o){e.append("tag",o)}),c.authors.size&&c.authors.forEach(function(o){e.append("author",o)}),c.years.size&&c.years.forEach(function(o){e.append("year",o)}),"newest"!==c.sort&&e.set("sort",c.sort);var o=e.toString();history.replaceState(null,"",o?a.blogUrl+"?"+o:a.blogUrl)}function L(){var e=window.location.search||sessionStorage.getItem("sqpsblog-qs")||"";if(e){var o=new URLSearchParams(e);o.getAll("category").forEach(function(e){c.categories.add(e)}),o.getAll("tag").forEach(function(e){c.tags.add(e)}),o.getAll("author").forEach(function(e){c.authors.add(e)}),o.getAll("year").forEach(function(e){c.years.add(e)});var r=o.get("search");r&&(c.search=r.toLowerCase().trim());var t=o.get("sort");t&&(c.sort=t)}}function B(o){var r=o.querySelector("."+e+"-chips");if(r){r.innerHTML="";var t=!1;c.categories.forEach(function(e){s(e,"categories",e)}),c.tags.forEach(function(e){s(e,"tags",e)}),c.authors.forEach(function(e){s(e,"authors",e)}),c.years.forEach(function(e){s(e,"years",e)}),c.search&&c.search.split(",").map(function(e){return e.trim()}).filter(Boolean).forEach(function(e){s('"'+e+'"',"search",e)}),r.style.display=t?"flex":"none"}function s(s,i,d){t=!0;var n=document.createElement("span");n.className=e+"-chip",n.textContent=s;var l=document.createElement("button");l.className=e+"-chip-x",l.textContent="\xd7",l.setAttribute("aria-label","Remove "+s),l.addEventListener("click",function(){if("search"===i){var r=c.search.split(",").map(function(e){return e.trim()}).filter(Boolean);r=r.filter(function(e){return e!==d}),c.search=r.join(", "),o.querySelectorAll("."+e+"-search").forEach(function(e){e.value=c.search})}else c[i].delete(d),o.querySelectorAll("."+e+'-dd-option input[value="'+d+'"]').forEach(function(e){e.checked=!1}),o.querySelectorAll("."+e+"-custom-dd").forEach(function(o){if(o.getAttribute("data-key")===i){var r=o.querySelector("."+e+"-dd-label"),t=c[i].size;r&&(r.textContent=0===t?o.getAttribute("data-default"):t+" "+a.labelSelected)}}),o.querySelectorAll("."+e+"-mob-acc").forEach(function(o){if(o.getAttribute("data-key")===i){o.querySelectorAll("."+e+'-mob-acc-cb[value="'+d+'"]').forEach(function(e){e.checked=!1});var r=o.querySelector("."+e+"-mob-acc-lbl"),t=c[i].size,s=o.getAttribute("data-default");if(r&&(r.textContent=0===t?s:t+" "+a.labelSelected),0===t){o.classList.remove("open");var n=o.querySelector("."+e+"-mob-acc-chev");n&&(n.style.transform="")}}});x(o),y(o),a.enableUrlParams&&z()}),n.appendChild(l),r.appendChild(n)}}function M(e,o){var r=document.createElement(e);return o&&(r.className=o),r}var T=`
    /* ─── SQPSBLOG Blog Filter ─────────────────────────────────────────── */
    #sqpsblog, [id^="sqpsblog"] {
      --sqpsblog-btn-radius: 99px;
      box-sizing: border-box;
      touch-action: pan-y;
      width: calc(100% - 2 * var(--sqs-site-gutter, 4vw));
      max-width: var(--sqs-site-max-width, 1500px);
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 767px) {
      #sqpsblog, [id^="sqpsblog"] {
        width: calc(100% - 2 * var(--sqs-mobile-site-gutter, 6vw));
      }
    }

    /* ── Loading ─────────────────────────────────────────────────────── */
    .sqpsblog-loading {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 80px 0; gap: 20px;
    }
    .sqpsblog-spinner {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      border: 3px solid rgba(128,128,128,0.2);
      border-top-color: var(--primaryButtonBackgroundColor, #000);
      animation: sqpsblog-spin .75s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
      will-change: transform;
    }
    @keyframes sqpsblog-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .sqpsblog-loading-text {
      font-size: 14px; font-family: inherit; font-weight: 300;
      color: var(--paragraphSmallColor, #999); text-align: center; letter-spacing: .03em;
    }

    /* ── Filter bar ──────────────────────────────────────────────────── */
    .sqpsblog-filter-bar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
      padding: 10px 14px; margin-bottom: 24px; width: 100%; box-sizing: border-box;
      border: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5);
      border-radius: var(--sqpsblog-btn-radius);
      background: var(--siteBackgroundColor, #fff);
      touch-action: pan-y;
    }
    .sqpsblog-filter-right { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; flex-shrink: 0; touch-action: pan-y; }
    .sqpsblog-filter-left  { display: flex; align-items: center; flex: 1 1 0; min-width: 0; overflow: hidden; touch-action: pan-y; }
    .sqpsblog-filter-right .sqpsblog-custom-dd { min-width: 0; }
    .sqpsblog-filter-right .sqpsblog-dd-header { min-width: 0; }
    .sqpsblog-filter-right .sqpsblog-dd-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Search */
    .sqpsblog-search-wrap {
      flex: 1 1 0; min-width: 0; display: flex; align-items: center; gap: 6px;
      border: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5);
      border-radius: var(--sqpsblog-btn-radius);
      padding: 7px 12px; background: var(--siteBackgroundColor, #fff);
      transition: border-color .15s;
    }
    .sqpsblog-search-wrap:focus-within { border-color: var(--primaryButtonBackgroundColor, #111); }
    .sqpsblog-search {
      flex: 1; border: none; background: transparent; outline: none;
      font-size: 13px; font-family: inherit; color: inherit; padding: 0; min-width: 0;
    }
    .sqpsblog-search { outline: none; }
    .sqpsblog-search::placeholder { color: var(--tweak-form-block-field-border-color, #bbb); }
    .sqpsblog-search-clear {
      display: none; align-items: center; justify-content: center;
      background: none; border: none; cursor: pointer; padding: 2px;
      color: var(--tweak-form-block-field-border-color, #bbb); flex-shrink: 0; transition: color .15s;
    }
    .sqpsblog-search-clear:hover { color: var(--headingMediumColor, #333); }

    /* Custom dropdowns */
    .sqpsblog-custom-dd { position: relative; font-size: 13px; font-family: inherit; min-width: 120px; }
    .sqpsblog-dd-header {
      display: flex; justify-content: space-between; align-items: center;
      border: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5);
      border-radius: var(--sqpsblog-btn-radius);
      padding: 7px 12px; cursor: pointer; user-select: none;
      background: var(--siteBackgroundColor, #fff); transition: border-color .15s; gap: 8px; white-space: nowrap;
      touch-action: pan-y;
    }
    .sqpsblog-dd-header:hover { border-color: var(--primaryButtonBackgroundColor, #aaa); }
    .sqpsblog-custom-dd.open .sqpsblog-dd-header { border-color: var(--primaryButtonBackgroundColor, #111); }
    .sqpsblog-dd-label { font-family: inherit; }
    .sqpsblog-dd-chevron { display: flex; align-items: center; opacity: .5; transition: transform .2s; flex-shrink: 0; }
    .sqpsblog-custom-dd.open .sqpsblog-dd-chevron { transform: rotate(180deg); }
    .sqpsblog-dd-panel {
      position: absolute; top: calc(100% + 6px); right: 0;
      min-width: 180px; background: var(--siteBackgroundColor, #fff);
      border: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5);
      border-radius: min(var(--sqpsblog-btn-radius), 16px);
      box-shadow: 0 8px 24px rgba(0,0,0,.1);
      display: none; z-index: 200; overflow: hidden; padding: 4px 0;
    }
    .sqpsblog-custom-dd.open .sqpsblog-dd-panel { display: block; }
    .sqpsblog-dd-options { max-height: 240px; overflow-y: auto; }
    .sqpsblog-dd-option {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 14px; cursor: pointer; font-size: 13px; font-family: inherit;
      color: var(--tweak-form-block-field-input-color, #000); transition: background .1s;
    }
    .sqpsblog-dd-option:hover { background: var(--tweak-form-block-field-fill-color, rgba(0,0,0,.04)); }
    .sqpsblog-dd-option input[type="checkbox"] {
      width: 15px; height: 15px; flex-shrink: 0; cursor: pointer;
      accent-color: var(--primaryButtonBackgroundColor, #111);
    }
    .sqpsblog-dd-option span { font-family: inherit; white-space: nowrap; }

    /* Sort */
    .sqpsblog-sort {
      border: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5);
      border-radius: var(--sqpsblog-btn-radius);
      padding: 7px 32px 7px 12px; font-size: 13px; font-family: inherit;
      line-height: 24px; height: 40px; box-sizing: border-box;
      background: var(--siteBackgroundColor, #fff) url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center;
      color: var(--tweak-form-block-field-input-color, #000); outline: none; appearance: none; -webkit-appearance: none;
      cursor: pointer; transition: border-color .15s; white-space: nowrap;
    }
    .sqpsblog-sort:hover { border-color: var(--primaryButtonBackgroundColor, #aaa); }

    /* Layout toggle */
    .sqpsblog-layout-wrap {
      display: flex; align-items: center; gap: 2px; flex-shrink: 0;
      border: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5);
      border-radius: var(--sqpsblog-btn-radius);
      padding: 4px; background: var(--siteBackgroundColor, #fff);
      height: 40px; box-sizing: border-box;
    }
    .sqpsblog-layout-btn {
      background: none; border: none; cursor: pointer; padding: 4px 8px;
      border-radius: calc(var(--sqpsblog-btn-radius) - 4px);
      color: var(--tweak-form-block-field-border-color, #ccc);
      transition: all .15s; display: flex; align-items: center;
    }
    .sqpsblog-layout-btn.active { background: var(--primaryButtonBackgroundColor, #111); color: var(--primaryButtonTextColor, #fff); }
    .sqpsblog-layout-btn:hover:not(.active) { color: var(--paragraphMediumColor, #666); }

    /* Reset */
    .sqpsblog-clear {
      background: transparent; border: none; padding: 7px 8px;
      font-size: 13px; font-family: inherit; color: var(--paragraphSmallColor, #666);
      cursor: pointer; transition: color .15s; white-space: nowrap; flex-shrink: 0;
    }
    .sqpsblog-clear:hover { color: var(--headingMediumColor, #111); text-decoration: underline; }

    /* Bar alignment */
    .sqpsblog-bar-wrap { display: flex; width: 100%; margin-bottom: 0; }
    .sqpsblog-bar-wrap[data-align="left"]   { justify-content: flex-start; }
    .sqpsblog-bar-wrap[data-align="center"] { justify-content: center; }
    .sqpsblog-bar-wrap[data-align="right"]  { justify-content: flex-end; }
    .sqpsblog-bar-wrap[data-align="full"]   { justify-content: stretch; }
    .sqpsblog-bar-wrap:not([data-align="full"]) .sqpsblog-filter-bar { width: auto; max-width: 100%; display: inline-flex; margin-bottom: 24px; }
    .sqpsblog-bar-wrap[data-align="full"] .sqpsblog-filter-bar { width: 100%; }
    .sqpsblog-bar-wrap:not([data-align="full"]) .sqpsblog-filter-left { flex: 0 0 auto; min-width: var(--sqpsblog-search-min-w, 180px); }
    .sqpsblog-bar-wrap:not([data-align="full"]) .sqpsblog-filter-right { flex: 0 0 auto; }
    .sqpsblog-bar-wrap[data-align="full"] .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-left { flex: 1 1 0; max-width: none; }
    .sqpsblog-bar-wrap[data-align="full"] .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-right { flex: 0 0 auto; }

    /* Option2 unified bar */
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-right > :first-child .sqpsblog-dd-header,
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-right > :first-child.sqpsblog-sort,
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-right > :first-child.sqpsblog-layout-wrap,
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-right > :first-child.sqpsblog-clear { border-left: none; }
    .sqpsblog-filter-bar[data-style="option2"] { gap: 0; padding: 0; overflow: visible; flex-wrap: nowrap; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-left { padding: 0 14px; border-right: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5); height: 44px; align-items: center; min-width: 140px; max-width: 260px; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-search-wrap { border: none; border-radius: 0; padding: 0; background: transparent; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-search-wrap:focus-within { border: none; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-right { gap: 0; height: 44px; align-items: center; flex: 1; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-dd-header { border: none; border-radius: 0; border-left: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5); height: 44px; background: transparent; padding: 0 14px; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-dd-header:hover { border-left-color: var(--tweak-form-block-field-border-color, #e5e5e5); background: transparent; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-custom-dd.open .sqpsblog-dd-header { border-left-color: var(--tweak-form-block-field-border-color, #e5e5e5); background: transparent; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-sort { border: none; border-left: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5); border-radius: 0; height: 44px; padding: 0 32px 0 14px; background-color: transparent; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-sort:hover { border-left-color: var(--tweak-form-block-field-border-color, #e5e5e5); background-color: transparent; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-layout-wrap { border: none; border-left: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5); border-radius: 0; height: 44px; background: transparent; padding: 4px 10px; }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-filter-left { border-radius: var(--sqpsblog-btn-radius) 0 0 var(--sqpsblog-btn-radius); }
    .sqpsblog-filter-bar[data-style="option2"] .sqpsblog-clear { border-radius: 0 var(--sqpsblog-btn-radius) var(--sqpsblog-btn-radius) 0; }

    /* Post count + chips */
    .sqpsblog-post-count { font-size: 11px !important; font-family: inherit; color: var(--paragraphSmallColor, #999); margin: 10px 0 10px !important; letter-spacing: 0.03em; }
    .sqpsblog-chips { display: none; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
    .sqpsblog-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--tweak-form-block-field-fill-color, #f5f5f5); border: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5); border-radius: var(--sqpsblog-btn-radius); padding: 5px 10px 5px 12px; font-size: 13px; font-family: inherit; color: var(--paragraphMediumColor, #333); }
    .sqpsblog-chip-x { background: none; border: none; cursor: pointer; font-size: 16px; line-height: 1; color: var(--paragraphSmallColor, #999); padding: 0; display: flex; align-items: center; }
    .sqpsblog-chip-x:hover { color: var(--headingMediumColor, #111); }

    /* Load more */
    .sqpsblog-load-more { display: flex; align-items: center; justify-content: center; gap: 10px; width: auto; margin: 32px auto 0; padding: 8px 28px; font-size: 13px; font-family: inherit; font-weight: 500; background: rgba(128,128,128,.12); color: var(--sqpsblog-text-color, #111); border: 1px solid rgba(128,128,128,.25); border-radius: var(--sqpsblog-cta-radius, 99px); cursor: pointer; transition: opacity .15s; grid-column: 1 / -1; }
    .sqpsblog-load-more:hover { opacity: .75; }
    .sqpsblog-load-more:disabled { opacity: .5; cursor: default; }
    .sqpsblog-load-more-spinner { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; border: 2px solid rgba(128,128,128,.2); border-top-color: var(--sqpsblog-text-color, #111); animation: sqpsblog-spin .7s linear infinite; }

    /* No results */
    .sqpsblog-no-results { padding: 60px 0; text-align: center; font-family: inherit; font-size: 16px; color: var(--paragraphSmallColor, #888); }

    /* Focus rings */
    .sqpsblog-card:focus-visible, .sqpsblog-dd-header:focus-visible, .sqpsblog-sort:focus-visible { outline: 2px solid var(--primaryButtonBackgroundColor, #000); outline-offset: 2px; }

    /* Card internals */
    .sqpsblog-card-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .sqpsblog-card-cat  { font-size: 11px; font-family: inherit; text-transform: uppercase; letter-spacing: .1em; color: var(--paragraphSmallColor, #777); }
    .sqpsblog-card-cat-pill { position: absolute; top: 12px; right: 12px; z-index: 4; background: rgba(255,255,255,.92); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); color: #111; font-size: 11px; font-family: inherit; font-weight: 600; letter-spacing: .06em; padding: 4px 10px; border-radius: 99px; pointer-events: none; white-space: nowrap; line-height: 1.4; }
    .sqpsblog-card-cat-pill--mosaic { position: absolute; top: 12px; right: 12px; z-index: 4; background: rgba(0,0,0,.4); color: rgba(255,255,255,.95); font-size: 11px; font-family: inherit; font-weight: 600; letter-spacing: .06em; padding: 4px 10px; border-radius: 99px; pointer-events: none; white-space: nowrap; line-height: 1.4; }
    [data-layout="newsroom"] .sqpsblog-card-newsroom:nth-child(1) .sqpsblog-card-cat-pill,
    [data-layout="mosaic"]   .sqpsblog-card-cat-pill,
    .sqpsblog-card-hero      .sqpsblog-card-cat-pill { background: rgba(0,0,0,.45); color: rgba(255,255,255,.95); }
    .sqpsblog-card-read  { font-size: 13px; font-family: inherit; color: var(--paragraphSmallColor, #999); opacity: .7; }
    .sqpsblog-card-title { font-size: 17px; font-family: inherit; line-height: 1.3; letter-spacing: -.015em; margin: 0 0 10px; }
    .sqpsblog-card-excerpt { font-size: 14px; font-family: inherit; color: var(--paragraphMediumColor, #777); line-height: 1.65; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: var(--sqpsblog-excerpt-lines, 3); -webkit-box-orient: vertical; overflow: hidden; }
    .sqpsblog-card-cta { display: inline-block; align-self: flex-start; margin-top: 0; margin-bottom: 16px; font-size: 12px; font-weight: 500; font-family: inherit; padding: 5px 14px; border-radius: 99px; background: rgba(128,128,128,.12); border: 1px solid rgba(128,128,128,.25); color: var(--sqpsblog-text-color, #111); letter-spacing: 0.01em; transition: opacity .2s; }
    .sqpsblog-card-cta--styled { border-radius: var(--sqpsblog-cta-radius, 99px); }
    .sqpsblog-card:hover .sqpsblog-card-cta { opacity: 0.75; }
    .sqpsblog-card-bottom { margin-top: auto; display: flex; flex-direction: column; }
    .sqpsblog-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; padding-bottom: 20px; border-top: 1px solid var(--tweak-form-block-field-border-color, #e5e5e5); }
    .sqpsblog-card-author { font-size: 12px; font-family: inherit; color: var(--paragraphMediumColor, #555); }
    .sqpsblog-card-date   { font-size: 12px; font-family: inherit; color: var(--paragraphSmallColor, #999); }
    .sqpsblog-card-body { padding: 18px 22px 0; flex: 1; display: flex; flex-direction: column; }
    .sqpsblog-card-img-empty { background: var(--tweak-form-block-field-fill-color, #f5f5f5); }

    /* Overlay text colors */
    [data-layout="newsroom"] .sqpsblog-card-newsroom:nth-child(1) .sqpsblog-card-cat,
    [data-layout="newsroom"] .sqpsblog-card-newsroom:nth-child(1) .sqpsblog-card-read,
    [data-layout="newsroom"] .sqpsblog-card-newsroom:nth-child(1) .sqpsblog-card-author,
    [data-layout="newsroom"] .sqpsblog-card-newsroom:nth-child(1) .sqpsblog-card-date,
    [data-layout="mosaic"]   .sqpsblog-card-cat,
    [data-layout="mosaic"]   .sqpsblog-card-read,
    .sqpsblog-card-hero      .sqpsblog-card-cat,
    .sqpsblog-card-hero      .sqpsblog-card-read,
    .sqpsblog-card-hero      .sqpsblog-card-author,
    .sqpsblog-card-hero      .sqpsblog-card-date { color: rgba(255,255,255,.85) !important; }
    [data-layout="newsroom"] .sqpsblog-card-newsroom:nth-child(1) .sqpsblog-card-cta,
    [data-layout="mosaic"]   .sqpsblog-card-cta,
    .sqpsblog-card-hero      .sqpsblog-card-cta { background: rgba(255,255,255,.18) !important; border-color: rgba(255,255,255,.28) !important; color: rgba(255,255,255,.92) !important; }
    .sqpsblog-card-cat    { color: var(--paragraphSmallColor, #595959) !important; }
    .sqpsblog-card-read   { color: var(--paragraphSmallColor, #595959) !important; }
    .sqpsblog-card-date   { color: var(--paragraphSmallColor, #595959) !important; }
    .sqpsblog-card-author { color: var(--paragraphMediumColor, #595959) !important; }
    .sqpsblog-card-excerpt { color: var(--paragraphMediumColor, #444) !important; }

    /* Grid layout */
    [data-layout="grid"] .sqpsblog-grid { displ
