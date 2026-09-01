// OBS transkript PDF'ini TARAYICIDA metne çevirir — dosya hiçbir yere
// yüklenmez. pdf.js self-hosted (docs/assets/vendor/pdfjs/), worker'ı dahil;
// CDN'e hiç istek gitmez. Yalnız transkript diyaloğu PDF seçildiğinde
// (dinamik import) yüklenir — normal sayfa yükünü etkilemez.
let pdfjsPromise = null;
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('../vendor/pdfjs/pdf.min.mjs').then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = new URL('../vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
      return mod;
    });
  }
  return pdfjsPromise;
}

// PDF'teki metin öğelerini Y konumuna göre satırlara toplar (pdf.js düz
// metni satır sırası vermeden döner) — parseOBSTranscript'in beklediği
// "bir ders bir satır" biçimine yakınsın diye. Aynı satırdaki öğeler X'e
// göre sıralanır (sütun sırası bozulmasın).
async function pageLines(page) {
  const content = await page.getTextContent();
  const lines = [];
  let currentY = null, current = [];
  const flush = () => {
    if (current.length) {
      current.sort((a, b) => a.x - b.x);
      lines.push(current.map((it) => it.str).join(' '));
    }
    current = [];
  };
  for (const it of content.items) {
    const y = it.transform[5];
    if (currentY === null || Math.abs(y - currentY) > 2) {
      flush();
      currentY = y;
    }
    current.push({ str: it.str, x: it.transform[4] });
  }
  flush();
  return lines;
}

// file: File/Blob (input[type=file] veya sürükle-bırak). Döner: düz metin,
// parseOBSTranscript'e doğrudan verilebilir. Bozuk/şifreli PDF'te fırlatır —
// çağıran taraf kullanıcıya anlaşılır bir hata göstermeli.
export async function extractPdfText(file) {
  const pdfjs = await loadPdfjs();
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf, isEvalSupported: false }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    pages.push((await pageLines(await doc.getPage(i))).join('\n'));
  }
  return pages.join('\n\n');
}
