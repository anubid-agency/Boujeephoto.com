/* BoujeePhoto course section. Add to index.html before </body>:
   <script src="course.js" defer></script>
   The rotating on-scroll image effect is adapted from Codrops "Rotating On-Scroll
   Animations" (MIT licence): https://github.com/codrops/RotatingOnScrollAnimations */
(function () {
  "use strict";

  /* ================= EDIT THIS BLOCK: links, images and wording ================= */
  var COURSE_URL = "https://boujee-course-worker.kakoozaronald71.workers.dev";
  var CHANNEL_URL = "https://whatsapp.com/channel/0029Vb8takpEgGfM3sovTN2Y";
  var SHOW_AGAIN_AFTER_HOURS = 24;
  var STORAGE_KEY = "vc_popup_seen";

  var TEXT = {
    eyebrow: "BoujeePhoto Creator Academy · Uganda",
    title: "Learn to create videos that stand out.",
    lead: "Live online lessons in video editing, content creation and practical AI. No account needed. Pay with just your phone number.",
    payMonthly: "Join the Monthly Club · UGX 50,000",
    payPrivate: "Private lessons",
    channel: "Join the free WhatsApp channel",
    chips: ["Live online", "Beginner friendly", "Mobile Money"],
    marquee: "VIDEO EDITING / CONTENT CREATION / AI FOR CREATORS / ",
    learnEyebrow: "Learn by doing",
    learnTitle: "Build real video skills.",
    cards: [
      { img: "davinci.jpg", alt: "DaVinci Resolve editing screen", title: "Video editing", text: "Import footage, cut on a timeline, add titles, colour grade and export." },
      { img: "filmingwithphone.jpg", alt: "Filming with a phone", title: "Content creation", text: "Plan your content and shoot better footage with better light, for TikTok, YouTube and brands." },
      { img: "podcaststudio.jpg", alt: "Podcast studio microphone", title: "Sound and audio", text: "Record clean sound and polish voices so your videos are easy to listen to." }
    ],
    aiTitle: "AI for creators",
    aiText: "Use practical AI tools to brainstorm ideas, write scripts and speed up parts of your production.",
    aiLogos: [["gpt.jpg", "ChatGPT"], ["claude.jpg", "Claude"]],
    plansEyebrow: "Choose your path",
    plansTitle: "Clear pricing. No sign up.",
    monthly: {
      tag: "Most popular", name: "Monthly Club", price: "UGX 50,000", per: "/ month",
      sub: "Learn with other Ugandan creators.",
      perks: ["Live group lessons online", "A WhatsApp study group with other members", "Your group link shows right after you pay", "Access lasts 30 days. Pay again to renew"],
      btn: "Pay UGX 50,000"
    },
    priv: {
      tag: "Personal", name: "Private Lessons with Ronald", price: "UGX 250,000", per: "",
      sub: "One-on-one teaching built around you.",
      perks: ["Private lessons taught by Ronald", "Ronald calls you on the number you enter", "Work on your own editing projects"],
      btn: "Pay UGX 250,000"
    },
    note: "You only type your phone number and pay with Mobile Money. The next page lets you pick your plan.",
    freeTitle: "Not ready to pay yet?",
    freeText: "Join the free channel for tips and updates. Everyone is welcome."
  };

  // [file name, description, shape]
  var GALLERY = [
    ["davinci.jpg", "DaVinci Resolve editing screen", "4/3"],
    ["videoediting.jpg", "Video editing on a computer", "4/5"],
    ["content.jpg", "Content creation collage", "4/5"],
    ["phone-camera.jpg", "Phone on a tripod filming", "4/5"],
    ["filmingwithphone.jpg", "Filming with a phone", "4/5"],
    ["podcaststudio.jpg", "Podcast studio", "4/5"],
    ["claude-handwithphone.jpg", "AI assistant on a phone", "4/3"]
  ];
  /* ============================ END OF EDIT BLOCK ============================ */

  var GSAP = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  var ST = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  var css = `
.vc{color:var(--text,#fff)}
.vc a{text-decoration:none}
.vc *{box-sizing:border-box}
.vc-top{max-width:1200px;margin:0 auto;padding:72px 24px 24px}
.vc-sec{max-width:1200px;margin:0 auto;padding:64px 24px}
.vc-eyebrow{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--red,#e10600);font-weight:700;margin-bottom:14px}
.vc-h1{font-size:clamp(36px,6vw,68px);line-height:1.04;letter-spacing:-2px;font-weight:700;margin-bottom:18px;max-width:900px}
.vc-h2{font-size:clamp(28px,4vw,42px);line-height:1.1;letter-spacing:-1.2px;font-weight:700;margin-bottom:12px}
.vc-lead{font-size:18px;color:var(--text-light,#ccc);max-width:600px;line-height:1.7}
.vc-actions{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0 22px}
.vc-btn{display:inline-block;background:var(--red,#e10600);color:#fff;font-weight:700;font-size:15px;padding:15px 26px;border:1px solid var(--red,#e10600);text-align:center;transition:opacity .2s,border-color .2s}
.vc-btn:hover{opacity:.85}
.vc-btn.vc-ghost{background:none;color:var(--text,#fff);border-color:var(--line,#333)}
.vc-btn.vc-ghost:hover{border-color:var(--text,#fff);opacity:1}
.vc-btn.vc-wa{background:none;color:var(--text,#fff);border-color:#25d366}
.vc-btn:focus-visible{outline:2px solid var(--red,#e10600);outline-offset:3px}
.vc-chips{display:flex;flex-wrap:wrap;gap:8px}
.vc-chip{border:1px solid var(--line,#333);border-radius:99px;padding:5px 13px;font-size:13px;color:var(--text-light,#ccc)}
.vc-gal{position:relative;overflow-x:clip;padding:10vh 0;display:flex;flex-direction:column;align-items:center;gap:8vh}
.vc-mark{position:sticky;top:42vh;height:0;width:100%;z-index:2;pointer-events:none;order:-1}
.vc-mark-in{position:absolute;left:0;top:-.6em;white-space:nowrap;font-size:clamp(56px,13vw,170px);font-weight:800;letter-spacing:-3px;line-height:1;color:#fff;mix-blend-mode:difference}
.vc-wrap{perspective:1200px;width:min(80vw,520px)}
.vc-img{display:block;width:100%;object-fit:cover;transform-style:preserve-3d;will-change:transform}
.vc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:32px}
.vc-card{background:var(--bg-card,#121212);border:1px solid var(--line,#262626);overflow:hidden}
.vc-card img,.vc-ai{display:block;width:100%;height:190px;object-fit:cover}
.vc-b{padding:22px}
.vc-b h3{font-size:19px;margin-bottom:6px}
.vc-b p{color:var(--text-muted,#999);font-size:15px}
.vc-ai{display:flex;gap:14px;align-items:center;justify-content:center;background:linear-gradient(135deg,#2a0402,#e10600 140%)}
.vc-ai img{width:96px;height:96px;object-fit:contain;background:#fff;padding:8px}
.vc-plans{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:32px;max-width:860px}
.vc-plan{background:var(--bg-card,#121212);border:1px solid var(--line,#262626);padding:32px 28px;display:flex;flex-direction:column}
.vc-plan.vc-hot{border-color:var(--red,#e10600)}
.vc-plan h3{font-size:20px}
.vc-plan>p{color:var(--text-muted,#999);font-size:15px}
.vc-amt{font-size:38px;font-weight:800;letter-spacing:-1.5px;margin:6px 0 10px}
.vc-amt small{font-size:15px;font-weight:400;color:var(--text-muted,#999);letter-spacing:0}
.vc-plan ul{list-style:none;margin:16px 0 26px;padding:0;display:grid;gap:10px;flex:1}
.vc-plan li{position:relative;padding-left:24px;font-size:15px;color:var(--text-light,#ccc)}
.vc-plan li::before{content:"\\2713";position:absolute;left:0;color:var(--red,#e10600);font-weight:800}
.vc-note{margin-top:18px;font-size:14px;color:var(--text-muted,#999)}
.vc-free{margin-top:20px;max-width:860px;border:1px solid #25d366;padding:22px 24px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between}
.vc-free b{display:block;font-size:17px}
.vc-free span{color:var(--text-muted,#999);font-size:14px}
.vc-rv{opacity:0;transform:translateY(22px);transition:opacity .6s,transform .6s}
.vc-rv.vc-in{opacity:1;transform:none}
@media(max-width:860px){.vc-plans{grid-template-columns:1fr}}
@media(max-width:520px){.vc-top{padding:48px 18px 16px}.vc-sec{padding:44px 18px}.vc-btn{width:100%}}
@media(prefers-reduced-motion:reduce){.vc-rv{opacity:1;transform:none;transition:none}}

/* ---------- Popup CSS ---------- */
.vc-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.75)}
.vc-overlay.vc-open{display:flex}
.vc-box{position:relative;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow-y:auto;background:var(--bg-card,#0f0f0f);color:var(--text,#fff);border:1px solid var(--red,#e10600);padding:28px 24px;animation:vc-in .25s ease-out}
@keyframes vc-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.vc-close{position:absolute;top:6px;right:6px;width:44px;height:44px;background:none;border:0;color:var(--text-muted,#888);font-size:26px;line-height:1;cursor:pointer}
.vc-close:hover{color:var(--text,#fff)}
.vc-pop-eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--red,#e10600);margin-bottom:8px;padding-right:36px}
.vc-pop-title{font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1.15;margin-bottom:8px}
.vc-pop-lead{color:var(--text-light,#ccc);font-size:15px;margin-bottom:18px}
.vc-pop-plan{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border:1px solid var(--line,#222);padding:14px;margin-bottom:10px}
.vc-pop-plan b{display:block;font-size:15px}
.vc-pop-plan span{display:block;font-size:13px;color:var(--text-muted,#888)}
.vc-pop-price{white-space:nowrap;font-weight:700;font-size:15px;text-align:right}
.vc-pop-btn{display:block;text-align:center;text-decoration:none;background:var(--red,#e10600);color:#fff;font-weight:700;font-size:15px;padding:15px;margin-top:16px}
.vc-pop-btn:hover{opacity:.85}
.vc-link{display:block;width:100%;text-align:center;background:none;border:0;color:var(--text-muted,#888);font:inherit;font-size:14px;padding:12px;margin-top:4px;cursor:pointer;text-decoration:underline}
.vc-link:hover{color:var(--text,#fff)}
.vc-overlay a:focus-visible,.vc-overlay button:focus-visible{outline:2px solid var(--red,#e10600);outline-offset:3px}
`;

  function plan(p, hot) {
    return '<article class="vc-plan vc-rv' + (hot ? " vc-hot" : "") + '"><div class="vc-eyebrow" style="margin-bottom:8px">' + esc(p.tag) + "</div>" +
      "<h3>" + esc(p.name) + '</h3><div class="vc-amt">' + esc(p.price) + (p.per ? " <small>" + esc(p.per) + "</small>" : "") + "</div>" +
      "<p>" + esc(p.sub) + "</p><ul>" + p.perks.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      '<a class="vc-btn' + (hot ? "" : " vc-ghost") + '" href="#" data-pay>' + esc(p.btn) + "</a></article>";
  }

  function build() {
    var T = TEXT;
    return '<div class="vc-top"><p class="vc-eyebrow">' + esc(T.eyebrow) + '</p><h2 class="vc-h1">' + esc(T.title) + '</h2><p class="vc-lead">' + esc(T.lead) + "</p>" +
      '<div class="vc-actions"><a class="vc-btn" href="#" data-pay>' + esc(T.payMonthly) + '</a><a class="vc-btn vc-ghost" href="#vc-plans">' + esc(T.payPrivate) + "</a>" +
      '<a class="vc-btn vc-wa" href="' + esc(CHANNEL_URL) + '" target="_blank" rel="noopener">' + esc(T.channel) + "</a></div>" +
      '<div class="vc-chips">' + T.chips.map(function (c) { return '<span class="vc-chip">' + esc(c) + "</span>"; }).join("") + "</div></div>" +

      '<div class="vc-gal" aria-label="Course photos"><div class="vc-mark" aria-hidden="true"><div class="vc-mark-in">' + esc(T.marquee) + "</div></div>" +
      GALLERY.map(function (g) {
        return '<div class="vc-wrap"><img class="vc-img" src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '" loading="lazy" style="aspect-ratio:' + g[2] + '"></div>';
      }).join("") + "</div>" +

      '<div class="vc-sec"><p class="vc-eyebrow vc-rv">' + esc(T.learnEyebrow) + '</p><h2 class="vc-h2 vc-rv">' + esc(T.learnTitle) + '</h2><div class="vc-grid">' +
      T.cards.map(function (c) {
        return '<article class="vc-card vc-rv"><img src="' + esc(c.img) + '" alt="' + esc(c.alt) + '" loading="lazy"><div class="vc-b"><h3>' + esc(c.title) + "</h3><p>" + esc(c.text) + "</p></div></article>";
      }).join("") +
      '<article class="vc-card vc-rv"><div class="vc-ai">' + T.aiLogos.map(function (l) { return '<img src="' + esc(l[0]) + '" alt="' + esc(l[1]) + '" loading="lazy">'; }).join("") +
      '</div><div class="vc-b"><h3>' + esc(T.aiTitle) + "</h3><p>" + esc(T.aiText) + "</p></div></article></div></div>" +

      '<div class="vc-sec" id="vc-plans" style="padding-top:24px"><p class="vc-eyebrow vc-rv">' + esc(T.plansEyebrow) + '</p><h2 class="vc-h2 vc-rv">' + esc(T.plansTitle) + '</h2><div class="vc-plans">' +
      plan(T.monthly, true) + plan(T.priv, false) + "</div>" +
      '<p class="vc-note">' + esc(T.note) + "</p>" +
      '<div class="vc-free vc-rv"><div><b>' + esc(T.freeTitle) + "</b><span>" + esc(T.freeText) + '</span></div><a class="vc-btn vc-wa" href="' + esc(CHANNEL_URL) + '" target="_blank" rel="noopener">' + esc(T.channel) + "</a></div></div>";
  }

  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  function animate() {
    var gsap = window.gsap, Trigger = window.ScrollTrigger;
    gsap.registerPlugin(Trigger);
    var light = window.innerWidth < 700; // skip the colour fade on small phones to keep scrolling smooth

    document.querySelectorAll(".vc-img").forEach(function (item) {
      Trigger.create({
        trigger: item, start: "top bottom+=20%", end: "bottom top-=20%", scrub: true,
        onUpdate: function (self) {
          var p = self.progress, c = Math.cos(p * Math.PI), s = Math.sin(p * Math.PI);
          gsap.set(item, {
            rotationX: Math.sign(c) * Math.pow(Math.abs(c), 0.6) * 90,
            z: Math.pow(s, 8) * -800,
            yPercent: 1 + c * c * -40
          });
          if (!light) { var f = Math.pow(s, 3); item.style.filter = "saturate(" + f + ") brightness(" + f + ")"; }
        }
      });
    });

    gsap.fromTo(".vc-mark-in", { x: "100vw" }, {
      x: "-100%", ease: "none",
      scrollTrigger: { trigger: ".vc-gal", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
    });

    window.addEventListener("load", function () { Trigger.refresh(); });
  }

  function start() {
    if (document.getElementById("course")) return;

    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.id = "course";
    root.className = "vc";
    root.innerHTML = build();

    // Put the course right under the menu, above your current first section
    var hero = document.querySelector(".hero");
    var nav = document.querySelector("nav");
    if (hero && hero.parentNode) hero.parentNode.insertBefore(root, hero);
    else if (nav && nav.parentNode) nav.parentNode.insertBefore(root, nav.nextSibling);
    else document.body.insertBefore(root, document.body.firstChild);

    root.querySelectorAll("[data-pay]").forEach(function (a) { a.href = COURSE_URL; });

    // A missing picture hides itself instead of showing a broken icon
    root.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        var box = img.closest(".vc-wrap") || img;
        box.style.display = "none";
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });

    var items = root.querySelectorAll(".vc-rv");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("vc-in"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add("vc-in"); });
    }

    // Animation only if the visitor allows motion; otherwise the photos stay flat and readable
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      load(GSAP).then(function () { return load(ST); }).then(animate).catch(function () {});
    }

    // ---------- Popup ----------
    var popupHtml =
      '<div class="vc-overlay" id="vc-popup" role="dialog" aria-modal="true" aria-labelledby="vc-title">' +
      '<div class="vc-box">' +
      '<button class="vc-close" type="button" aria-label="Close" data-vc-close>&times;</button>' +
      '<p class="vc-pop-eyebrow">New: video editing course</p>' +
      '<h2 class="vc-pop-title" id="vc-title">Learn video editing. Pay with just your phone number.</h2>' +
      '<p class="vc-pop-lead">No account needed. Pick a plan and pay with Mobile Money.</p>' +
      '<div class="vc-pop-plan"><div><b>Monthly Club</b><span>Lessons plus a WhatsApp study group</span></div>' +
      '<div class="vc-pop-price">UGX 50,000<span>per month</span></div></div>' +
      '<div class="vc-pop-plan"><div><b>Private Lessons</b><span>One-on-one with Ronald</span></div>' +
      '<div class="vc-pop-price">UGX 250,000</div></div>' +
      '<a class="vc-pop-btn" id="vc-go" href="__URL__">Choose a plan</a>' +
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
        root.scrollIntoView({ behavior: "smooth" });
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
