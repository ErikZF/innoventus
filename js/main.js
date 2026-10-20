/* ===== DATOS EDITABLES: cambia solo esta sección ===== */
const CONFIG = {
  instagram: "https://www.instagram.com/",   // <- pega aquí el enlace de Instagram de INNOVENTUS
  email: "contacto@innoventus.com",
  phone: "+000 0000 0000",
  formEndpoint: ""  // <- opcional: URL de Formspree (u otro servicio) para recibir los mensajes del formulario
};
/* ===================================================== */

const MARK = '<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#31E3E5"/><stop offset="1" stop-color="#08BCC5"/></linearGradient></defs><rect x="8" y="4" width="12" height="54" fill="#017084"/><rect x="44" y="4" width="12" height="54" fill="#014C62"/><path class="rb" d="M10 4h13c14 9 28 24 34 42 1 8-5 13-12 11C31 42 19 22 10 4z" fill="url(#g1)"/><path class="gl" pathLength="100" d="M23 4c14 9 28 24 34 42" fill="none" stroke="#ECB643" stroke-width="1.6" stroke-linecap="round"/></svg>';
const IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>';
const page = location.pathname.split("/").pop() || "index.html";
const links = [["index.html","Inicio"],["servicios.html","Servicios"],["nosotros.html","Nosotros"],["contacto.html","Contáctenos"]];
const logo = `<a class="logo" href="index.html" aria-label="INNOVENTUS, inicio">${MARK}<span class="word">INNO<i>V</i>ENTUS</span></a>`;

/* Encabezado y pie (se editan aquí una sola vez y salen en todas las páginas) */
document.getElementById("site-header").innerHTML =
  `<div class="wrap bar">${logo}<button class="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button><nav>${links.map(([h,t]) => `<a href="${h}"${h===page?' class="on"':''}>${t}</a>`).join("")}</nav></div>`;
document.getElementById("site-footer").innerHTML =
  `<div class="wrap"><div class="fg"><div>${logo}<p style="margin:1rem 0">Asesoría legal formal y cercana, 100% virtual.</p><a class="ig" data-ig target="_blank" rel="noopener" aria-label="Instagram de INNOVENTUS">${IG}</a></div><div><h4>Navegación</h4>${links.map(([h,t]) => `<a href="${h}" style="display:block;margin:.3rem 0">${t}</a>`).join("")}</div><div><h4>Contacto</h4><a data-mail style="display:block"></a><a data-tel style="display:block;margin-top:.3rem"></a></div></div><p class="cp">© ${new Date().getFullYear()} INNOVENTUS. Todos los derechos reservados.</p></div>`;

/* Rellenar datos de CONFIG en toda la página */
document.querySelectorAll("[data-mark]").forEach(e => e.innerHTML = MARK);
document.querySelectorAll("[data-ig]").forEach(a => { a.href = CONFIG.instagram; if (a.dataset.ig === "icon") a.innerHTML = IG; });
document.querySelectorAll("[data-mail]").forEach(a => { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });
document.querySelectorAll("[data-tel]").forEach(a => { a.href = "tel:" + CONFIG.phone.replace(/\s/g, ""); a.textContent = CONFIG.phone; });

/* Sombra del encabezado y menú móvil */
const hd = document.querySelector("header"), bg = document.querySelector(".burger"), nv = document.querySelector("nav");
addEventListener("scroll", () => hd.classList.toggle("sc", scrollY > 10));
bg.onclick = () => bg.setAttribute("aria-expanded", nv.classList.toggle("open"));

/* Aparición suave de tarjetas al hacer scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
  setTimeout(() => { e.target.classList.remove("rv", "in"); e.target.style.transitionDelay = ""; }, 1300);
}), { threshold: .15 });
document.querySelectorAll(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 110 + "ms"; io.observe(el); });

/* Formulario de contacto */
const f = document.getElementById("contact-form");
if (f) f.addEventListener("submit", async ev => {
  ev.preventDefault();
  const ok = document.getElementById("form-ok");
  let valid = true;
  f.querySelectorAll("[required]").forEach(i => { const bad = !i.checkValidity(); i.classList.toggle("er", bad); if (bad) valid = false; });
  ok.style.borderColor = valid ? "" : "#C0392B";
  if (!valid) { ok.textContent = "Revisa los campos marcados en rojo para poder enviar tu consulta."; ok.className = "ok show"; return; }
  try {
    if (CONFIG.formEndpoint) {
      const r = await fetch(CONFIG.formEndpoint, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error();
    }
    ok.textContent = "¡Gracias! Recibimos tu consulta y te responderemos a la brevedad."; f.reset();
  } catch { ok.textContent = "No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por correo."; ok.style.borderColor = "#C0392B"; }
  ok.className = "ok show";
});
