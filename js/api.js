/* ══════════════════════════════════════════════
   StudyRank — API (chamadas ao Google Apps Script)
   ══════════════════════════════════════════════ */

async function apiGet(acao, extraParams = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ acao, ...extraParams }),
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (json.erro) { console.error('Erro da API:', json.erro); throw new Error(json.erro); }
    return json;
  } catch (e) {
    console.error('Resposta inválida da API:', text);
    throw new Error('Erro ao interpretar resposta da API');
  }
}

async function apiPost(dados) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(dados),
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (json.erro) { console.error('Erro da API:', json.erro); throw new Error(json.erro); }
    return json;
  } catch (e) {
    console.error('Resposta inválida da API:', text);
    throw new Error('Erro ao interpretar resposta da API');
  }
}
