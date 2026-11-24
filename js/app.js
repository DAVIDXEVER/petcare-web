/* PetCare — aplicación de una sola página con rutas por hash (#/...).
   Demo académica: los datos se guardan en localStorage, no hay servidor. */
(() => {
  'use strict';

  /* ---------- utilidades ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '$' + Number(n).toLocaleString('es-CO');
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const LS = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* almacenamiento no disponible */ } }
  };
  const byId = id => PROVEEDORES.find(p => p.id === id);
  const desde = p => Math.min(...p.servicios.map(s => s.precio));

  const ICON = {
    paw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>',
    scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10 12 3l9 7"/><path d="M5 9v12h14V9"/><path d="M10 21v-6h4v6"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  /* ---------- "base de datos" local ---------- */
  const DB = {
    usuarios: () => LS.get('pc_usuarios', []),
    saveUsuarios: v => LS.set('pc_usuarios', v),
    sesion: () => LS.get('pc_sesion', null),
    setSesion: v => LS.set('pc_sesion', v),
    reservas: () => LS.get('pc_reservas', []),
    saveReservas: v => LS.set('pc_reservas', v)
  };

  /* ---------- estructura común ---------- */
  const NAV = [
    ['#/', 'Inicio', /^$|^inicio$/],
    ['#/buscar', 'Buscar servicios', /^buscar$|^proveedor|^reserva|^confirmacion/],
    ['#/mis-reservas', 'Mis reservas', /^mis-reservas$/],
    ['#/panel', 'Panel proveedor', /^panel$/]
  ];

  function renderChrome(path) {
    const u = DB.sesion();
    const pendientes = u ? DB.reservas().filter(r => r.email === u.email && r.estado === 'pendiente').length : 0;
    $('#app-header').innerHTML = `
      <header class="topbar">
        <a class="brand" href="#/" aria-label="PetCare, ir al inicio">${ICON.paw}<span>PetCare</span></a>
        <form class="search" role="search" id="searchForm">
          <input type="search" id="q" placeholder="Buscar servicio, baño, paseo..." aria-label="Buscar servicio">
        </form>
        <a class="badge" href="#/mis-reservas" aria-label="Reservas pendientes: ${pendientes}">${ICON.calendar}<span>${pendientes}</span></a>
        <a class="user" href="${u ? '#/mis-reservas' : '#/login'}" aria-label="${u ? 'Mi cuenta: ' + esc(u.nombre) : 'Iniciar sesión'}">${ICON.user}</a>
      </header>
      <nav class="mainnav" aria-label="Principal">
        ${NAV.map(([href, label, re]) => `<a href="${href}"${re.test(path) ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>`;
    $('#app-footer').innerHTML = `
      <footer class="footer">
        <span>© 2026 PetCare · Proyecto académico</span>
        <a href="https://wa.me/" target="_blank" rel="noopener">${ICON.chat}Contáctanos</a>
      </footer>`;
    $('#searchForm').addEventListener('submit', e => {
      e.preventDefault();
      location.hash = '#/buscar?q=' + encodeURIComponent($('#q').value.trim());
    });
  }

  /* ---------- componentes ---------- */
  const logo = p => `<div class="logo-box" data-initials="${esc(p.iniciales)}"><img src="assets/logos/${p.id}.png" alt="Logo de ${esc(p.nombre)}" onerror="this.remove()"></div>`;
  const stars = n => `<span class="stars" aria-label="${n} de 5 estrellas">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;
  const estadoTag = e => `<span class="status ${esc(e)}">Estado: ${esc(e)}</span>`;

  const cardCategoria = c => `
    <article class="card center">
      <div class="icon-circle">${ICON[c.icon]}</div>
      <h3>${esc(c.nombre)}</h3>
      <p class="tag">${esc(c.desc)}</p>
      <a class="btn small" href="#/buscar?cat=${c.id}">Ver servicios</a>
    </article>`;

  const cardProveedorDestacado = p => `
    <article class="card center">
      ${logo(p)}
      <h3>${esc(p.nombre)}</h3>
      <p class="tag">${esc(p.tipo)}</p>
      <a class="btn small" href="#/proveedor/${p.id}">Ver perfil</a>
    </article>`;

  const cardResultado = p => `
    <article class="card">
      <h3>${esc(p.nombre)}</h3>
      <p class="muted">${esc(p.descripcion)}</p>
      <p>Ubicación: ${esc(p.ubicacion)}</p>
      <p class="price">Precio: Desde ${money(desde(p))}</p>
      <div class="actions"><a class="btn small" href="#/proveedor/${p.id}" style="flex:0 0 auto">Ver perfil</a></div>
    </article>`;

  const cardReserva = (r, modo) => {
    const p = byId(r.proveedorId);
    const abierta = r.estado === 'pendiente' || r.estado === 'confirmada';
    let acciones = '';
    if (modo === 'cliente' && abierta) acciones = `<button class="btn danger" data-action="cancelar" data-id="${r.id}">Cancelar</button>`;
    if (modo === 'proveedor' && r.estado === 'pendiente') {
      acciones = `<button class="btn success" data-action="confirmar" data-id="${r.id}">Confirmar</button>
                  <button class="btn danger" data-action="rechazar" data-id="${r.id}">Rechazar</button>`;
    }
    return `
      <article class="card">
        <h3>${esc(r.servicio)}</h3>
        <p class="muted">${modo === 'cliente' ? 'Proveedor: ' + esc(p ? p.nombre : r.proveedorId) : 'Cliente: ' + esc(r.nombre)}</p>
        <p class="muted">Fecha: ${esc(r.fecha)} - ${esc(r.hora)}</p>
        <p>${estadoTag(r.estado)}</p>
        ${acciones ? `<div class="actions">${acciones}</div>` : ''}
      </article>`;
  };

  /* ---------- acceso ---------- */
  function requireLogin(path) {
    if (DB.sesion()) return true;
    try { sessionStorage.setItem('pc_next', '#/' + path); } catch { /* ignorar */ }
    location.hash = '#/login';
    return false;
  }

  /* ---------- vistas ---------- */
  function vInicio() {
    return `
      <section class="hero">
        <h1>Hola, ${DB.sesion() ? esc(DB.sesion().nombre.split(' ')[0]) : 'invitado'}</h1>
        <p>¿Qué necesita tu mascota hoy?</p>
        <a class="btn accent" href="#/buscar">Buscar servicios</a>
      </section>
      <div class="wrap stack">
        <h2>Categorías principales</h2>
        <div class="grid cols-4">${CATEGORIAS.map(cardCategoria).join('')}</div>
        <h2 style="margin-top:12px">Proveedores destacados</h2>
        <div class="grid cols-4">${PROVEEDORES.map(cardProveedorDestacado).join('')}</div>
      </div>`;
  }

  function vLogin() {
    return `
      <div class="wrap">
        <form class="form-card" id="loginForm" novalidate>
          <h1>Iniciar sesión</h1>
          <div class="field"><label for="email">Correo electrónico</label>
            <input id="email" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" required></div>
          <div class="field"><label for="pass">Contraseña</label>
            <input id="pass" type="password" autocomplete="current-password" required></div>
          <p class="error" id="err" role="alert"></p>
          <button class="btn block" type="submit">Entrar</button>
          <p class="muted" style="text-align:center">¿No tienes cuenta? <a href="#/registro" style="color:var(--primary);font-weight:700">Regístrate aquí</a></p>
        </form>
      </div>`;
  }

  function vRegistro() {
    return `
      <div class="wrap">
        <form class="form-card" id="regForm" novalidate>
          <h1>Crear cuenta</h1>
          <div class="notice">Demo académica: no uses una contraseña real. Los datos solo se guardan en este navegador.</div>
          <div class="field"><label for="nombre">Nombre</label><input id="nombre" type="text" autocomplete="name" required></div>
          <div class="field"><label for="email">Correo electrónico</label><input id="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="pass">Contraseña (mínimo 8 caracteres)</label><input id="pass" type="password" autocomplete="new-password" required></div>
          <div class="field"><label for="pass2">Confirmar contraseña</label><input id="pass2" type="password" autocomplete="new-password" required></div>
          <fieldset class="field"><legend>Tipo de cuenta</legend>
            <div class="radios">
              <label><input type="radio" name="tipo" value="cliente" checked> Cliente</label>
              <label><input type="radio" name="tipo" value="proveedor"> Proveedor</label>
            </div>
          </fieldset>
          <p class="error" id="err" role="alert"></p>
          <button class="btn block" type="submit">Registrarme</button>
          <p class="muted" style="text-align:center">¿Ya tienes cuenta? <a href="#/login" style="color:var(--primary);font-weight:700">Inicia sesión</a></p>
        </form>
      </div>`;
  }

  function vBuscar(params) {
    const cat = params.get('cat') || '';
    const q = params.get('q') || '';
    return `
      <div class="wrap">
        <h1>Buscar servicios</h1>
        <form class="filters" id="filtros">
          <div class="field"><label for="fcat">Categoría</label>
            <select id="fcat"><option value="">Todas las categorías</option>
              ${CATEGORIAS.map(c => `<option value="${c.id}"${c.id === cat ? ' selected' : ''}>${esc(c.nombre)}</option>`).join('')}
            </select></div>
          <div class="field"><label for="floc">Ubicación</label>
            <input id="floc" type="text" placeholder="Barrio o localidad"></div>
          <button class="btn" type="submit">Buscar</button>
        </form>
        <div id="resultados" class="grid cols-2" aria-live="polite"></div>
      </div>`;
  }

  let seleccion = { proveedor: null, idx: null };
  function vProveedor(id) {
    const p = byId(id);
    if (!p) return vNoEncontrado();
    if (seleccion.proveedor !== id) seleccion = { proveedor: id, idx: null };
    return `
      <div class="wrap stack">
        <div><a class="btn accent small" href="#/buscar">← Volver</a></div>
        <header>
          <h1>${esc(p.nombre)}</h1>
          <p>Categoría: ${esc(CATEGORIAS.find(c => c.id === p.categoria).nombre)}</p>
          <p>Ubicación: ${esc(p.ubicacion)}</p>
          <p>${esc(p.descripcion)}</p>
          <p class="price">Desde ${money(desde(p))}</p>
        </header>
        <h2>Servicios disponibles</h2>
        <div class="grid cols-4" id="servicios">
          ${p.servicios.map((s, i) => `
            <article class="card center service${seleccion.idx === i ? ' selected' : ''}">
              <h3>${esc(s.nombre)}</h3>
              <p class="price">${money(s.precio)}</p>
              <button class="btn small" data-action="seleccionar" data-idx="${i}" aria-pressed="${seleccion.idx === i}">${seleccion.idx === i ? 'Seleccionado' : 'Seleccionar'}</button>
            </article>`).join('')}
        </div>
        <h2>Reseñas</h2>
        <div class="card reviews">
          ${p.resenas.map(r => `<p>${stars(r.estrellas)} "${esc(r.texto)}" - ${esc(r.autor)}</p>`).join('')}
        </div>
        <p class="error" id="err" role="alert"></p>
        <div><button class="btn mobile-block" data-action="reservar" data-id="${p.id}">Reservar servicio</button></div>
      </div>`;
  }

  function vReserva(id, idx, path) {
    const p = byId(id);
    const s = p && p.servicios[Number(idx)];
    if (!s) return vNoEncontrado();
    if (!requireLogin(path)) return '';
    return `
      <div class="wrap stack">
        <div><a class="btn accent small" href="#/proveedor/${p.id}">← Volver</a></div>
        <h1>Selecciona fecha y hora</h1>
        <p class="muted">Servicio: ${esc(s.nombre)} (${money(s.precio)}) | Proveedor: ${esc(p.nombre)}</p>
        <form class="form-card" id="resForm" data-proveedor="${p.id}" data-idx="${idx}" novalidate style="margin:0">
          <div class="field"><label for="fecha">Fecha</label><input id="fecha" type="date" min="${todayISO()}" required></div>
          <div class="field"><label for="hora">Hora</label>
            <select id="hora" required><option value="">Selecciona una hora</option>
              ${HORAS.map(h => `<option>${h}</option>`).join('')}</select></div>
          <p class="error" id="err" role="alert"></p>
          <button class="btn block" type="submit">Confirmar reserva</button>
        </form>
      </div>`;
  }

  function vConfirmacion(id, path) {
    if (!requireLogin(path)) return '';
    const r = DB.reservas().find(x => x.id === id && x.email === DB.sesion().email);
    if (!r) return vNoEncontrado();
    const p = byId(r.proveedorId);
    return `
      <div class="wrap stack" style="max-width:560px;text-align:center">
        <div class="check">${ICON.check}</div>
        <h1>Reserva confirmada</h1>
        <div class="card" style="text-align:left">
          <p>Servicio: ${esc(r.servicio)}</p>
          <p>Proveedor: ${esc(p ? p.nombre : r.proveedorId)}</p>
          <p>Fecha: ${esc(r.fecha)}</p>
          <p>Hora: ${esc(r.hora)}</p>
          <p>${estadoTag(r.estado)}</p>
        </div>
        <p class="muted">Tu reserva quedó registrada. El proveedor la confirmará pronto (notificación simulada en esta demo).</p>
        <div class="actions" style="justify-content:center">
          <a class="btn" href="#/mis-reservas" style="flex:0 1 auto">Ver mis reservas</a>
          <a class="btn accent" href="#/" style="flex:0 1 auto">Volver al inicio</a>
        </div>
      </div>`;
  }

  function vMisReservas(path) {
    if (!requireLogin(path)) return '';
    const u = DB.sesion();
    const lista = DB.reservas().filter(r => r.email === u.email);
    return `
      <div class="wrap stack">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <h1 style="margin:0">Mis reservas</h1>
          <button class="btn danger small" data-action="salir">Cerrar sesión</button>
        </div>
        ${lista.length ? `<div class="grid cols-2" id="listaRes">${lista.map(r => cardReserva(r, 'cliente')).join('')}</div>`
          : `<div class="empty card">Aún no tienes reservas. <a href="#/buscar" style="color:var(--primary);font-weight:700">Busca un servicio</a>.</div>`}
      </div>`;
  }

  function vPanel(path) {
    if (!requireLogin(path)) return '';
    const u = DB.sesion();
    if (u.tipo !== 'proveedor') {
      return `<div class="wrap"><div class="empty card"><h2>Panel del proveedor</h2>
        <p>Esta sección es solo para cuentas de tipo proveedor.</p>
        <p><a class="btn" href="#/registro">Crear cuenta de proveedor</a></p></div></div>`;
    }
    const lista = DB.reservas();
    return `
      <div class="wrap stack">
        <div><h1>Panel del proveedor</h1><p class="muted">Gestiona las reservas recibidas</p></div>
        ${lista.length ? `<div class="grid cols-2" id="listaRes">${lista.map(r => cardReserva(r, 'proveedor')).join('')}</div>`
          : `<div class="empty card">Todavía no hay reservas recibidas.</div>`}
      </div>`;
  }

  function vNoEncontrado() {
    return `<div class="wrap"><div class="empty card"><h2>No encontramos esta página</h2><p><a class="btn" href="#/">Ir al inicio</a></p></div></div>`;
  }

  /* ---------- comportamiento de cada vista ---------- */
  function setError(msg) { const e = $('#err'); if (e) e.textContent = msg; }
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function bindLogin() {
    const f = $('#loginForm'); if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const email = $('#email').value.trim().toLowerCase();
      const pass = $('#pass').value;
      if (!emailOk(email) || !pass) return setError('Escribe un correo válido y tu contraseña.');
      const u = DB.usuarios().find(x => x.email === email && x.pass === pass);
      if (!u) return setError('Correo o contraseña incorrectos.');
      DB.setSesion({ nombre: u.nombre, email: u.email, tipo: u.tipo });
      let next = '#/';
      try { next = sessionStorage.getItem('pc_next') || '#/'; sessionStorage.removeItem('pc_next'); } catch { /* ignorar */ }
      location.hash = next;
    });
  }

  function bindRegistro() {
    const f = $('#regForm'); if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const nombre = $('#nombre').value.trim();
      const email = $('#email').value.trim().toLowerCase();
      const pass = $('#pass').value, pass2 = $('#pass2').value;
      const tipo = f.querySelector('input[name="tipo"]:checked').value;
      if (nombre.length < 2) return setError('Escribe tu nombre.');
      if (!emailOk(email)) return setError('Escribe un correo válido.');
      if (pass.length < 8) return setError('La contraseña debe tener mínimo 8 caracteres.');
      if (pass !== pass2) return setError('Las contraseñas no coinciden.');
      const usuarios = DB.usuarios();
      if (usuarios.some(u => u.email === email)) return setError('Ya existe una cuenta con ese correo.');
      usuarios.push({ nombre, email, pass, tipo });
      DB.saveUsuarios(usuarios);
      DB.setSesion({ nombre, email, tipo });
      location.hash = '#/';
    });
  }

  function bindBuscar(params) {
    const lista = $('#resultados'); if (!lista) return;
    const q0 = (params.get('q') || '').toLowerCase();
    const pintar = () => {
      const cat = $('#fcat').value;
      const loc = $('#floc').value.trim().toLowerCase();
      const res = PROVEEDORES.filter(p =>
        (!cat || p.categoria === cat) &&
        (!loc || p.ubicacion.toLowerCase().includes(loc)) &&
        (!q0 || [p.nombre, p.tipo, p.descripcion, ...p.servicios.map(s => s.nombre)].join(' ').toLowerCase().includes(q0)));
      lista.innerHTML = res.length ? res.map(cardResultado).join('')
        : '<div class="empty card" style="grid-column:1/-1">No encontramos servicios con esos filtros.</div>';
    };
    $('#filtros').addEventListener('submit', e => { e.preventDefault(); pintar(); });
    $('#fcat').addEventListener('change', pintar);
    pintar();
  }

  function bindReserva() {
    const f = $('#resForm'); if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const fecha = $('#fecha').value, hora = $('#hora').value;
      if (!fecha || !hora) return setError('Selecciona una fecha y una hora.');
      if (fecha < todayISO()) return setError('La fecha no puede estar en el pasado.');
      const p = byId(f.dataset.proveedor), s = p.servicios[Number(f.dataset.idx)];
      const reservas = DB.reservas();
      if (reservas.some(r => r.proveedorId === p.id && r.fecha === fecha && r.hora === hora && r.estado !== 'cancelada' && r.estado !== 'rechazada')) {
        return setError('Ese horario ya está ocupado. Elige otra hora.');
      }
      const u = DB.sesion();
      const r = { id: Date.now().toString(36), email: u.email, nombre: u.nombre, proveedorId: p.id, servicio: s.nombre, fecha, hora, estado: 'pendiente' };
      reservas.push(r);
      DB.saveReservas(reservas);
      location.hash = '#/confirmacion/' + r.id;
    });
  }

  /* acciones por delegación de eventos */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]'); if (!el) return;
    const a = el.dataset.action;
    if (a === 'seleccionar') {
      seleccion.idx = Number(el.dataset.idx);
      render();
    } else if (a === 'reservar') {
      if (seleccion.idx === null) return setError('Primero selecciona un servicio.');
      location.hash = `#/reserva/${el.dataset.id}/${seleccion.idx}`;
    } else if (a === 'salir') {
      DB.setSesion(null);
      location.hash = '#/';
      render();
    } else if (['cancelar', 'confirmar', 'rechazar'].includes(a)) {
      const nuevo = { cancelar: 'cancelada', confirmar: 'confirmada', rechazar: 'rechazada' }[a];
      const reservas = DB.reservas();
      const r = reservas.find(x => x.id === el.dataset.id);
      if (r) { r.estado = nuevo; DB.saveReservas(reservas); render(); }
    }
  });

  /* ---------- enrutador ---------- */
  function render() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, qs] = raw.split('?');
    const params = new URLSearchParams(qs || '');
    const m = re => path.match(re);
    let html, after = () => {}, titulo = 'PetCare';
    let r;
    if (/^$|^inicio$/.test(path)) { html = vInicio(); titulo = 'Inicio'; }
    else if (path === 'login') { html = vLogin(); after = bindLogin; titulo = 'Iniciar sesión'; }
    else if (path === 'registro') { html = vRegistro(); after = bindRegistro; titulo = 'Registro'; }
    else if (path === 'buscar') { html = vBuscar(params); after = () => bindBuscar(params); titulo = 'Buscar servicios'; }
    else if ((r = m(/^proveedor\/([\w-]+)$/))) { html = vProveedor(r[1]); titulo = 'Proveedor'; }
    else if ((r = m(/^reserva\/([\w-]+)\/(\d+)$/))) { html = vReserva(r[1], r[2], path); after = bindReserva; titulo = 'Reservar'; }
    else if ((r = m(/^confirmacion\/([\w-]+)$/))) { html = vConfirmacion(r[1], path); titulo = 'Reserva confirmada'; }
    else if (path === 'mis-reservas') { html = vMisReservas(path); titulo = 'Mis reservas'; }
    else if (path === 'panel') { html = vPanel(path); titulo = 'Panel del proveedor'; }
    else html = vNoEncontrado();
    if (html === '') return; // redirigido a login
    renderChrome(path);
    $('#main').innerHTML = html;
    document.title = titulo + ' — PetCare';
    after();
  }

  let lastPath = null;
  window.addEventListener('hashchange', () => {
    render();
    const p = location.hash.split('?')[0];
    if (p !== lastPath) { window.scrollTo(0, 0); $('#main').focus({ preventScroll: true }); lastPath = p; }
  });
  render();
  lastPath = location.hash.split('?')[0];
})();
