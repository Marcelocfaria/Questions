/* ══════════════════════════════════════════════
   StudyRank — Rankings (Dia, Semana, Geral)
   ══════════════════════════════════════════════ */

// ── Ranking do Dia ───────────────────────────────
async function carregarRankDia() {
  const gymEl  = document.getElementById('gym-content');
  const listEl = document.getElementById('rank-dia-list');
  gymEl.innerHTML  = '<div class="gym-loading"><div class="spinner"></div> Carregando...</div>';
  listEl.innerHTML = '<div class="loading"><div class="spinner"></div> Carregando...</div>';

  try {
    const data = await apiGet('rankDia');

    if (!data.length) {
      gymEl.innerHTML  = '<div class="gym-empty">Ninguém registrou questões hoje ainda. Seja o primeiro! 💪</div>';
      listEl.innerHTML = '<div class="empty-state">Nenhum registro de hoje ainda.</div>';
      return;
    }

    const lider = data[0];
    const euLider = lider.nome.toLowerCase() === user.nome.toLowerCase();
    gymEl.innerHTML = `
      <div class="gym-leader-row">
        <span class="gym-leader-emoji">${lider.emoji || '🪱'}</span>
        <div class="gym-leader-info">
          <div class="gym-leader-name">${lider.nome}${euLider ? ' 👑' : ''}</div>
          <div class="gym-leader-animal">${lider.animal || 'Minhoca'}</div>
        </div>
        <div class="gym-leader-count">
          <div class="gym-count-big">${lider.questoes}</div>
          <div class="gym-count-label">questões hoje</div>
        </div>
      </div>`;

    listEl.innerHTML = '<div class="rank-list">' + data.map((item, i) => {
      const eu = item.nome.toLowerCase() === user.nome.toLowerCase();
      if (eu) questoesHoje = item.questoes;
      return `<div class="rank-item ${posClasse(i)} ${eu ? 'rank-me' : ''}">
        <span class="rank-pos ${posCorClasse(i)}">${i + 1}</span>
        <span class="rank-emoji">${item.emoji || '🪱'}</span>
        <div class="rank-info">
          <div class="rank-name">${item.nome}${eu ? ' (você)' : ''}</div>
          <div class="rank-sub">${item.animal || 'Minhoca'}</div>
        </div>
        <div class="rank-num">
          <div class="rank-big">${item.questoes}</div>
          <div class="rank-unit">hoje</div>
        </div>
      </div>`;
    }).join('') + '</div>';

    document.getElementById('mini-hoje').textContent = questoesHoje;
  } catch (e) {
    gymEl.innerHTML  = '<div class="gym-empty">Erro ao carregar.</div>';
    listEl.innerHTML = '<div class="empty-state">Erro ao carregar. Verifique a conexão.</div>';
  }
}

// ── Ranking Geral ────────────────────────────────
async function carregarRankGeral() {
  const el = document.getElementById('rank-geral-list');
  el.innerHTML = '<div class="loading"><div class="spinner"></div> Carregando...</div>';

  try {
    const data = await apiGet('rankGeral');
    if (!data.length) { el.innerHTML = '<div class="empty-state">Nenhum dado ainda.</div>'; return; }

    el.innerHTML = '<div class="rank-list">' + data.map((item, i) => {
      const eu = item.nome.toLowerCase() === user.nome.toLowerCase();
      const nivel = getNivel(item.total || 0);
      const animalData = EVOLUCAO[nivel];
      return `<div class="rank-item ${posClasse(i)} ${eu ? 'rank-me' : ''}">
        <span class="rank-pos ${posCorClasse(i)}">${i + 1}</span>
        <span class="rank-emoji">${animalData.emoji}</span>
        <div class="rank-info">
          <div class="rank-name">${item.nome}${eu ? ' (você)' : ''}</div>
          <div class="rank-sub">${animalData.nome}${item.streak ? ' · 🔥 ' + item.streak + 'd' : ''}</div>
        </div>
        <div class="rank-num">
          <div class="rank-big">${(item.total || 0).toLocaleString()}</div>
          <div class="rank-unit">questões</div>
        </div>
      </div>`;
    }).join('') + '</div>';
  } catch (e) {
    el.innerHTML = '<div class="empty-state">Erro ao carregar.</div>';
  }
}

// ── Helpers de posição ───────────────────────────
function posClasse(i)    { return i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''; }
function posCorClasse(i) { return i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : ''; }
