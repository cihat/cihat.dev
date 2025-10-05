# Upstash Redis Kurulumu

## Problem

Terminal çıktısında görülen hata:
```
⚠️  Invalid Redis URL format
   Expected: https://...
   Received: AZVPASQgNmM1NjFkOWEtNDhiNi00Yz...
```

Bu hata, `UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN` değerlerinin **yer değiştirdiğini** gösteriyor.

## Çözüm

### 1. Upstash Console'a Git

https://console.upstash.com/redis adresine git ve Redis veritabanını seç.

### 2. REST API Bilgilerini Bul

**Details** veya **REST API** sekmesinde şu bilgileri bulacaksın:

```
UPSTASH_REDIS_REST_URL
https://usw1-your-db-name-12345.upstash.io

UPSTASH_REDIS_REST_TOKEN  
AYasdfqwerASDFqwerASDF1234567890... (uzun token)
```

### 3. .env.local Dosyası Oluştur

Proje root dizininde `.env.local` dosyası oluştur:

```bash
cd /Users/cihatsalik/github/cihat.dev
touch .env.local
```

### 4. Doğru Değerleri Ekle

`.env.local` dosyasına **doğru sırada** ekle:

```env
# ⚠️ DİKKAT: URL https:// ile başlamalı!
UPSTASH_REDIS_REST_URL=https://usw1-your-actual-database.upstash.io

# ⚠️ DİKKAT: Token "A" ile başlayan uzun bir string!
UPSTASH_REDIS_REST_TOKEN=AYasdfQWER1234567890asdfQWER...
```

### 5. Kontrol Et

**Yanlış ❌:**
```env
# URL token gibi görünüyor
UPSTASH_REDIS_REST_URL=AZVPASQgNmM1NjFkOWEtNDhiNi00Yz...

# Token URL gibi görünüyor  
UPSTASH_REDIS_REST_TOKEN=https://usw1-xxx.upstash.io
```

**Doğru ✅:**
```env
# URL https:// ile başlıyor
UPSTASH_REDIS_REST_URL=https://usw1-amazing-tiger-12345.upstash.io

# Token "A" ile başlıyor ve çok uzun
UPSTASH_REDIS_REST_TOKEN=AYasdfASDF1234qwerQWER5678tyuiTYUI...
```

### 6. Development Server'ı Yeniden Başlat

```bash
# Ctrl+C ile durdur
# Sonra tekrar başlat
pnpm dev
```

### 7. Başarı Mesajlarını Kontrol Et

Terminal'de şunları görmelisin:

```
✅ Redis client initialized
🔄 Fetching posts with view data...
✅ Posts data cached
```

**Artık görmemelisin:**
```
⚠️  Invalid Redis URL format
```

## Test Et

### 1. Browser'da Test

```
http://localhost:3000/
```

Bir blog post'a tıkla ve sayfayı yenile. View count artmalı.

### 2. API'yi Doğrudan Test Et

```bash
# View count'u kontrol et
curl http://localhost:3000/api/post-detail?id=askerlik

# View count'u artır
curl http://localhost:3000/api/post-detail?id=askerlik&incr=1

# Tekrar kontrol et (artmış olmalı)
curl http://localhost:3000/api/post-detail?id=askerlik
```

### 3. Claps'i Test Et

```bash
# Clap count'u kontrol et
curl http://localhost:3000/api/claps?id=askerlik

# Clap ekle
curl http://localhost:3000/api/claps?id=askerlik&score=1

# Tekrar kontrol et (artmış olmalı)
curl http://localhost:3000/api/claps?id=askerlik
```

## Upstash Console'da Doğrula

1. https://console.upstash.com/redis adresine git
2. Database'ini seç
3. **Data Browser** sekmesine tıkla
4. Şu key'leri görmelisin:
   - `views` (hash) - view count'lar
   - `claps` (hash) - clap count'lar

## Hala Çalışmıyorsa

### Debug Adımları

1. `.env.local` dosyasının doğru dizinde olduğundan emin ol:
   ```bash
   ls -la /Users/cihatsalik/github/cihat.dev/.env.local
   ```

2. Environment variables'ları yazdır (terminal'de):
   ```bash
   # Next.js projesinde
   cat .env.local
   ```

3. Upstash Console'da test et:
   - Console > CLI sekmesine git
   - `HSET views test 1` komutunu çalıştır
   - `HGET views test` komutunu çalıştır
   - `1` dönerse Redis çalışıyor demektir

4. Token'ın doğru olduğundan emin ol:
   - Upstash Console'da yeni bir token oluştur
   - Rotate/Regenerate işlemi yapma (eski token geçersiz olur)

## Production'da Kullanım

### Vercel

```bash
vercel env add UPSTASH_REDIS_REST_URL
# URL'yi gir (https:// ile başlayan)

vercel env add UPSTASH_REDIS_REST_TOKEN  
# Token'ı gir ("A" ile başlayan)
```

### Cloudflare Pages

```bash
# wrangler.toml dosyasında EKLE, sadece referans için
[env.production]
# Gerçek değerleri Cloudflare Dashboard'da ekle
```

Cloudflare Dashboard:
1. Workers & Pages > Your Project > Settings
2. Environment Variables sekmesi
3. Production için ekle

### Environment Variables'ları Kontrol Et

```bash
# Local'de
echo $UPSTASH_REDIS_REST_URL

# URL çıktısı https:// ile başlamalı
```

## Özet

- ✅ URL `https://` ile başlamalı
- ✅ Token `A` harfi ile başlayan çok uzun bir string olmalı  
- ✅ İkisini karıştırma!
- ✅ .env.local dosyası proje root'unda olmalı
- ✅ Development server'ı yeniden başlat
- ✅ Başarı mesajlarını kontrol et
