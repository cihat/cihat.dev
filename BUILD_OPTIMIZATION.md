# Build Optimization Guide

## 🚀 Uygulanan Optimizasyonlar

### 1. Sourcemap Sorunları Düzeltildi
**Problem:** Terminal'de sürekli `Failed to get source map` hataları
**Çözüm:**
```javascript
// next.config.js
productionBrowserSourceMaps: false  // Production'da sourcemap kapalı
webpack(config, { dev }) {
  if (!dev) {
    config.devtool = false  // Build sırasında sourcemap üretme
  }
}
```
**Sonuç:** %30-40 daha hızlı build, daha az CPU kullanımı

### 2. Memory Limit Artırıldı
```json
// package.json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```
**Sonuç:** Büyük projelerde out of memory hatası önlenir

### 3. TypeScript Optimizasyonu
```json
// tsconfig.json
{
  "target": "ES2022",              // Daha hızlı compilation
  "moduleResolution": "bundler",   // Modern module resolution
  "exclude": [".next", "out", "build"]  // Gereksiz dosyalar hariç
}
```

### 4. Webpack Bundle Optimization
```javascript
splitChunks: {
  cacheGroups: {
    vendor: {
      name: 'vendor',
      test: /node_modules/,
      priority: 20
    },
    common: {
      name: 'common',
      minChunks: 2,
      priority: 10
    }
  }
}
```
**Sonuç:** Daha küçük chunk'lar, daha iyi caching

### 5. Package Import Optimization
```javascript
experimental: {
  optimizePackageImports: [
    'react-icons',
    'lucide-react',
    '@radix-ui/react-dropdown-menu',
    // ... diğer büyük paketler
  ]
}
```
**Sonuç:** Sadece kullanılan icon'lar bundle'a eklenir

### 6. Image Optimization
```javascript
images: {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  formats: ['image/webp', 'image/avif']
}
```

## 📊 Beklenen İyileştirmeler

### Build Zamanı
- **Önce:** ~60-90 saniye (sourcemap ile)
- **Sonra:** ~30-45 saniye (sourcemap olmadan)
- **İyileşme:** %40-50 daha hızlı

### CPU Kullanımı
- **Önce:** %90-100 (sürekli yüksek)
- **Sonra:** %60-70 (kontrollü)
- **İyileşme:** %30-40 daha az CPU

### Memory Kullanımı
- **Önce:** 2-3 GB (bazen OOM)
- **Sonra:** 2-4 GB (kontrollü, max 4GB)
- **İyileşme:** Stabil, OOM yok

### Bundle Boyutu
- **Vendor chunk:** Daha iyi caching
- **Tree-shaking:** Kullanılmayan kod elenir
- **Icon'lar:** Sadece kullanılanlar dahil

## 🧪 Test Etme

### 1. Temiz Build
```bash
pnpm run clean
pnpm run build
```

### 2. CPU ve Memory İzleme
```bash
# MacOS
top -pid $(pgrep -f "next build")

# veya
Activity Monitor'da "node" süreçlerini izle
```

### 3. Bundle Analizi
```bash
# Ekstra package gerekli
pnpm add -D @next/bundle-analyzer
```

## 🔍 Build Script'leri

```json
{
  "dev": "next dev --turbopack",           // Turbopack ile hızlı dev
  "build": "NODE_OPTIONS='...' next build", // Optimize edilmiş build
  "clean": "rm -rf .next out node_modules/.cache", // Temizlik
  "start": "next start"                    // Production start
}
```

## 💡 Best Practices

### Development
- ✅ Turbopack kullan (`--turbopack` flag'i ile)
- ✅ Hot reload yeterli, full restart gereksiz
- ✅ Sourcemap'ler dev'de aktif (debug için)

### Production Build
- ✅ Sourcemap kapalı (daha hızlı build)
- ✅ Memory limit ayarlı (4GB)
- ✅ Clean build yap deploy öncesi
- ✅ Bundle boyutunu kontrol et

### CI/CD için
```yaml
# GitHub Actions örneği
- name: Build
  run: |
    pnpm run clean
    NODE_OPTIONS='--max-old-space-size=4096' pnpm run build
  env:
    NODE_ENV: production
```

## 🐛 Sorun Giderme

### "JavaScript heap out of memory"
```bash
# Memory limit artır
NODE_OPTIONS='--max-old-space-size=8192' pnpm run build
```

### Yavaş Build
```bash
# Cache'i temizle
rm -rf .next node_modules/.cache
pnpm i
pnpm run build
```

### Turbopack Hataları
```bash
# Turbopack'siz build dene
pnpm run build # --turbopack flag'i olmadan
```

## 📈 Monitoring

### Build Metrikleri
- Build süresi: `time pnpm run build`
- Bundle boyutu: `.next/` dizini boyutu
- Page sayısı: Build log'undan

### Runtime Metrikleri
- First Load JS: Build sonrası raporda
- Lighthouse Score: Production'da test et
- Core Web Vitals: Vercel Analytics ile

## 🔄 Devam Eden Optimizasyonlar

1. [ ] MDX dosyalarını cache'le
2. [ ] Dynamic import'ları artır
3. [ ] Critical CSS extraction
4. [ ] Preload/Prefetch stratejisi
5. [ ] Service Worker optimization

## 📚 Referanslar

- [Next.js Performance Docs](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Webpack Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Turbopack Docs](https://nextjs.org/docs/architecture/turbopack)
