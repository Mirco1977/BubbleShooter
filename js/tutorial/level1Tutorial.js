/*
 * Bandenkick Bubble Shooter – Level-1-Punkte-Tutorial
 * --------------------------------------------------
 * WICHTIG:
 * - komplett getrennt von BubbleGame.draw/update
 * - keine Änderungen an ballImageCache / palette / currentBallTheme
 * - Standardbälle werden ausschließlich als normale <img>-Elemente geladen
 * - dadurch kann das Tutorial keine anderen Level oder deren Bälle beeinflussen
 */

const ROOT_ID = "bk-level1-tutorial";
const STYLE_ID = "bk-level1-tutorial-style";
const DURATION = 5600; // ab hier wird der Start-Button freigegeben

let active = false;
let timer = null;

function addStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${ROOT_ID} {
      position: fixed;
      inset: 0;
      z-index: 25000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      background: rgba(5,7,12,.78);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      opacity: 0;
      animation: bkTutOverlayIn .28s ease forwards;
      box-sizing: border-box;
      touch-action: none;
      user-select: none;
    }

    #${ROOT_ID}.bk-tut-out {
      animation: bkTutOverlayOut .30s ease forwards;
    }

    #${ROOT_ID} .bk-tut-card {
      position: relative;
      width: min(440px, calc(100vw - 28px));
      min-height: 520px;
      overflow: hidden;
      border: 4px solid #d5a629;
      border-radius: 25px;
      background:
        radial-gradient(circle at 50% 32%, rgba(255,205,59,.13), transparent 34%),
        linear-gradient(180deg, rgba(42,19,22,.98), rgba(15,9,13,.99));
      box-shadow:
        0 0 0 2px rgba(255,232,145,.18) inset,
        0 18px 55px rgba(0,0,0,.55),
        0 0 34px rgba(221,167,38,.33);
      transform: scale(.92);
      animation: bkTutCardIn .45s cubic-bezier(.2,.9,.2,1.15) forwards;
      font-family: Arial, Helvetica, sans-serif;
      box-sizing: border-box;
    }

    #${ROOT_ID} .bk-tut-banner {
      margin: 20px 20px 0;
      padding: 12px 10px 11px;
      border: 3px solid #efc650;
      border-radius: 17px;
      background: linear-gradient(#9c0808,#690000);
      box-shadow: 0 5px 14px rgba(0,0,0,.35), 0 0 16px rgba(255,198,70,.18) inset;
      color: #ffd85a;
      text-align: center;
      font-weight: 1000;
      letter-spacing: .3px;
      text-shadow: 0 2px 2px #3a0000;
    }

    #${ROOT_ID} .bk-tut-banner-title {
      font-size: clamp(20px, 5vw, 27px);
      line-height: 1.08;
    }

    #${ROOT_ID} .bk-tut-banner-help {
      margin-top: 8px;
      padding-top: 7px;
      border-top: 1px solid rgba(255,216,90,.45);
      color: #fff;
      font-size: clamp(14px, 3.8vw, 16px);
      line-height: 1.25;
      font-weight: 850;
      text-shadow: 0 2px 2px rgba(0,0,0,.55);
    }

    #${ROOT_ID} .bk-tut-banner-help span {
      color: rgba(255,255,255,.82);
      font-size: .88em;
      font-weight: 650;
    }

    #${ROOT_ID} .bk-tut-stage {
      position: relative;
      height: 275px;
      margin-top: 8px;
    }

    #${ROOT_ID} .bk-tut-ball {
      position: absolute;
      width: 66px;
      height: 66px;
      object-fit: contain;
      filter: drop-shadow(0 5px 7px rgba(0,0,0,.4));
      z-index: 3;
    }

    #${ROOT_ID} .bk-tut-ball-a { left: calc(50% - 70px); top: 37px; }
    #${ROOT_ID} .bk-tut-ball-b { left: calc(50% + 4px); top: 37px; }
    #${ROOT_ID} .bk-tut-ball-shot {
      left: calc(50% - 33px);
      top: 188px;
      animation: bkTutShoot 1.35s .65s cubic-bezier(.3,.85,.25,1) forwards,
                 bkTutPopBall .58s 2.52s ease-in forwards;
    }
    #${ROOT_ID} .bk-tut-ball-a,
    #${ROOT_ID} .bk-tut-ball-b {
      animation: bkTutPopBall .58s 2.52s ease-in forwards;
    }

    #${ROOT_ID} .bk-tut-arrow {
      position: absolute;
      left: calc(50% - 6px);
      top: 144px;
      width: 12px;
      height: 54px;
      border-radius: 8px;
      background: #ffd44c;
      box-shadow: 0 0 16px #ffd44c;
      z-index: 4;
      animation: bkTutArrowMove .72s ease-in-out infinite alternate,
                 bkTutArrowFade .25s 2.10s forwards;
    }
    #${ROOT_ID} .bk-tut-arrow::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -19px;
      transform: translateX(-50%);
      border-left: 17px solid transparent;
      border-right: 17px solid transparent;
      border-bottom: 25px solid #ffd44c;
      filter: drop-shadow(0 0 5px #ffd44c);
    }

    #${ROOT_ID} .bk-tut-help {
      position: absolute;
      left: 12px;
      right: 12px;
      top: 226px;
      text-align: center;
      color: #fff;
      font-size: 17px;
      font-weight: 800;
      opacity: 1;
      animation: bkTutHelpOut .28s 2.20s forwards;
    }
    #${ROOT_ID} .bk-tut-help small {
      display: block;
      margin-top: 4px;
      color: rgba(255,255,255,.76);
      font-size: 14px;
      font-weight: 600;
    }

    #${ROOT_ID} .bk-tut-burst {
      position: absolute;
      left: 50%;
      top: 84px;
      width: 30px;
      height: 30px;
      border: 8px solid #ffd44c;
      border-radius: 50%;
      transform: translate(-50%,-50%) scale(.2);
      opacity: 0;
      z-index: 2;
      animation: bkTutBurst .72s 2.55s ease-out forwards;
      box-shadow: 0 0 24px #ffd44c;
    }

    #${ROOT_ID} .bk-tut-plus {
      position: absolute;
      top: 25px;
      z-index: 6;
      color: #ffd94d;
      -webkit-text-stroke: 2px #634000;
      paint-order: stroke fill;
      font-weight: 1000;
      font-size: 23px;
      opacity: 0;
      text-shadow: 0 3px 8px rgba(0,0,0,.7), 0 0 12px rgba(255,211,64,.5);
      animation: bkTutPlus .95s 2.78s ease-out forwards;
    }
    #${ROOT_ID} .bk-tut-plus-1 { left: calc(50% - 101px); }
    #${ROOT_ID} .bk-tut-plus-2 { left: calc(50% - 29px); top: 84px; }
    #${ROOT_ID} .bk-tut-plus-3 { left: calc(50% + 44px); }

    #${ROOT_ID} .bk-tut-score {
      position: absolute;
      left: 0;
      right: 0;
      top: 112px;
      text-align: center;
      color: #ffd94d;
      -webkit-text-stroke: 3px #603700;
      paint-order: stroke fill;
      font-size: clamp(32px, 8vw, 44px);
      font-weight: 1000;
      opacity: 0;
      transform: scale(.5);
      text-shadow: 0 4px 9px rgba(0,0,0,.7), 0 0 18px rgba(255,210,67,.55);
      animation: bkTutScoreIn .55s 3.48s cubic-bezier(.2,1.3,.3,1) forwards;
    }

    #${ROOT_ID} .bk-tut-rule {
      margin: -6px 22px 0;
      padding: 13px 12px;
      border-radius: 15px;
      border: 2px solid rgba(239,198,80,.7);
      background: rgba(110,0,0,.72);
      text-align: center;
      color: #fff;
      font-weight: 900;
      font-size: 17px;
      opacity: 0;
      transform: translateY(10px);
      animation: bkTutRuleIn .4s 4.15s ease forwards;
    }
    #${ROOT_ID} .bk-tut-rule strong { color: #ffd94d; font-size: 20px; }
    #${ROOT_ID} .bk-tut-rule small {
      display: block;
      margin-top: 5px;
      color: rgba(255,255,255,.8);
      font-size: 13px;
      font-weight: 650;
    }

    #${ROOT_ID} .bk-tut-ready {
      display: block;
      margin: 14px auto 18px;
      width: fit-content;
      min-width: 220px;
      padding: 11px 22px;
      border-radius: 16px;
      border: 3px solid #efc650;
      background: #860000;
      color: white;
      text-align: center;
      font-size: 18px;
      font-weight: 1000;
      font-family: inherit;
      cursor: pointer;
      opacity: 0;
      transform: scale(.75);
      animation: bkTutReadyIn .42s 5.40s cubic-bezier(.2,1.25,.3,1) forwards,
                 bkTutReadyPulse .55s 5.85s ease-in-out infinite alternate;
    }

    #${ROOT_ID} .bk-tut-ready:disabled {
      cursor: default;
      pointer-events: none;
    }

    #${ROOT_ID} .bk-tut-ready:not(:disabled) {
      pointer-events: auto;
    }

    @keyframes bkTutOverlayIn { to { opacity: 1; } }
    @keyframes bkTutOverlayOut { to { opacity: 0; } }
    @keyframes bkTutCardIn { to { transform: scale(1); } }
    @keyframes bkTutShoot { to { top: 100px; } }
    @keyframes bkTutPopBall {
      0% { transform: scale(1); opacity: 1; }
      55% { transform: scale(1.34); opacity: 1; filter: brightness(1.6) drop-shadow(0 0 15px #ffd44c); }
      100% { transform: scale(.15); opacity: 0; }
    }
    @keyframes bkTutArrowMove { to { transform: translateY(-12px); } }
    @keyframes bkTutArrowFade { to { opacity: 0; } }
    @keyframes bkTutHelpOut { to { opacity: 0; transform: translateY(-8px); } }
    @keyframes bkTutBurst {
      0% { opacity: 0; transform: translate(-50%,-50%) scale(.2); }
      18% { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%,-50%) scale(6); }
    }
    @keyframes bkTutPlus {
      0% { opacity: 0; transform: translateY(20px) scale(.55); }
      35% { opacity: 1; transform: translateY(0) scale(1.16); }
      100% { opacity: 0; transform: translateY(-45px) scale(.92); }
    }
    @keyframes bkTutScoreIn {
      0% { opacity: 0; transform: scale(.5); }
      70% { opacity: 1; transform: scale(1.13); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes bkTutRuleIn { to { opacity: 1; transform: translateY(0); } }
    @keyframes bkTutReadyIn { to { opacity: 1; transform: scale(1); } }
    @keyframes bkTutReadyPulse { to { transform: scale(1.045); box-shadow: 0 0 20px rgba(255,211,64,.4); } }

    @media (max-width: 390px) {
      #${ROOT_ID} .bk-tut-card { min-height: 500px; }
      #${ROOT_ID} .bk-tut-stage { height: 260px; }
      #${ROOT_ID} .bk-tut-ball { width: 60px; height: 60px; }
      #${ROOT_ID} .bk-tut-ball-a { left: calc(50% - 64px); }
      #${ROOT_ID} .bk-tut-ball-b { left: calc(50% + 4px); }
      #${ROOT_ID} .bk-tut-ball-shot { left: calc(50% - 30px); }
      #${ROOT_ID} .bk-tut-help { font-size: 15px; }
      #${ROOT_ID} .bk-tut-rule { font-size: 15px; }
    }
  `;
  document.head.appendChild(style);
}

function createOverlay() {
  const old = document.getElementById(ROOT_ID);
  if (old) old.remove();

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", "Punkte Tutorial");

  root.innerHTML = `
    <div class="bk-tut-card">
      <div class="bk-tut-banner">
        <div class="bk-tut-banner-title">SO SAMMELST DU PUNKTE</div>
        <div class="bk-tut-banner-help">
          Bilde mindestens 3 gleiche Bälle<br>
          <span>Schieße einen passenden Ball an die Gruppe.</span>
        </div>
      </div>
      <div class="bk-tut-stage">
        <img class="bk-tut-ball bk-tut-ball-a" src="assets/balls/bk-arena-balls/red.png" alt="">
        <img class="bk-tut-ball bk-tut-ball-b" src="assets/balls/bk-arena-balls/red.png" alt="">
        <img class="bk-tut-ball bk-tut-ball-shot" src="assets/balls/bk-arena-balls/red.png" alt="">
        <div class="bk-tut-arrow"></div>
        <div class="bk-tut-burst"></div>
        <div class="bk-tut-plus bk-tut-plus-1">+100</div>
        <div class="bk-tut-plus bk-tut-plus-2">+100</div>
        <div class="bk-tut-plus bk-tut-plus-3">+100</div>
        <div class="bk-tut-score">+300 PUNKTE</div>
      </div>
      <div class="bk-tut-rule">
        JEDER BALL = <strong>+100 PUNKTE</strong>
        <small>Je größer die Gruppe, desto mehr Punkte bekommst du.</small>
      </div>
      <button class="bk-tut-ready" type="button" disabled>JETZT BIST DU DRAN!</button>
    </div>
  `;

  // Prevent any click/touch from reaching the canvas beneath the overlay.
  ["pointerdown", "pointerup", "click", "touchstart", "touchend"].forEach((type) => {
    root.addEventListener(type, (event) => {
      event.preventDefault();
      event.stopPropagation();
    }, { passive: false });
  });

  document.body.appendChild(root);
  return root;
}

function enableReadyButton() {
  if (!active) return;

  const root = document.getElementById(ROOT_ID);
  const button = root?.querySelector(".bk-tut-ready");
  if (!button) return;

  button.disabled = false;
  button.setAttribute("aria-label", "Tutorial verstanden – Level starten");

  if (button.dataset.bound === "1") return;
  button.dataset.bound = "1";

  button.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    finish();
  });
}

function finish() {
  if (!active) return;
  const root = document.getElementById(ROOT_ID);
  active = false;
  clearTimeout(timer);
  timer = null;

  if (!root) return;
  root.classList.add("bk-tut-out");
  window.setTimeout(() => root.remove(), 320);
}

export const Level1Tutorial = Object.freeze({
  start({ levelNumber, gameMode } = {}) {
    this.stop();

    // Nur normales Level 1. Episodenrennen bleiben vollständig unberührt.
    if (Number(levelNumber) !== 1 || gameMode === "episode") return false;

    addStyles();
    createOverlay();
    active = true;
    timer = window.setTimeout(enableReadyButton, DURATION);
    return true;
  },

  stop() {
    clearTimeout(timer);
    timer = null;
    active = false;
    document.getElementById(ROOT_ID)?.remove();
  },

  isActive() {
    return active;
  }
});
