/* ══════════════════════════════════════════════
   StudyRank — Login & Autenticação
   ══════════════════════════════════════════════ */

async function fazerLogin() {
  const nome = document.getElementById('login-name').value.trim();
  if (!nome) { erroLogin('Digite seu nome.'); return; }

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try {
    const res = await apiPost({ acao: 'cadastrar', nome });
    if (res.erro) throw new Error(res.erro);

    user = res.usuario;
    localStorage.setItem('studyrank_user', JSON.stringify(user));
    iniciarApp();
  } catch (e) {
    erroLogin('Erro ao conectar. Verifique a URL da API.');
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
}

function erroLogin(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.style.display = 'block';
}

function sair() {
  if (!confirm('Sair da conta?')) return;
  localStorage.removeItem('studyrank_user');
  location.reload();
}

// Submeter login com Enter
document.getElementById('login-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') fazerLogin();
});
