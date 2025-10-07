# OpenNext Preview Blog Post Mismatch Fix

## Problem

OpenNext preview modunda çalışırken blog yazılarının bilgileri (title, description, metadata) karışıyordu. Bir blog yazısının içeriği farklı bir yazının başlığı ve bilgileriyle gösteriliyordu.

## Kök Neden

1. **Pathname-based Matching Unreliability**: `template.tsx` ve `layout.tsx` dosyaları, blog yazısını bulmak için `headers()` üzerinden aldıkları `x-pathname` header'ını kullanarak `posts.json` içinde arama yapıyordu.

2. **Full URL Matching**: Arama yaparken `new URL(p.link)` ile full URL parse edilip pathname karşılaştırması yapılıyordu. Bu OpenNext preview'da güvenilir olmuyordu.

3. **Pagination Component**: Benzer şekilde pagination component de `path.split("/").slice(2).join("/")` ile basit string manipülasyonu yapıyordu.

## Çözüm

### 1. Deterministic Path Matching Function

Her iki dosyada da (`template.tsx` ve `layout.tsx`) **pathname'den year ve slug'ı extract eden** ve bunlarla eşleşme yapan bir fonksiyon oluşturuldu:

```typescript
function findPostByPathname(pathname: string) {
  // Extract year and slug from pathname (e.g., /2023/initial-blog-post)
  const pathMatch = pathname.match(/^\/(\d{4})\/([^\/]+)/);
  
  return postsData.posts.find((p) => {
    if (pathMatch) {
      // Match by year and path - this is more reliable for OpenNext
      const [, year, slug] = pathMatch;
      return p.path === slug && p.link.includes(`/${year}/`);
    }
    // Fallback to full pathname match
    try {
      const url = new URL(p.link);
      return url.pathname === pathname;
    } catch {
      return false;
    }
  });
}
```

### 2. Updated Template Component

```typescript
// Before:
const post = postsData.posts.find((p) => {
  const url = new URL(p.link);
  return url.pathname === pathname;
});

// After:
const post = findPostByPathname(pathname);
```

### 3. Updated Pagination Component

Pagination component'te de benzer mantık uygulandı:

```typescript
// Extract year and slug from pathname
const pathMatch = path.match(/^\/(\d{4})\/([^\/]+)/);

if (!pathMatch) {
  setPagination({ prev: null, next: null });
  return;
}

const [, year, slug] = pathMatch;

// Find current post by matching both year and slug
const currentBlogIndex = posts.findIndex((post) => {
  return post.path === slug && post.link.includes(`/${year}/`);
});
```

## Avantajlar

1. **Daha Güvenilir**: Year ve slug'a göre eşleştirme, URL parsing'den daha deterministik
2. **OpenNext Uyumlu**: Preview ve production'da tutarlı çalışıyor
3. **Performance**: URL parsing try-catch'e gerek kalmadı (fallback olarak var)
4. **Debug Friendly**: Daha açık ve anlaşılır kod

## Test

OpenNext preview modunda:
```bash
pnpm build
pnpm preview
```

Her blog yazısının:
- ✅ Doğru title göstermesi
- ✅ Doğru metadata'sı olması
- ✅ Doğru pagination linklerinin olması
- ✅ Doğru structured data'sının olması

kontrol edilmeli.

## Etkilenen Dosyalar

- `/app/(post)/template.tsx` - Blog post header ve structured data
- `/app/(post)/layout.tsx` - Blog post metadata generation
- `/components/pagination.tsx` - Previous/Next navigation

## Migration Notes

Herhangi bir API değişikliği yok. Sadece internal matching logic'i iyileştirildi.

