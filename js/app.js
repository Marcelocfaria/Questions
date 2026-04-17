/* ══════════════════════════════════════════════
   StudyRank — Navegação & Inicialização
   ══════════════════════════════════════════════ */

// ── Estado Global ────────────────────────────────
let user         = JSON.parse(localStorage.getItem('studyrank_user') || 'null');
let tabAtiva     = 'home';
let subTabAtiva  = 'ranking';
let semanaOffset = 0;   // 0 = semana atual, -1 = anterior, etc.
let questoesHoje = 0;   // atualizado pela API ou ao registrar

// ── Iniciar App ──────────────────────────────────
function iniciarApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');

  const d = new Date();
  const dataStr = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('data-home').textContent = dataStr;
  document.getElementById('data-hoje').textContent = dataStr;

  atualizarHeader();
  atualizarProgresso();
  atualizarMini();
}

// ── Trocar Tab ───────────────────────────────────
function mudarTab(tab) {
  document.getElementById('tab-' + tabAtiva).classList.add('hidden');
  document.getElementById('nav-' + tabAtiva).classList.remove('active');

  tabAtiva = tab;

  document.getElementById('tab-' + tab).classList.remove('hidden');
  document.getElementById('nav-' + tab).classList.add('active');

  // Carrega dados conforme a tab acessada
  if (tab === 'dia')    carregarRankDia();
  if (tab === 'semana') carregarSemana();
  if (tab === 'geral')  carregarRankGeral();
  if (tab === 'perfil') atualizarPerfil();
}

// ── Auto-login se já logado ──────────────────────
if (user) iniciarApp();
