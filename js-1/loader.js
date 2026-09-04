(() => {
  "use strict";

  const MIN_VISIBLE_MS = 280;
  const ASSET_TIMEOUT_MS = 9000;

  const loadedImages = new Set();
  let visibleSince = performance.now();
  let activeToken = 0;
  let hideTimer = 0;

  const getOverlay = () => document.getElementById("bkLoader");
  const getText = () => document.getElementById("bkLoaderText");
  const getSubtext = () => document.getElementById("bkLoaderSubtext");

  function normalizeUrl(src) {
    if (!src) return "";
    try {
      return new URL(src, document.baseURI).href;
    } catch (_) {
      return String(src);
    }
  }

  function imageAlreadyReady(src) {
    const url = normalizeUrl(src);
    if (!url) return true;
    if (loadedImages.has(url)) return true;

    for (const img of document.images) {
      if (normalizeUrl(img.currentSrc || img.src) === url && img.complete && img.naturalWidth > 0) {
        loadedImages.add(url);
        return true;
      }
    }

    return false;
  }

  function waitForImage(src, timeoutMs = ASSET_TIMEOUT_MS) {
    const url = normalizeUrl(src);
    if (!url || imageAlreadyReady(url)) return Promise.resolve(true);

    return new Promise((resolve) => {
      const img = new Image();
      let settled = false;
      let timeoutId = 0;

      const done = (ok) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        img.onload = null;
        img.onerror = null;
        if (ok) loadedImages.add(url);
        resolve(ok);
      };

      img.onload = () => done(true);
      img.onerror = () => done(false);
      timeoutId = window.setTimeout(() => done(false), timeoutMs);
      img.src = url;

      if (img.complete) {
        done(img.naturalWidth > 0);
      }
    });
  }

  function uniqueSources(sources) {
    return [...new Set((sources || []).map(normalizeUrl).filter(Boolean))];
  }

  function getPendingImages(sources) {
    return uniqueSources(sources).filter((src) => !imageAlreadyReady(src));
  }

  function collectImages(root) {
    if (!root) return [];
    return [...root.querySelectorAll("img")]
      .map((img) => img.currentSrc || img.src || img.getAttribute("src"))
      .filter(Boolean);
  }

  function show(text = "Wird geladen…", subtext = "Einen Moment bitte") {
    const overlay = getOverlay();
    if (!overlay) return ++activeToken;

    window.clearTimeout(hideTimer);
    const token = ++activeToken;
    visibleSince = performance.now();

    if (getText()) getText().textContent = text;
    if (getSubtext()) getSubtext().textContent = subtext;

    overlay.classList.remove("bk-loader-hidden");
    overlay.setAttribute("aria-hidden", "false");
    return token;
  }

  function hide(token = activeToken, minVisibleMs = MIN_VISIBLE_MS) {
    if (token !== activeToken) return;

    const overlay = getOverlay();
    if (!overlay) return;

    const elapsed = performance.now() - visibleSince;
    const delay = Math.max(0, minVisibleMs - elapsed);

    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (token !== activeToken) return;
      overlay.classList.add("bk-loader-hidden");
      overlay.setAttribute("aria-hidden", "true");
    }, delay);
  }

  async function preloadImages(sources, options = {}) {
    const pending = getPendingImages(sources);
    if (!pending.length) return { total: 0, loaded: 0, failed: 0 };

    const results = await Promise.all(
      pending.map((src) => waitForImage(src, options.timeoutMs || ASSET_TIMEOUT_MS))
    );

    const loaded = results.filter(Boolean).length;
    return {
      total: pending.length,
      loaded,
      failed: pending.length - loaded
    };
  }

  async function preloadElement(root, options = {}) {
    return preloadImages(collectImages(root), options);
  }

  async function run(text, task, options = {}) {
    const token = show(text, options.subtext || "Einen Moment bitte");
    try {
      return await task();
    } finally {
      hide(token, options.minVisibleMs ?? MIN_VISIBLE_MS);
    }
  }

  function transitionScreen(text, root, onReady) {
    const sources = collectImages(root);
    const pending = getPendingImages(sources);

    if (!pending.length) {
      onReady?.();
      return Promise.resolve();
    }

    const token = show(text, "Grafiken werden vorbereitet");
    return preloadImages(pending)
      .catch(() => {})
      .finally(() => {
        onReady?.();
        hide(token);
      });
  }

  const coreAssets = [
    "assets/logos/LigaLogoBordered.png",
    "assets/ui/bandenkick-bubbleshooter-logo.png",
    "assets/ui/levelkarte-bandenkick.png",
    "assets/ui/gluecksrad-bandenkick.png",
    "assets/ui/shop-bandenkick.png",
    "assets/ui/ranking-bandenkick.png",
    "assets/ui/sammelalbum-overview.png",
    "assets/ui/einstellungen-bandenkick.png",
    "assets/balls/bk-arena-balls/red.png",
    "assets/balls/bk-arena-balls/blue.png",
    "assets/balls/bk-arena-balls/green.png",
    "assets/balls/bk-arena-balls/yellow.png",
    "assets/balls/bk-arena-balls/purple.png",
    "assets/balls/bk-arena-balls/pink.png",
    "assets/balls/bk-arena-balls/black.png",
    "assets/ui/ballswitch.png",
    "assets/ui/bomb-ball.png",
    "assets/ui/thunder-ball.png",
    "assets/ui/rainbow-ball.png",
    "assets/ui/color-bomb.png",
    "assets/ui/lupe.png",
    "assets/ui/chain-lock-overlay.png",
    "assets/ui/gold-ball.png"
  ];

  async function preloadCore() {
    const pageImages = collectImages(document);
    const fontsReady = document.fonts?.ready || Promise.resolve();
    await Promise.all([
      preloadImages([...coreAssets, ...pageImages]),
      fontsReady.catch?.(() => {}) || fontsReady
    ]);
  }

  window.BKLoader = {
    show,
    hide,
    run,
    preloadImages,
    preloadElement,
    transitionScreen,
    collectImages,
    getPendingImages,
    preloadCore,
    waitForImage,
    MIN_VISIBLE_MS,
    ASSET_TIMEOUT_MS
  };

  // Der Loader ist im HTML absichtlich von Anfang an sichtbar. Dadurch gibt es
  // auch auf langsameren Mobilgeräten keinen ungestylten Zwischenzustand.
  document.addEventListener("DOMContentLoaded", async () => {
    const token = activeToken || show("Spiel wird geladen…", "Grafiken werden vorbereitet");
    try {
      await preloadCore();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    } catch (_) {
      // Ein einzelnes fehlendes Asset darf den Start niemals dauerhaft blockieren.
    } finally {
      hide(token, 360);
    }
  }, { once: true });
})();
