# itu-ders-stats Worker

Masthead'deki (`.statbar`) "ziyaret (30g)" rakamının kaynağı. GitHub Pages
statik olduğu için API token'ı doğrudan siteye koyamayız — bu Worker sunucu
tarafında Cloudflare'ın kendi Analytics verisini sorup yalnızca bir sayı
döner; gerçek token tarayıcıya hiç gitmez.

## Kurulum (bir kere)

1. **Zone ID'yi al**: Cloudflare dashboard → itu-ders.com → Overview →
   sağdaki "API" kutusu → **Zone ID**'yi kopyala, `wrangler.toml` içindeki
   `ZONE_TAG` değerine yapıştır.

2. **Salt-okunur API token oluştur**: dashboard sağ üstte profil ikonu →
   **My Profile → API Tokens → Create Token → Custom token**.
   - Permissions: **Zone → Analytics → Read**
   - Zone Resources: **Specific zone → itu-ders.com**
   - Başka hiçbir izin ekleme (özellikle DNS/SSL/Workers düzenleme izni
     VERME — bu token yalnızca okuma yapacak).
   - Oluşan token'ı kopyala (bir daha gösterilmez).

3. **wrangler kur ve giriş yap** (bu depodan değil, herhangi bir terminalden):
   ```bash
   npm install -g wrangler
   wrangler login
   ```

4. **Bu klasörden secret'ı gir**:
   ```bash
   cd cloudflare/stats-worker
   wrangler secret put CF_API_TOKEN
   # istendiğinde 2. adımdaki token'ı yapıştır
   ```

5. **Deploy et**:
   ```bash
   wrangler deploy
   ```
   İlk deploy'da `stats.itu-ders.com` route'u otomatik DNS kaydı da
   isteyebilir — wrangler sorarsa onayla (zone zaten Cloudflare'da proxy'li
   olduğu için ek bir işlem gerekmez).

6. **Doğrula**: `https://stats.itu-ders.com/` adresine gidince
   `{"visits30d": 3123, "updatedAt": "..."}` gibi bir JSON dönmeli.
   `visits30d: null` dönüyorsa token/zone ID'yi kontrol et — site rozeti
   bu durumda sessizce gizli kalır (hata göstermez).

## Güncelleme

Kod değişince yalnızca `wrangler deploy` yeterli — secret'ı tekrar girmene
gerek yok.
