/* BoujeePhoto video editing course: popup + explanation section.
   Add to index.html, just before </body>:
   <script src="course-popup.js" defer></script>
*/
(function () {
  "use strict";

  // CHANGE THIS to the address of your course worker (no slash at the end)
  var COURSE_URL = "https://boujee-course-worker.kakoozaronald71.workers.dev";
  var SHOW_AGAIN_AFTER_HOURS = 24;
  var STORAGE_KEY = "vc_popup_seen";

  function start() {
    if (document.getElementById("vc-popup")) return;

    // ---------- CSS ----------
    var css = `
.vc-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.75)}
.vc-overlay.vc-open{display:flex}
.vc-box{position:relative;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow-y:auto;background:var(--bg-card,#0f0f0f);color:var(--text,#fff);border:1px solid var(--red,#e10600);padding:28px 24px;animation:vc-in .25s ease-out}
@keyframes vc-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.vc-close{position:absolute;top:6px;right:6px;width:44px;height:44px;background:none;border:0;color:var(--text-muted,#888);font-size:26px;line-height:1;cursor:pointer}
.vc-close:hover{color:var(--text,#fff)}
.vc-eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--red,#e10600);margin-bottom:8px;padding-right:36px}
.vc-title{font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1.15;margin-bottom:8px}
.vc-lead{color:var(--text-light,#ccc);font-size:15px;margin-bottom:18px}
.vc-plan{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border:1px solid var(--line,#222);padding:14px;margin-bottom:10px}
.vc-plan b{display:block;font-size:15px}
.vc-plan span{display:block;font-size:13px;color:var(--text-muted,#888)}
.vc-price{white-space:nowrap;font-weight:700;font-size:15px;text-align:right}
.vc-btn{display:block;text-align:center;text-decoration:none;background:var(--red,#e10600);color:#fff;font-weight:700;font-size:15px;padding:15px;margin-top:16px}
.vc-btn:hover{opacity:.85}
.vc-btn.vc-inline{display:inline-block;padding:16px 32px}
.vc-link{display:block;width:100%;text-align:center;background:none;border:0;color:var(--text-muted,#888);font:inherit;font-size:14px;padding:12px;margin-top:4px;cursor:pointer;text-decoration:underline}
.vc-link:hover{color:var(--text,#fff)}
.vc-overlay a:focus-visible,.vc-overlay button:focus-visible,#course a:focus-visible{outline:2px solid var(--red,#e10600);outline-offset:3px}
#course{background:var(--bg-mid,#121212);border-top:1px solid var(--line,#222);border-bottom:1px solid var(--line,#222)}
.vc-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:40px 0 8px;max-width:800px}
.vc-card{border:1px solid var(--line,#222);background:var(--bg-card,#0f0f0f);padding:28px 24px}
.vc-card.vc-feature{border-color:var(--red,#e10600)}
.vc-card h3{font-size:18px;margin-bottom:4px}
.vc-amount{font-size:30px;font-weight:700;letter-spacing:-1px;margin-bottom:14px}
.vc-amount small{font-size:14px;font-weight:400;color:var(--text-muted,#888);letter-spacing:0}
.vc-card ul{list-style:none;display:flex;flex-direction:column;gap:8px}
.vc-card li{font-size:14px;color:var(--text-light,#ccc);padding-left:22px;position:relative}
.vc-card li::before{content:"\\2713";position:absolute;left:0;color:var(--red,#e10600);font-weight:700}
.vc-how{margin:20px 0 4px;font-size:14px;color:var(--text-muted,#888);max-width:640px}
@media(max-width:700px){.vc-grid{grid-template-columns:1fr}.vc-btn.vc-inline{display:block}}
`;
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // ---------- Explanation section on the page ----------
    var sectionHtml =
      '<section id="course" aria-labelledby="vc-sec-title"><div class="container">' +
      '<p class="section-eyebrow">Video editing course</p>' +
      '<h2 class="section-title" id="vc-sec-title">Learn video editing.<br>Pay with just your phone number.</h2>' +
      '<p class="section-sub">No account and no sign up. Pick a plan, enter your phone number and pay with Mobile Money.</p>' +
      '<div class="vc-grid">' +
      '<div class="vc-card vc-feature"><h3>Monthly Club</h3>' +
      '<div class="vc-amount">UGX 50,000 <small>/ month</small></div>' +
      '<ul><li>Video editing lessons</li><li>A WhatsApp group to study with other members</li>' +
      '<li>Your WhatsApp link appears as soon as you pay</li><li>Access lasts 30 days. Pay again to renew</li></ul></div>' +
      '<div class="vc-card"><h3>Private Lessons</h3>' +
      '<div class="vc-amount">UGX 250,000</div>' +
      '<ul><li>One-on-one lessons with Ronald</li><li>Ronald calls you on the number you enter</li>' +
      '<li>Learn at your own pace</li></ul></div>' +
      '</div>' +
      '<p class="vc-how">How it works: choose a plan, type your phone number, pay with Mobile Money. That is all.</p>' +
      '<a class="vc-btn vc-inline" href="__URL__">Choose a plan and pay</a>' +
      "</div></section>";
    var holder = document.createElement("div");
    holder.innerHTML = sectionHtml.replace(/__URL__/g, COURSE_URL);
    var section = holder.firstElementChild;
    var anchor = document.getElementById("faq") || document.querySelector("footer");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(section, anchor);
    else document.body.appendChild(section);

    // ---------- Popup ----------
    var popupHtml =
      '<div class="vc-overlay" id="vc-popup" role="dialog" aria-modal="true" aria-labelledby="vc-title">' +
      '<div class="vc-box">' +
      '<button class="vc-close" type="button" aria-label="Close" data-vc-close>&times;</button>' +
      '<p class="vc-eyebrow">New: video editing course</p>' +
      '<h2 class="vc-title" id="vc-title">Learn video editing. Pay with just your phone number.</h2>' +
      '<p class="vc-lead">No account needed. Pick a plan and pay with Mobile Money.</p>' +
      '<div class="vc-plan"><div><b>Monthly Club</b><span>Lessons plus a WhatsApp study group</span></div>' +
      '<div class="vc-price">UGX 50,000<span>per month</span></div></div>' +
      '<div class="vc-plan"><div><b>Private Lessons</b><span>One-on-one with Ronald</span></div>' +
      '<div class="vc-price">UGX 250,000</div></div>' +
      '<a class="vc-btn" id="vc-go" href="__URL__">Choose a plan</a>' +
      '<button class="vc-link" type="button" data-vc-more>How it works</button>' +
      "</div></div>";
    var h2 = document.createElement("div");
    h2.innerHTML = popupHtml.replace(/__URL__/g, COURSE_URL);
    var popup = h2.firstElementChild;
    document.body.appendChild(popup);

    var goBtn = document.getElementById("vc-go");
    var lastFocus = null;

    function recentlySeen() {
      try {
        var t = parseInt(localStorage.getItem(STORAGE_KEY), 10);
        return !!t && Date.now() - t < SHOW_AGAIN_AFTER_HOURS * 3600000;
      } catch (e) {
        return false;
      }
    }
    function markSeen() {
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (e) {}
    }
    function isOpen() { return popup.classList.contains("vc-open"); }
    function openPopup() {
      lastFocus = document.activeElement;
      popup.classList.add("vc-open");
      document.body.style.overflow = "hidden";
      markSeen();
      goBtn.focus();
    }
    function closePopup() {
      popup.classList.remove("vc-open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    popup.addEventListener("click", function (e) {
      if (e.target === popup || e.target.hasAttribute("data-vc-close")) closePopup();
      else if (e.target.hasAttribute("data-vc-more")) {
        closePopup();
        section.scrollIntoView({ behavior: "smooth" });
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { closePopup(); return; }
      if (e.key !== "Tab") return;
      var f = popup.querySelectorAll("button,a[href]");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Show shortly after the page opens, once per visitor per day
    if (!recentlySeen() && location.hash !== "#course") setTimeout(openPopup, 600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
