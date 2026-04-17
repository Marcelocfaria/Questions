/* ══════════════════════════════════════════════
   StudyRank — UI Helpers (Header, Progresso, Perfil)
   ══════════════════════════════════════════════ */

// Retorna o índice do nível atual baseado no total de questões
function getNivel(total) {
  let nivel = 0;
  for (let i = EVOLUCAO.length - 1; i >= 0; i--) {
    if (total >= EVOLUCAO[i].req) { nivel = i; break; }
  }
  return nivel;
}

// ── Header ──────────────────────────────────────
function atualizarHeader() {
  const total  = user.total || 0;
  const nivel  = getNivel(total);
  const animal = EVOLUCAO[nivel];

  document.getElementById('h-emoji').textContent      = animal.emoji;
  document.getElementById('h-name').textContent       = user.nome;
  document.getElementById('h-animal').textContent     = animal.nome;
  document.getElementById('h-streak-num').textContent = (user.streak || 0) + ' dias';
  document.getElementById('h-level').textContent      = nivel + 1;
}

// ── Barra de Progresso ──────────────────────────
function atualizarProgresso() {
  const total = user.total || 0;
  const nivel = getNivel(total);
  const cur   = EVOLUCAO[nivel];
  const next  = EVOLUCAO[nivel + 1];

  document.getElementById('prog-animal').textContent = `${cur.nome} ${cur.emoji}`;

  let pct, countText, nextText;
  if (!next) {
    pct       = 100;
    countText = `${total} questões`;
    nextText  = '🏆 Nível máximo!';
  } else {
    const dentro  = total - cur.req;
    const precisa = next.req - cur.req;
    pct       = Math.min(100, Math.round(dentro / precisa * 100));
    countText = `${dentro} / ${precisa} questões neste nível`;
    nextText  = `→ ${next.nome} ${next.emoji} (faltam ${next.req - total})`;
  }

  document.getElementById('prog-pct').textContent   = pct + '%';
  document.getElementById('prog-fill').style.width  = pct + '%';
  document.getElementById('prog-count').textContent = countText;
  document.getElementById('prog-next').textContent  = nextText;
}

// ── Mini stats (Hoje / Total / Nível) ───────────
function atualizarMini() {
  const total = user.total || 0;
  const nivel = getNivel(total);

  document.getElementById('mini-total').textContent = total;
  document.getElementById('mini-nivel').textContent = nivel + 1;
  document.getElementById('mini-hoje').textContent  = questoesHoje;
}

// ── Perfil completo ──────────────────────────────
function atualizarPerfil() {
  const total  = user.total || 0;
  const nivel  = getNivel(total);
  const animal = EVOLUCAO[nivel];

  document.getElementById('p-emoji').textContent       = animal.emoji;
  document.getElementById('p-name').textContent        = user.nome;
  document.getElementById('p-animal').textContent      = animal.nome;
  document.getElementById('p-total').textContent       = total;
  document.getElementById('p-streak').textContent      = user.streak || 0;
  document.getElementById('p-nivel').textContent       = nivel + 1;
  document.getElementById('p-vitoriassem').textContent = user.vitoriasSemana || 0;

  renderEvoChain(total, nivel);
  renderBadges();
}

// ── Cadeia de Evolução ───────────────────────────
function renderEvoChain(total, nivelAtual) {
  let tierAtual = null;
  let html = '';

  EVOLUCAO.forEach((ev, i) => {
    if (ev.tier !== tierAtual) {
      tierAtual = ev.tier;
      const cor = TIER_COLORS[ev.tier] || 'var(--muted2)';
      html += `<div class="evo-tier-header" style="color:${cor}">— ${ev.tier} —</div>`;
    }

    const unlocked = total >= ev.req;
    const atual    = i === nivelAtual;

    html += `<div class="evo-row ${atual ? 'current' : ''} ${unlocked ? 'unlocked' : 'locked'}">
      <span class="evo-emoji">${ev.emoji}</span>
      <span class="evo-name">${ev.nome}</span>
      <span class="evo-req">${ev.req.toLocaleString()} q.</span>
      ${atual
        ? '<span class="evo-current-marker">ATUAL</span>'
        : unlocked
          ? '<span class="evo-check">✓</span>'
          : ''}
    </div>`;
  });

  document.getElementById('evo-chain').innerHTML = html;
}

// ── Conquistas / Badges ──────────────────────────
function renderBadges() {
  const html = CONQUISTAS.map(c => {
    const earned = c.cond(user);
    return `<div class="badge-item ${earned ? 'earned' : 'locked'}">
      <span class="badge-icon">${c.icon}</span>
      <div class="badge-name">${c.nome}</div>
      <div class="badge-desc">${c.desc}</div>
    </div>`;
  }).join('');

  document.getElementById('badges-grid').innerHTML = html;
}

// ── Feedback de registro ─────────────────────────
function feedback(msg, ok) {
  const el = document.getElementById('reg-feedback');
  el.textContent = msg;
  el.className   = 'feedback-msg ' + (ok ? 'success' : 'error');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}
