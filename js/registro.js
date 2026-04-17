/* ══════════════════════════════════════════════
   StudyRank — Registro de Questões
   ══════════════════════════════════════════════ */

function ajustarQuestoes(delta) {
  const inp = document.getElementById('questoes-input');
  inp.value = Math.max(1, (parseInt(inp.value) || 0) + delta);
}

function setQ(n) {
  document.getElementById('questoes-input').value = n;
}

async function registrarQuestoes() {
  const questoes = parseInt(document.getElementById('questoes-input').value) || 0;
  if (questoes <= 0) { feedback('Coloque ao menos 1 questão.', false); return; }

  const btn = document.getElementById('reg-btn');
  btn.disabled = true;
  btn.textContent = 'Registrando...';

  try {
    const res = await apiPost({ acao: 'registrar', userId: user.id, questoes });
    if (res.erro) throw new Error(res.erro);

    // Atualiza estado local
    user.total  = res.total;
    user.animal = res.animal;
    user.emoji  = res.emoji;
    if (res.streak !== undefined) user.streak = res.streak;
    localStorage.setItem('studyrank_user', JSON.stringify(user));

    questoesHoje = res.questoesHoje || questoesHoje + questoes;

    atualizarHeader();
    atualizarProgresso();
    atualizarMini();
    feedback(`+${questoes} questões registradas! Total hoje: ${res.questoesHoje || '?'} 🎉`, true);
  } catch (e) {
    feedback('Erro ao registrar. Tente novamente.', false);
  }

  btn.disabled = false;
  btn.textContent = 'Registrar questões';
}
