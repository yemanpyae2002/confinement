/* ConfinementFinderSG — nav, filters, compare, quiz, forms, lazy maps. Vanilla, no deps. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- mobile nav ---------------- */
  var burger = $(".burger"), nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------------- listing filters ---------------- */
  var grid = $("#listing-grid");
  if (grid) {
    var cards = $$("[data-listing]", grid);
    var state = { region: "", cat: "", tags: [], sort: "reviews" };

    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var okR = !state.region || c.dataset.region === state.region;
        var okC = !state.cat || c.dataset.cat === state.cat;
        var ctags = (c.dataset.tags || "").split(",");
        var okT = state.tags.every(function (t) { return ctags.indexOf(t) > -1; });
        var vis = okR && okC && okT;
        c.hidden = !vis;
        if (vis) shown++;
      });
      var cEl = $("#count-n"); if (cEl) cEl.textContent = shown;
      var nr = $("#no-results"); if (nr) nr.classList.toggle("show", shown === 0);
      var cl = $("#clear-filters");
      if (cl) cl.hidden = !(state.region || state.cat || state.tags.length);
    }

    function sortCards(key) {
      var sorted = cards.slice().sort(function (a, b) {
        if (key === "rating") {
          var d = parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
          return d || parseInt(b.dataset.reviews, 10) - parseInt(a.dataset.reviews, 10);
        }
        if (key === "name") return a.dataset.name.localeCompare(b.dataset.name);
        return parseInt(b.dataset.reviews, 10) - parseInt(a.dataset.reviews, 10);
      });
      sorted.forEach(function (c) { grid.appendChild(c); });
    }

    $$("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.dataset.filter, val = btn.dataset.value;
        if (kind === "tag") {
          var i = state.tags.indexOf(val);
          if (i > -1) { state.tags.splice(i, 1); btn.setAttribute("aria-pressed", "false"); }
          else { state.tags.push(val); btn.setAttribute("aria-pressed", "true"); }
        } else {
          var on = state[kind] === val;
          state[kind] = on ? "" : val;
          $$('[data-filter="' + kind + '"]').forEach(function (b) {
            b.setAttribute("aria-pressed", (!on && b === btn) ? "true" : "false");
          });
        }
        apply();
      });
    });

    var sortSel = $("#sort");
    if (sortSel) sortSel.addEventListener("change", function () { sortCards(sortSel.value); });

    var clear = $("#clear-filters");
    if (clear) clear.addEventListener("click", function () {
      state = { region: "", cat: "", tags: [], sort: state.sort };
      $$("[data-filter]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      apply();
    });

    // Deep-link: /confinement-centres/?region=East or #tag=korean-style
    var qp = new URLSearchParams(location.search);
    ["region", "cat"].forEach(function (k) {
      var v = qp.get(k);
      if (!v) return;
      var b = $('[data-filter="' + k + '"][data-value="' + v.replace(/"/g, "") + '"]');
      if (b) b.click();
    });
    var qtag = qp.get("tag");
    if (qtag) { var tb = $('[data-filter="tag"][data-value="' + qtag.replace(/"/g, "") + '"]'); if (tb) tb.click(); }

    apply();
    sortCards(state.sort);
  }

  /* ---------------- compare selection ---------------- */
  var MAXC = 3, KEY = "cfsg_compare";
  function readSel() { try { return JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function writeSel(v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  var cmpBoxes = $$("[data-cmp]");
  if (cmpBoxes.length) {
    var bar = $("#cmpbar"), barN = $("#cmp-n"), barNames = $("#cmp-names"), barGo = $("#cmp-go");
    var sel = readSel();

    function syncBar() {
      if (!bar) return;
      bar.classList.toggle("show", sel.length > 0);
      if (barN) barN.textContent = sel.length;
      if (barNames) {
        barNames.textContent = sel.map(function (s) {
          var b = $('[data-cmp][value="' + s + '"]');
          return b ? b.dataset.name : s;
        }).join(", ");
      }
      if (barGo) barGo.href = "/compare/?ids=" + sel.join(",");
      cmpBoxes.forEach(function (b) {
        b.checked = sel.indexOf(b.value) > -1;
        b.disabled = !b.checked && sel.length >= MAXC;
      });
    }
    cmpBoxes.forEach(function (b) {
      b.addEventListener("change", function () {
        var i = sel.indexOf(b.value);
        if (b.checked && i === -1) { if (sel.length >= MAXC) { b.checked = false; return; } sel.push(b.value); }
        else if (!b.checked && i > -1) sel.splice(i, 1);
        writeSel(sel); syncBar();
      });
    });
    var cl2 = $("#cmp-clear");
    if (cl2) cl2.addEventListener("click", function () { sel = []; writeSel(sel); syncBar(); });
    syncBar();
  }

  /* ---------------- get matched quiz ---------------- */
  var quiz = $("#quiz");
  if (quiz) {
    var steps = $$(".q-step", quiz), answers = {};
    function go(n) {
      steps.forEach(function (s, i) { s.classList.toggle("on", i === n); });
      $$(".q-prog i", quiz).forEach(function (d, i) { d.classList.toggle("done", i <= n); });
      var recap = $("#q-recap");
      if (recap && n === steps.length - 1) {
        recap.innerHTML = "<strong>Your answers:</strong> due " + (answers.due || "—") +
          " · " + (answers.region || "—") + " · " + (answers.help || "—");
      }
    }
    $$("[data-q]", quiz).forEach(function (btn) {
      btn.addEventListener("click", function () {
        answers[btn.dataset.q] = btn.dataset.val;
        var f = $('[name="' + btn.dataset.q + '"]', quiz);
        if (f) f.value = btn.dataset.val;
        go(parseInt(btn.dataset.next, 10));
      });
    });
    $$("[data-back]", quiz).forEach(function (b) {
      b.addEventListener("click", function () { go(parseInt(b.dataset.back, 10)); });
    });
    go(0);
  }

  /* ---------------- forms (Web3Forms AJAX) ---------------- */
  $$("form[data-w3f]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = $(".formstatus", form) || form.appendChild(document.createElement("div"));
      status.className = "formstatus";
      var btn = $('button[type="submit"]', form), label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      var key = form.querySelector('[name="access_key"]');
      if (key && /YOUR_WEB3FORMS_KEY/.test(key.value)) {
        status.className = "formstatus err";
        status.textContent = "This form isn’t connected yet. Add your Web3Forms access key to enable enquiries.";
        if (btn) { btn.disabled = false; btn.textContent = label; }
        return;
      }
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.success) {
          form.reset();
          status.className = "formstatus ok";
          status.textContent = "Thank you — your enquiry is on its way. Expect a reply within 1–2 working days.";
          var f = $(".form-fields", form); if (f) f.hidden = true;
          if (btn) btn.hidden = true;
        } else { throw new Error(d.message || "failed"); }
      }).catch(function () {
        status.className = "formstatus err";
        status.textContent = "Sorry, something went wrong. Please email us at hello@confinementfindersg.com.";
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
  });

  /* ---------------- lazy map iframe ---------------- */
  var mapEl = $("[data-map]");
  if (mapEl && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, f = document.createElement("iframe");
        f.src = el.dataset.map;
        f.loading = "lazy"; f.title = el.dataset.title || "Map";
        f.referrerPolicy = "no-referrer-when-downgrade";
        f.setAttribute("allowfullscreen", "");
        el.appendChild(f);
        io.unobserve(el);
      });
    }, { rootMargin: "400px" });
    io.observe(mapEl);
  } else if (mapEl) {
    var f2 = document.createElement("iframe");
    f2.src = mapEl.dataset.map; f2.loading = "lazy"; f2.title = mapEl.dataset.title || "Map";
    mapEl.appendChild(f2);
  }
})();
