/* Goldstay embeddable landlord-intake loader.
 *
 * Drop this on any partner site:
 *
 *   <div id="goldstay-landlord-intake"></div>
 *   <script
 *     src="https://goldstay.co.ke/embed/landlord-intake.js"
 *     data-goldstay-partner="kenyans-in-uk"
 *     defer
 *   ></script>
 *
 * The script:
 *   1. Finds (or creates) #goldstay-landlord-intake on the host page.
 *   2. Injects an iframe pointing at /embed/landlord-intake?partner=...
 *   3. Listens for postMessage(type:"goldstay-embed-resize") from the
 *      iframe to auto-size its height as the form scrolls between
 *      states (idle → success), so there's no inner scrollbar.
 *
 * Idempotent: second invocation does nothing rather than double-render.
 *
 * No external dependencies. No tracking pixels. The form posts back
 * to /api/lead which handles enrichment + Resend + Airtable mirror.
 */
(function () {
  if (window.__goldstayEmbedLoaded) return;
  window.__goldstayEmbedLoaded = true;

  // Find the script tag that loaded us so we can read data attributes
  // off it. document.currentScript only works during initial parse;
  // fall back to the last script with our src as a tolerance for
  // async/deferred loads.
  function findOurScript() {
    if (document.currentScript) return document.currentScript;
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i];
      if (s.src && s.src.indexOf("/embed/landlord-intake.js") !== -1) {
        return s;
      }
    }
    return null;
  }

  function sanitizePartner(raw) {
    if (!raw) return "unknown";
    return String(raw).toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40)
      || "unknown";
  }

  function ensureContainer() {
    var c = document.getElementById("goldstay-landlord-intake");
    if (c) return c;
    // Inject one right after our script tag if the host forgot.
    var script = findOurScript();
    var div = document.createElement("div");
    div.id = "goldstay-landlord-intake";
    if (script && script.parentNode) {
      script.parentNode.insertBefore(div, script.nextSibling);
    } else {
      document.body.appendChild(div);
    }
    return div;
  }

  var script = findOurScript();
  var partner = sanitizePartner(
    (script && script.getAttribute("data-goldstay-partner")) || "",
  );

  // Resolve the embed origin from our own script src so a partner
  // running this on a staging mirror doesn't have to override it.
  var origin = (function () {
    if (!script || !script.src) return "https://goldstay.co.ke";
    try {
      var u = new URL(script.src);
      return u.origin;
    } catch (e) {
      return "https://goldstay.co.ke";
    }
  })();

  var src =
    origin + "/embed/landlord-intake?partner=" + encodeURIComponent(partner);

  var container = ensureContainer();
  // Don't re-inject if there's already an iframe in there (e.g. the
  // host's SPA has remounted the section). Replace instead.
  while (container.firstChild) container.removeChild(container.firstChild);

  var iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = "Goldstay landlord intake";
  iframe.style.width = "100%";
  iframe.style.border = "0";
  iframe.style.display = "block";
  iframe.style.minHeight = "640px";
  iframe.setAttribute("loading", "lazy");
  // referrerpolicy keeps partner-page paths out of our analytics; we
  // know the partner from the data-attribute already.
  iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
  container.appendChild(iframe);

  function isFromUs(event) {
    if (!event || !event.origin) return false;
    return event.origin === origin;
  }

  window.addEventListener("message", function (event) {
    if (!isFromUs(event)) return;
    var data = event.data;
    if (!data || data.type !== "goldstay-embed-resize") return;
    var h = parseInt(data.height, 10);
    if (!h || h < 200 || h > 4000) return;
    iframe.style.height = h + "px";
  });
})();
