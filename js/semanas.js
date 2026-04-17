/* ══════════════════════════════════════════════
   StudyRank — Semanas & Hall da Fama
   ══════════════════════════════════════════════ */

// ── Helpers de data ──────────────────────────────
function getInicioSemana(offset = 0) {
  const hoje = new Date();
  const dom  = hoje.getDay(); // 0 = domingo
  const ini  = new Date(hoje);
  ini.setDate(hoje.getDate() - dom + offset * 7);
  ini.setHours(0, 0, 0, 0);
  const fim = new Date(ini);
  fim.setDate(ini.getDate() + 6);
  return { ini, fim };
}

function formatarPeriodo(ini, fim) {
  const opts = { day: 'numeric', month: 'short' };
  return `${ini.toLocaleDateString('pt-BR', opts)} – ${fim.toLocaleDateString('pt-BR', opts)}`;
}

// ── Navegação entre semanas ──────────────────────
function navegarSemana(dir) {
  semanaOffset += dir;
  if (semanaOffset >= 0) semanaOffset = 0;
  document.getElementById('week-next-btn').disabled = semanaOffset >= 0;
  carregarSemana();
}

// ── Sub-tabs (Ranking / Hall da Fama) ────────────
function subTab(tab) {
  subTabAtiva = tab;
  document.getElementById('subtab-ranking').classList.toggle('active', tab === 'ranking');
  document.getElementById('subtab-hist').classList.toggle('active', tab === 'hist');
  document.getElementById('subtab-ranking-content').style.display = tab === 'ranking' ? '' : 'none';
  document.getElementById('subtab-hist-content').style.display    = tab === 'hist'    ? '' : 'none';
}

// ── Carregar dados da semana selecionada ─────────
async function carregarSemana() {
  const { ini, fim } = getInicioSemana(semanaOffset);
  const isAtual = semanaOffset === 0;

  document.getElementById('week-label').textContent    = isAtual ? 'Semana atual' : `Semana ${Math.abs(semanaOffset)} atrás`;
  document.getElementById('week-sublabel').textContent = formatarPeriodo(ini, fim);

  const winnerEl = document.getElementById('week-winner-area');
  const rankEl   = document.getElementById('rank-semana-list');
  const hallEl   = document.getElementById('hall-fama-list');

  winnerEl.innerHTML = '<div class="loading"><div class="spinner"></div> Carregando...</div>';
  rankEl.innerHTML   = '<div class="loading"><div class="spinner"></div> Carregando...</div>';

  // Ranking da semana
  try {
    const isoIni = ini.toISOString().slice(0, 10);
    const data   = await apiGet('rankSemana', { semana: isoIni });

    if (!data || !data.length) {
      winnerEl.innerHTML = `<div class="week-no-data"><span class="big-icon">📭</span>Sem dados para esta semana ainda.</div>`;
      rankEl.innerHTML   = '<div class="empty-state">Sem dados disponíveis.</div>';
    } else {
      renderWinner(data[0], isAtual, winnerEl);
      renderRankSemana(data, rankEl);
    }
  } catch (e) {
    winnerEl.innerHTML = `<div class="week-no-data"><span class="big-icon">⚙️</span>Adicione a ação <code>rankSemana</code> na sua API para ver dados semanais.</div>`;
    rankEl.innerHTML   = '<div class="empty-state">Endpoint <code>rankSemana</code> não encontrado na API.<br><br>Adicione no Apps Script e retorne a lista de usuários com questões da semana.</div>';
  }

  // Hall da Fama
  try {
    const hallData = await apiGet('hallFama');
    if (!hallData || !hallData.length) {
      hallEl.innerHTML = '<div class="empty-state">Nenhum campeão registrado ainda.</div>';
    } else {
      hallEl.innerHTML = '<div class="rank-list">' + hallData.map((item, i) => {
        const niv = getNivel(item.total || 0);
        const an  = EVOLUCAO[niv];
        return `<div class="rank-item">
          <span class="rank-pos">${i + 1}</span>
          <span class="rank-emoji">${an.emoji}</span>
          <div class="rank-info">
            <div class="rank-name">${item.nome}</div>
            <div class="rank-sub">${item.semana || '?'} · ${an.nome}</div>
          </div>
          <div class="rank-num">
            <div class="rank-big">${(item.questoes || 0).toLocaleString()}</div>
            <div class="rank-unit">na semana</div>
          </div>
        </div>`;
      }).join('') + '</div>';
    }
  } catch (e) {
    hallEl.innerHTML = '<div class="empty-state">Adicione o endpoint <code>hallFama</code> na sua API.</div>';
  }
}

function renderWinner(lider, isAtual, winnerEl) {
  const eu    = lider.nome.toLowerCase() === user.nome.toLowerCase();
  const nivel = getNivel(lider.total || 0);
  const an    = EVOLUCAO[nivel];

  winnerEl.innerHTML = `
    <div class="week-winner-card">
      <div class="week-badge">🏆 ${isAtual ? 'Líder da Semana' : 'Vencedor da Semana'}</div>
      <div class="week-winner-row">
        <span class="week-winner-emoji">${an.emoji}</span>
        <div class="week-winner-info">
          <div class="week-winner-name">${lider.nome}${eu ? ' 👑' : ''}</div>
          <div class="week-winner-sub">${an.nome}</div>
        </div>
        <div class="week-winner-count">
          <div class="week-count-big">${lider.questoes || lider.total || '?'}</div>
          <div class="week-count-label">questões</div>
        </div>
      </div>
    </div>`;
}

function renderRankSemana(data, rankEl) {
  rankEl.innerHTML = '<div class="rank-list">' + data.map((item, i) => {
    const eu  = item.nome.toLowerCase() === user.nome.toLowerCase();
    const niv = getNivel(item.total || 0);
    const an  = EVOLUCAO[niv];
    const qtd = item.questoes || item.total || 0;

    return `<div class="rank-item ${posClasse(i)} ${eu ? 'rank-me' : ''}">
      <span class="rank-pos ${posCorClasse(i)}">${i + 1}</span>
      <span class="rank-emoji">${an.emoji}</span>
      <div class="rank-info">
        <div class="rank-name">${item.nome}${eu ? ' (você)' : ''}</div>
        <div class="rank-sub">${an.nome}</div>
      </div>
      <div class="rank-num">
        <div class="rank-big">${qtd.toLocaleString()}</div>
        <div class="rank-unit">esta semana</div>
      </div>
    </div>`;
  }).join('') + '</div>';
}
