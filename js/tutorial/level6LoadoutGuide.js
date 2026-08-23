/*
 * Bandenkick Bubble Shooter – Level-6-Loadout-Einführung
 * ------------------------------------------------------
 * Komplett getrennt von der Spielengine.
 *
 * Ablauf:
 *  1) Vorschaukarte von Level 6 wird angezeigt und gesperrt.
 *  2) Pfeil/Highlight zeigt auf den ersten freigeschalteten Item-Button.
 *  3) Danach wird das Info-"i" erklärt.
 *  4) Danach wird die verfügbare Anzahl rechts erklärt (-1 pro Verwendung).
 *  5) Danach werden die vier leeren Loadout-Slots erklärt.
 *  6) Sperre fällt weg; Spieler muss den Ball Switch auswählen.
 *  7) Erst wenn der Ball Switch in einem Slot liegt, wird "Level starten" frei.
 */

const ROOT_ID = "bk-level6-loadout-guide";
const STYLE_ID = "bk-level6-loadout-guide-style";
const PROMPT_ID = "bk-level6-loadout-prompt";
const STORAGE_KEY = "bandenkick_level6_loadout_intro_v1";

const STEP_MS = 5200; // jeder Hinweis bleibt jetzt 5,2 s sichtbar (+1 Sekunde)
const TOTAL_STEPS = 4;

let active = false;
let gated = false;
let completed = false;
let stepTimer = null;
let currentStep = 0;
let startButton = null;
let resizeHandler = null;

function $(selector) {
  return document.querySelector(selector);
}

function addStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${ROOT_ID} {
      position: fixed;
      inset: 0;
      z-index: 26000;
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      pointer-events: all;
      touch-action: none;
      user-select: none;
      opacity: 0;
      animation: bkL6FadeIn .24s ease forwards;
      font-family: Arial, Helvetica, sans-serif;
    }

    #${ROOT_ID} .bk-l6-focus {
      position: fixed;
      z-index: 2;
      border: 4px solid #ffd34d;
      border-radius: 18px;
      /* Der gesamte Bildschirm wird über den riesigen Außen-Schatten
         abgedunkelt. Der eigentliche Fokus-Ausschnitt bleibt transparent
         und zeigt das echte Item / i / die Slots unverändert hell. */
      box-shadow:
        0 0 0 9999px rgba(5,8,13,.76),
        0 0 0 4px rgba(134,0,0,.88),
        0 0 24px rgba(255,211,77,.98),
        0 0 55px rgba(255,211,77,.48);
      pointer-events: none;
      animation: bkL6FocusPulse .7s ease-in-out infinite alternate;
      transition: left .55s ease, top .55s ease, width .55s ease, height .55s ease;
    }

    #${ROOT_ID} .bk-l6-arrow {
      position: fixed;
      z-index: 3;
      width: 14px;
      height: 62px;
      border-radius: 8px;
      background: #ffd34d;
      box-shadow: 0 0 18px #ffd34d;
      pointer-events: none;
      transform-origin: 50% 100%;
      animation: none;
    }

    #${ROOT_ID} .bk-l6-arrow::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -18px;
      transform: translateX(-50%);
      border-left: 18px solid transparent;
      border-right: 18px solid transparent;
      border-top: 25px solid #ffd34d;
      filter: drop-shadow(0 0 6px #ffd34d);
    }

    #${ROOT_ID} .bk-l6-card {
      position: fixed;
      z-index: 4;
      width: min(390px, calc(100vw - 28px));
      left: 50%;
      transform: translateX(-50%);
      top: 18px;
      padding: 14px 16px 13px;
      border: 3px solid #e6bd4a;
      border-radius: 19px;
      background:
        radial-gradient(circle at 50% 0%, rgba(255,210,65,.14), transparent 46%),
        linear-gradient(180deg, #8f0707, #620000);
      color: #fff;
      text-align: center;
      box-shadow: 0 12px 35px rgba(0,0,0,.52), 0 0 22px rgba(255,211,77,.25);
    }

    #${ROOT_ID} .bk-l6-card strong {
      display: block;
      color: #ffd34d;
      font-size: clamp(19px, 5vw, 25px);
      line-height: 1.1;
      margin-bottom: 6px;
      text-shadow: 0 2px 2px #430000;
    }

    #${ROOT_ID} .bk-l6-card span {
      display: block;
      font-size: clamp(13px, 3.5vw, 15px);
      line-height: 1.35;
      font-weight: 700;
    }

    #${PROMPT_ID} {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      z-index: 25000;
      width: min(410px, calc(100vw - 24px));
      box-sizing: border-box;
      padding: 11px 14px;
      border: 3px solid #e6bd4a;
      border-radius: 17px;
      background: linear-gradient(180deg, #8f0707, #620000);
      color: white;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,.45), 0 0 18px rgba(255,211,77,.26);
      font: 800 14px/1.3 Arial, Helvetica, sans-serif;
      pointer-events: none;
      animation: bkTutorialPromptPulse 1.25s ease-in-out infinite;
      transform-origin: center center;
    }

    #${PROMPT_ID} strong {
      display: block;
      margin-bottom: 3px;
      color: #ffd34d;
      font-size: 17px;
    }

    .bk-l6-interactive-highlight {
      position: relative !important;
      z-index: 24990 !important;
      outline: 4px solid #ffd34d !important;
      outline-offset: 4px !important;
      border-radius: 15px !important;
      box-shadow: 0 0 25px rgba(255,211,77,.75) !important;
      animation: bkL6InteractivePulse .7s ease-in-out infinite alternate !important;
    }

    #preLevelLoadoutSlots.bk-l6-slots-highlight {
      position: relative !important;
      z-index: 24989 !important;
      outline: 3px solid rgba(255,211,77,.9) !important;
      outline-offset: 5px !important;
      border-radius: 15px !important;
      box-shadow: 0 0 22px rgba(255,211,77,.42) !important;
    }

    @keyframes bkL6FadeIn { to { opacity: 1; } }
    @keyframes bkL6FocusPulse {
      to {
        transform: scale(1.025);
        box-shadow:
          0 0 0 9999px rgba(5,8,13,.76),
          0 0 0 5px rgba(134,0,0,.96),
          0 0 34px rgba(255,211,77,1),
          0 0 70px rgba(255,211,77,.58);
      }
    }
    @keyframes bkL6InteractivePulse { to { outline-offset: 7px; box-shadow: 0 0 34px rgba(255,211,77,.95) !important; } }


    @keyframes bkTutorialPromptPulse {
      0%, 100% {
        transform: translateX(-50%) scale(1);
        box-shadow:
          0 12px 30px rgba(0, 0, 0, .45),
          0 0 0 2px rgba(255, 214, 74, .28),
          0 0 12px rgba(255, 196, 32, .35);
      }
      50% {
        transform: translateX(-50%) scale(1.035);
        box-shadow:
          0 12px 30px rgba(0, 0, 0, .45),
          0 0 0 5px rgba(255, 221, 83, .55),
          0 0 28px rgba(255, 196, 32, .9);
      }
    }

    @media (max-width: 420px) {
      /* Prompt-Position wird dynamisch zwischen Zielbereich und Loadout gesetzt. */
    }
  `;
  document.head.appendChild(style);
}

function findAvailabilityElement(item) {
  if (!item) return null;

  // Zuerst bekannte/naheliegende Klassennamen versuchen.
  const direct =
    item.querySelector(
      ".prelevel-item-count, .prelevel-item-qty, .prelevel-item-amount, " +
      ".prelevel-item-stock, .item-count, .item-qty, .item-amount, " +
      "[data-role='count'], [data-role='amount'], [data-role='quantity']"
    );

  if (direct) return direct;

  // Fallback für bestehendes Markup:
  // numerische Anzeige suchen und das am weitesten rechts liegende Element wählen.
  const itemRect = item.getBoundingClientRect();
  const numericCandidates = Array.from(item.querySelectorAll("span, b, strong, div"))
    .filter((el) => /^\s*\d+\s*$/.test(el.textContent || ""))
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    })
    .sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return br.right - ar.right;
    });

  return numericCandidates[0] || item;
}

function getTargets() {
  const item =
    document.querySelector('.prelevel-item-button[data-item-key="ballswitch"]');

  const info =
    item?.querySelector(".prelevel-item-info") ||
    item?.querySelector(".item-info-button");

  const availability = findAvailabilityElement(item);

  const slots =
    document.getElementById("preLevelLoadoutSlots");

  return { item, info, availability, slots };
}

function setStartDisabled(disabled) {
  if (!startButton) return;
  startButton.disabled = Boolean(disabled);
  startButton.setAttribute("aria-disabled", disabled ? "true" : "false");
  startButton.style.opacity = disabled ? ".55" : "";
  startButton.style.cursor = disabled ? "not-allowed" : "";
}

function createOverlay() {
  document.getElementById(ROOT_ID)?.remove();

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.innerHTML = `
    <div class="bk-l6-focus"></div>
    <div class="bk-l6-arrow"></div>
    <div class="bk-l6-card">
      <strong></strong>
      <span></span>
    </div>
  `;

  ["pointerdown","pointerup","click","touchstart","touchend"].forEach((type) => {
    root.addEventListener(type, (event) => {
      event.preventDefault();
      event.stopPropagation();
    }, { passive: false });
  });

  document.body.appendChild(root);
  return root;
}

function positionStep() {
  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  const focus = root.querySelector(".bk-l6-focus");
  const arrow = root.querySelector(".bk-l6-arrow");
  const card = root.querySelector(".bk-l6-card");
  const title = root.querySelector(".bk-l6-card strong");
  const text = root.querySelector(".bk-l6-card span");

  const { item, info, availability, slots } = getTargets();

  const steps = [
    {
      el: item,
      title: "DEIN ERSTES ITEM",
      text: "Hier findest du den Ball Switch, den du in Level 5 erspielt hast."
    },
    {
      el: info,
      title: "WAS KANN DAS ITEM?",
      text: "Tippe später auf das kleine i, wenn du die Funktion eines Items nachlesen möchtest."
    },
    {
      el: availability,
      title: "DEINE VERFÜGBARE ANZAHL",
      text: "Die Zahl rechts zeigt dir, wie oft du das Item noch besitzt. Bei jeder Verwendung wird genau 1 Item verbraucht – die Anzeige sinkt also um -1."
    },
    {
      el: slots,
      title: "DEIN LOADOUT",
      text: "In diese freien Slots setzt du die Items, die du im nächsten Level benutzen möchtest."
    }
  ];

  const step = steps[Math.min(currentStep, steps.length - 1)];
  const el = step.el;
  if (!el) return;

  title.textContent = step.title;
  text.textContent = step.text;

  const r = el.getBoundingClientRect();
  const pad = (currentStep === 1 || currentStep === 2) ? 8 : 10;

  focus.style.left = `${Math.max(5, r.left - pad)}px`;
  focus.style.top = `${Math.max(5, r.top - pad)}px`;
  focus.style.width = `${Math.max(28, r.width + pad * 2)}px`;
  focus.style.height = `${Math.max(28, r.height + pad * 2)}px`;

  // Pfeil möglichst oberhalb des Ziels.
  // Erklärungskarte sitzt direkt ÜBER dem Pfeil, damit Hinweis und Ziel
  // auf Handy und Desktop visuell zusammengehören.
  const arrowW = 14;
  const centerX = r.left + r.width / 2;
  let arrowTop = r.top - 82;

  if (arrowTop < 120) {
    // Bei Zielen weit oben den Pfeil rechts neben das Ziel setzen.
    arrow.style.left = `${Math.min(window.innerWidth - 32, r.right + 18)}px`;
    arrow.style.top = `${r.top + Math.max(0, r.height / 2 - 55)}px`;
    arrow.style.transform = "rotate(90deg)";

    // Erklärung möglichst direkt oberhalb des Fokus platzieren.
    const cardHeight = card?.offsetHeight || 105;
    let cardTop = r.top - cardHeight - 18;
    if (cardTop < 8) {
      cardTop = Math.min(window.innerHeight - cardHeight - 8, r.bottom + 18);
    }
    if (card) card.style.top = `${Math.max(8, cardTop)}px`;
  } else {
    arrow.style.left = `${centerX - arrowW / 2}px`;
    arrow.style.top = `${arrowTop}px`;
    arrow.style.transform = "";

    const cardHeight = card?.offsetHeight || 105;
    // ca. 12 px Abstand zwischen Erklärung und Pfeil
    let cardTop = arrowTop - cardHeight - 14;

    // Falls oberhalb nicht genug Platz ist, Karte knapp oberhalb des Fokus
    // oder notfalls direkt unterhalb des Fokus setzen.
    if (cardTop < 8) {
      cardTop = r.top - cardHeight - 16;
    }
    if (cardTop < 8) {
      cardTop = Math.min(window.innerHeight - cardHeight - 8, r.bottom + 18);
    }

    if (card) card.style.top = `${Math.max(8, cardTop)}px`;
  }
}

function runStep() {
  if (!active) return;

  positionStep();

  currentStep += 1;
  if (currentStep >= TOTAL_STEPS) {
    stepTimer = window.setTimeout(beginInteraction, STEP_MS);
  } else {
    stepTimer = window.setTimeout(runStep, STEP_MS);
  }
}

function positionActionPrompt(prompt, success = false) {
  if (!prompt) return;

  // Der "JETZT DU!"-Hinweis soll direkt über "DEIN LOADOUT" sitzen:
  // also unterhalb des Ziel-/Punktebereichs und unmittelbar vor den Slots.
  const slots = document.getElementById("preLevelLoadoutSlots");
  const loadoutCard =
    slots?.closest(".prelevel-loadout-card") ||
    slots?.parentElement;

  const target = loadoutCard || slots;

  if (!target) {
    // Sicherer Fallback, falls sich das Markup später ändert.
    prompt.style.top = "38%";
    return;
  }

  const r = target.getBoundingClientRect();
  const promptHeight = prompt.offsetHeight || 78;

  if (success) {
    // Nach der Auswahl bleibt der Start-Hinweis nahe beim unteren Bereich.
    // scrollIntoView() kümmert sich anschließend um den Startbutton.
    prompt.style.top = `${Math.max(8, r.top - promptHeight - 12)}px`;
    return;
  }

  // Direkt zwischen dem Bereich "Erreiche mindestens XY Punkte"
  // und der Loadout-Karte platzieren.
  const desiredTop = r.top - promptHeight - 10;
  prompt.style.top = `${Math.max(8, desiredTop)}px`;
}

function showPrompt(success = false) {
  let prompt = document.getElementById(PROMPT_ID);
  if (!prompt) {
    prompt = document.createElement("div");
    prompt.id = PROMPT_ID;
    document.body.appendChild(prompt);
  }

  prompt.innerHTML = success
    ? `<strong>PERFEKT!</strong>Unten findest du jetzt <b>LEVEL STARTEN</b>. Tippe auf den Button, um Level 6 zu beginnen.`
    : `<strong>JETZT DU!</strong>Tippe auf den Ball Switch. Er wird automatisch in den ersten freien Slot gesetzt.`;

  // Nach dem Rendern ist die echte Höhe bekannt.
  window.requestAnimationFrame(() => positionActionPrompt(prompt, success));
}

function beginInteraction() {
  active = false;
  gated = true;
  document.getElementById(ROOT_ID)?.remove();

  const { item, slots } = getTargets();
  item?.classList.add("bk-l6-interactive-highlight");
  slots?.classList.add("bk-l6-slots-highlight");

  showPrompt(false);
  setStartDisabled(true);
}

function clearHighlights() {
  document.querySelectorAll(".bk-l6-interactive-highlight").forEach((el) => {
    el.classList.remove("bk-l6-interactive-highlight");
  });
  document.getElementById("preLevelLoadoutSlots")
    ?.classList.remove("bk-l6-slots-highlight");
}

function markDone() {
  if (completed) return;
  completed = true;
  gated = false;
  setStartDisabled(false);
  clearHighlights();

  // Nach der Item-Auswahl den nächsten Schritt unmissverständlich zeigen:
  // LEVEL STARTEN befindet sich unten auf der Vorschaukarte.
  startButton?.classList.add("bk-l6-interactive-highlight");
  showPrompt(true);

  // Den Button in den sichtbaren Bereich holen, damit der Spieler
  // den Hinweis und den Zielbutton direkt miteinander verknüpft.
  window.setTimeout(() => {
    startButton?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 250);

  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}

  // Der Hinweis bleibt nun stehen, bis der Spieler LEVEL STARTEN drückt.
}

export const Level6LoadoutGuide = Object.freeze({
  open({ levelNumber, startButton: button } = {}) {
    this.close();
    startButton = button || null;
    completed = false;

    if (Number(levelNumber) !== 6) {
      setStartDisabled(false);
      return false;
    }

    // TESTMODUS:
    // Die Einführung läuft vorübergehend bei JEDEM Öffnen von Level 6.
    // Der gespeicherte Status wird absichtlich ignoriert.
    addStyles();
    setStartDisabled(true);

    // PreLevelLoadout.render() muss zuerst die Buttons erzeugen.
    window.requestAnimationFrame(() => {
      const { item, slots } = getTargets();
      if (!item || !slots) {
        setStartDisabled(false);
        return;
      }

      active = true;
      gated = false;
      currentStep = 0;
      createOverlay();

      resizeHandler = () => {
        positionStep();
        const prompt = document.getElementById(PROMPT_ID);
        if (prompt) {
          positionActionPrompt(prompt, completed);
        }
      };
      window.addEventListener("resize", resizeHandler);

      runStep();
    });

    return true;
  },

  onLoadoutChange(selected = []) {
    if (!gated || completed) return;

    const hasBallSwitch = Array.isArray(selected) && selected.includes("ballswitch");

    if (hasBallSwitch) {
      markDone();
    } else {
      setStartDisabled(true);
    }
  },

  canStart() {
    return !active && !gated;
  },

  remind() {
    if (active) return;
    if (!gated) return;

    showPrompt(false);
    const { item, slots } = getTargets();
    item?.classList.add("bk-l6-interactive-highlight");
    slots?.classList.add("bk-l6-slots-highlight");
  },

  complete() {
    if (Number(document.getElementById("selectedLevelTitle")?.textContent?.replace(/\D/g, "")) === 6) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }
    this.close();
  },

  close() {
    clearTimeout(stepTimer);
    stepTimer = null;
    active = false;
    gated = false;
    currentStep = 0;

    document.getElementById(ROOT_ID)?.remove();
    document.getElementById(PROMPT_ID)?.remove();
    clearHighlights();

    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }

    // Nur eine laufende Einführung darf den Button sperren.
    setStartDisabled(false);
    startButton = null;
  }
});
