# Cache ve Redis İyileştirmeleri

## Yapılan Değişiklikler

### 1. Redis Client Yapılandırması (`lib/redis.ts`)

**Sorunlar:**
- Upstash Redis REST API'nin desteklemediği timeout parametreleri kullanılıyordu
- Lazy initialization tek seferlik deneme yapıyordu
- Error handling yetersizdi

**Çözümler:**
- ✅ Upstash Redis için doğru yapılandırma (sadece `url` ve `token`)
- ✅ `executeRedisCommand` helper fonksiyonu eklendi (timeout ve error handling ile)
- ✅ Daha iyi error handling ve logging
- ✅ Redis bağlantı hatalarında graceful fallback

**Yeni Özellikler:**
```typescript
// Redis komutlarını timeout ve error handling ile çalıştır
executeRedisCommand<T>(
  command: (client: Redis) => Promise<T>,
  fallback: T,
  timeoutMs: number = 3000
)
```

### 2. Posts Veri Yönetimi (`lib/get-posts.ts`)

**Sorunlar:**
- Sadece production ortamında Redis kullanılıyordu
- Development'ta test yapılamıyordu
- Manuel timeout yönetimi karmaşıktı

**Çözümler:**
- ✅ Production/development ayrımı kaldırıldı
- ✅ Redis her ortamda kullanılabilir
- ✅ `executeRedisCommand` helper'ı kullanılıyor
- ✅ In-memory cache süresi 1 saatten 5 dakikaya düşürüldü

### 3. API Route'ları

#### `/api/posts/route.ts`
**Değişiklikler:**
- ✅ `dynamic = "force-dynamic"` kaldırıldı
- ✅ `revalidate = 300` (5 dakika) eklendi
- ✅ Cache-Control headers: `public, s-maxage=300, stale-while-revalidate=600`
- ✅ Try-catch error handling eklendi

#### `/api/claps/route.ts`
**Değişiklikler:**
- ✅ `executeRedisCommand` helper'ı kullanılıyor
- ✅ Increment ve get işlemleri için farklı cache stratejileri:
  - Increment: `no-store, must-revalidate`
  - Get: `public, s-maxage=60, stale-while-revalidate=120`
- ✅ Daha iyi error handling
- ✅ Default değerler sabit olarak tanımlandı

#### `/api/post-detail/route.ts`
**Değişiklikler:**
- ✅ `executeRedisCommand` helper'ı kullanılıyor
- ✅ Increment ve get işlemleri için farklı cache stratejileri
- ✅ Cleaner code structure

### 4. Sayfa Cache Ayarları

#### `app/page.tsx` (Ana Sayfa)
- ✅ `revalidate` 24 saatten 5 dakikaya düşürüldü
- ✅ Cache: 5 dakika

#### `app/(post)/layout.tsx` (Post Detay)
- ✅ `dynamic = 'force-dynamic'` kaldırıldı (revalidate ile çelişiyordu)
- ✅ `revalidate` 60 saniyeden 5 dakikaya yükseltildi
- ✅ Static generation + ISR kullanılıyor

## Cache Stratejisi Özeti

### Static Data (Nadiren değişen)
- Ana sayfa: 5 dakika revalidation
- Post detayları: 5 dakika revalidation
- Bookmarks: Client-side
- Reading: Client-side

### Dynamic Data (Sık değişen)
- Claps (read): 1 dakika cache + 2 dakika stale-while-revalidate
- Claps (write): No cache
- Views (read): 1 dakika cache + 2 dakika stale-while-revalidate
- Views (write): No cache
- Posts API: 5 dakika cache + 10 dakika stale-while-revalidate

### In-Memory Cache
- Posts data: 5 dakika local cache

## Test Etme

### 1. Redis Bağlantısını Test Et
```bash
# .env.local dosyasında şunları kontrol et:
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Development server'ı başlat
pnpm dev
```

### 2. Console Loglarını Kontrol Et
Başarılı bağlantı:
```
✅ Redis client initialized
📦 Using cached posts data (cache hit durumunda)
🔄 Fetching posts with view data... (cache miss durumunda)
```

Hata durumları:
```
⚠️  Redis credentials not found
⚠️  Redis command failed: ...
```

### 3. API Endpoint'lerini Test Et
```bash
# Posts listesi
curl http://localhost:3000/api/posts

# Post detayı (view count)
curl http://localhost:3000/api/post-detail?id=POST_ID

# View count increment
curl http://localhost:3000/api/post-detail?id=POST_ID&incr=1

# Clap count
curl http://localhost:3000/api/claps?id=POST_ID

# Clap increment
curl http://localhost:3000/api/claps?id=POST_ID&score=1
```

## Avantajlar

1. **Performans**: Redis bağlantı sorunları artık uygulamayı yavaşlatmıyor
2. **Güvenilirlik**: Redis yoksa veya timeout olursa fallback değerler dönüyor
3. **Geliştirme**: Development ortamında da Redis test edilebilir
4. **Cache Stratejisi**: Her endpoint için optimize edilmiş cache süreleri
5. **Error Handling**: Daha iyi error handling ve logging
6. **Maintainability**: Temiz, okunabilir kod

## Önemli Notlar

- Redis bağlantı sorunları artık critical hata değil, warning olarak loglanıyor
- Tüm Redis operasyonları timeout korumalı (default: 2-3 saniye)
- Fallback değerler her zaman mevcut
- Cache stratejileri data type'a göre optimize edilmiş
- ISR (Incremental Static Regeneration) kullanılıyor

## Production Deployment

Cloudflare veya Vercel'e deploy ederken:

1. Environment variables'ları ayarla:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

2. Build komutu:
   ```bash
   pnpm build
   ```

3. Deploy:
   ```bash
   # Cloudflare için
   pnpm deploy
   
   # Vercel için
   vercel --prod
   ```
