import{$,esc,fmtDate}from"../core/utils.js?v=b61d329e7a36";import{state}from"../core/store.js?v=b61d329e7a36";import{initReveal}from"../core/reveal.js?v=b61d329e7a36";const KNOWN_GAPS={"2024-2025-guz":"Bu dönem ne OBS arşivinde ne de dönem başı arşiv dökümünde bulunuyor: veri kaynağı yok."};export function renderTerms(){$("#terms").innerHTML=state.index.terms.map(e=>{if(e.missing){const t=KNOWN_GAPS[e.slug];return`<article class="termcard reveal missing">
        <div><h3>${esc(e.label)}<span class="badge">veri yok</span></h3>
        <p class="meta">${t?esc(t):"Bu dönem ne OBS'de ne de arşiv dökümünde bulunuyor."}</p></div>
        <div class="links"></div></article>`}const t=e.live,s=t?"canlı tarama":"arşiv dökümü",n=Array.isArray(e.failedBranches)?e.failedBranches.length:0,o=e.partial?`<p class="meta warn">Son tarama kısmi${n?`: ${n} branş alınamadı`:""}; sonuçlar eksik olabilir.</p>`:"";return`<article class="termcard reveal">
      <div>
        <h3>${esc(e.label)}${t?'<span class="badge live">canlı</span>':""}</h3>
        <p class="meta">${e.sections.toLocaleString("tr")} şube · kaynak ${esc(s)} · ${fmtDate(e.scrapedAt)}</p>
        ${o}
      </div>
      <div class="links">
        <a class="btn" href="data/terms/${e.slug}/all.csv" download>CSV</a>
        <a class="btn" href="data/terms/${e.slug}/meta.json">meta.json</a>
      </div></article>`}).join(""),initReveal($("#terms"))}