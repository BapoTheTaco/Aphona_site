(() => {
  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const safeURL = value => {
    const v = String(value || '').trim();
    if (!v) return '';
    if (/^(https?:\/\/|assets\/|\.\/|\.\.\/)/i.test(v)) return v;
    return '';
  };

  async function getJSON(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Kon ${url} niet laden`);
    return response.json();
  }

  function renderActivities(data) {
    const root = document.getElementById('activity-list');
    if (!root || !Array.isArray(data.activities)) return;
    root.innerHTML = data.activities.map(item => `
      <article data-category="${escapeHTML(item.category || 'avond')}">
        <time>${escapeHTML(item.date)}</time>
        <h2>${escapeHTML(item.title)}</h2>
        <span>${escapeHTML(item.label)}</span>
      </article>`).join('');
    document.dispatchEvent(new CustomEvent('aphonia:activities-rendered'));
  }

  function personCard(person) {
    const photo = safeURL(person.photo);
    const visual = photo
      ? `<div class="person-photo"><img src="${escapeHTML(photo)}" alt="${escapeHTML(person.name)}" loading="lazy"></div>`
      : `<div class="person-photo letter">${escapeHTML(person.initials || (person.name || '').split(/\\s+/).map(x => x[0] || '').join('').slice(0,2).toUpperCase())}</div>`;
    return `<article class="person-card">${visual}<span>${escapeHTML(person.role)}</span><h2>${escapeHTML(person.name)}</h2>${person.study ? `<p>${escapeHTML(person.study)}</p>` : ''}${person.note ? `<small>${escapeHTML(person.note)}</small>` : ''}</article>`;
  }

  function archiveYear(entry, index) {
    const photo = safeURL(entry.groupPhoto);
    const members = Array.isArray(entry.members) ? entry.members : [];
    return `<details class="archive-year"${index === 0 ? ' open' : ''}>
      <summary><span>PRAESIDIUM</span><strong>${escapeHTML(entry.year)}</strong><i aria-hidden="true">+</i></summary>
      <div class="archive-year-content">
        ${photo ? `<figure class="archive-photo"><img src="${escapeHTML(photo)}" alt="Praesidium ${escapeHTML(entry.year)}" loading="lazy"><figcaption>${escapeHTML(entry.year)}</figcaption></figure>` : ''}
        <ul class="archive-members">${members.map(member => `<li><span>${escapeHTML(member.role)}</span><strong>${escapeHTML(member.name)}</strong></li>`).join('')}</ul>
      </div>
    </details>`;
  }

  function renderPraesidium(data) {
    const current = document.getElementById('current-praesidium');
    const archive = document.getElementById('pro-archive');
    if (current && Array.isArray(data.current)) current.innerHTML = data.current.map(personCard).join('');
    if (archive && Array.isArray(data.previousYears)) archive.innerHTML = data.previousYears.map(archiveYear).join('');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const activityRoot = document.getElementById('activity-list');
    if (activityRoot) {
      try { renderActivities(await getJSON(activityRoot.dataset.contentSource || 'content/activiteiten.json')); }
      catch (err) { console.warn('Aphonia: activiteiten fallback actief.', err); }
    }

    const current = document.getElementById('current-praesidium');
    const archive = document.getElementById('pro-archive');
    if (current || archive) {
      const source = (current || archive).dataset.contentSource || 'content/praesidium.json';
      try { renderPraesidium(await getJSON(source)); }
      catch (err) { console.warn('Aphonia: praesidium fallback actief.', err); }
    }
  });
})();
