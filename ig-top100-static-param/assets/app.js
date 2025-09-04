// Default (fallback) — pode deixar vazio se for usar apenas via ?csv=URL
const SHEET_CSV_URL_DEFAULT = '';

function getCSVUrl(){
  const p = new URLSearchParams(location.search);
  const fromParam = p.get('csv');
  if (fromParam) return decodeURIComponent(fromParam);
  return SHEET_CSV_URL_DEFAULT;
}

function normalizeHeader(h){ return (h || '').toString().trim().toLowerCase(); }
function fmtNumber(n){ try { return new Intl.NumberFormat('pt-BR').format(Number(n||0)); } catch(e){ return n; } }

function initTable(rows){
  const tbody = document.querySelector('#igTable tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    const followersNum = Number(r.followers || 0);
    tr.innerHTML = `
      <td>${r.rank || ''}</td>
      <td>${r.name || ''}</td>
      <td><a href="${r.profile_url || '#'}" target="_blank" rel="noopener">@${r.username || ''}</a></td>
      <td data-order="${followersNum}">${fmtNumber(followersNum)}</td>
      <td>${r.last_checked || ''}</td>
    `;
    tbody.appendChild(tr);
  });

  jQuery('#igTable').DataTable({
    order: [[3, 'desc']],
    pageLength: 25,
    responsive: true,
    language: { url: 'https://cdn.datatables.net/plug-ins/2.0.3/i18n/pt-BR.json' }
  });
}

function loadCSV(){
  const csvUrl = getCSVUrl();
  const lastEl = document.getElementById('lastUpdated');
  if (!csvUrl) {
    lastEl.textContent = '⚠️ Passe sua URL de CSV com ?csv=URL (codificada).';
    return;
  }
  Papa.parse(csvUrl, {
    header: true,
    download: true,
    skipEmptyLines: true,
    complete: (res) => {
      const data = res.data || [];
      const rows = data.map(row => {
        const obj = {};
        Object.keys(row).forEach(k => obj[normalizeHeader(k)] = row[k]);
        return {
          rank: obj['rank'],
          name: obj['name'],
          username: obj['username'],
          profile_url: obj['profile_url'],
          followers: obj['followers'],
          last_checked: obj['last_checked']
        };
      }).filter(x => x && x.username);

      const now = new Date();
      lastEl.textContent = 'Atualizado agora: ' + new Intl.DateTimeFormat('pt-BR', { dateStyle:'medium', timeStyle:'short' }).format(now);
      initTable(rows);
    },
    error: (err) => {
      lastEl.textContent = 'Erro ao carregar CSV: ' + (err && err.message ? err.message : 'desconhecido');
    }
  });
}

document.addEventListener('DOMContentLoaded', loadCSV);
