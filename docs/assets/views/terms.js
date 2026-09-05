import{$,esc,fmtDate}from"../core/utils.js?v=d78aea0e0dbe";import{state}from"../core/store.js?v=d78aea0e0dbe";import{initReveal}from"../core/reveal.js?v=d78aea0e0dbe";import{I18N}from"../i18n.js?v=d78aea0e0dbe";const KNOWN_GAPS={"2024-2025-guz":"termGap20242025Guz"};function localizedTermLabel(e,t){if(I18N.lang!=="en")return e;const n=/^(.+)-(guz|bahar|yaz)$/.exec(t||"");if(!n)return e;const s={guz:"Fall Term",bahar:"Spring Term",yaz:"Summer Term"}[n[2]];return`${n[1]} ${s}`}export function renderTerms(){$("#terms").innerHTML=state.index.terms.map(e=>{const t=localizedTermLabel(e.label,e.slug);if(e.missing){const n=KNOWN_GAPS[e.slug],s=n?I18N.t(n):I18N.t("termNoDataFallback");return`<article class="termcard reveal missing">
        <div><h3>${esc(t)}<span class="badge">${esc(I18N.t("termBadgeNoData"))}</span></h3>
        <p class="meta">${esc(s)}</p></div>
        <div class="links"></div></article>`}const n=e.live,o=n?I18N.t("termSourceLive"):I18N.t("termSourceArchive"),s=Array.isArray(e.failedBranches)?e.failedBranches.length:0,i=e.partial?`<p class="meta warn">${esc(I18N.t("termScanPartial"))}${s?`: ${s}${esc(I18N.t("termBranchesFailedSuffix"))}`:""}${esc(I18N.t("termResultsIncomplete"))}</p>`:"";return`<article class="termcard reveal">
      <div>
        <h3>${esc(t)}${n?`<span class="badge live">${esc(I18N.t("termBadgeLive"))}</span>`:""}</h3>
        <p class="meta">${e.sections.toLocaleString(I18N.lang==="en"?"en":"tr")} ${esc(I18N.t("prgSube"))} · ${esc(I18N.t("termSourceLabel"))} ${esc(o)} · ${fmtDate(e.scrapedAt)}</p>
        ${i}
      </div>
      <div class="links">
        <a class="btn" href="data/terms/${e.slug}/all.csv" download>CSV</a>
        <a class="btn" href="data/terms/${e.slug}/meta.json">meta.json</a>
      </div></article>`}).join(""),initReveal($("#terms"))}