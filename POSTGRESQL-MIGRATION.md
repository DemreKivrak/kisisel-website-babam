# PostgreSQL Geçiş Rehberi

Bu rehber, SQLite'dan PostgreSQL'e geçiş için gereken adımları açıklar.

## 📋 Gereksinimler

- PostgreSQL veritabanı (Render PostgreSQL önerilir)
- Node.js 18+
- Mevcut SQLite database dosyanız (veri taşıması için)

## 🚀 Adım 1: Render PostgreSQL Oluşturma

1. **Render Dashboard'a gidin**: https://dashboard.render.com
2. **"New +" butonuna tıklayın** → "PostgreSQL" seçin
3. **Ayarları yapın**:
   - Name: `kisisel-website-postgres`
   - Region: `Frankfurt` (backend ile aynı bölge)
   - Database: `tourism_db`
   - User: `tourism_user`
   - Plan: `Starter ($7/month)`
4. **"Create Database" butonuna tıklayın**
5. **DATABASE_URL**'i kopyalayın (Internal Database URL kullanın)

## 🔧 Adım 2: Local Ortamda Test

### 1. Package'leri yükleyin:

```bash
cd backend
npm install
```

### 2. `.env` dosyasını oluşturun:

```bash
# .env dosyası
DATABASE_URL=postgresql://your_username:your_password@your_host:5432/your_database
NODE_ENV=development
PORT=3001
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. PostgreSQL backend'i test edin:

```bash
node index-postgres.js
```

Başarılı bağlantı mesajını görmelisiniz:

```
✅ Connected to PostgreSQL database
✅ Database tables initialized
```

## 📦 Adım 3: Veri Taşıma (Migration)

### Mevcut SQLite veritabanınızdan PostgreSQL'e veri taşıyın:

```bash
# SQLite database dosya yolunu ayarlayın
SQLITE_PATH=./database.sqlite npm run migrate

# Veya doğrudan:
node migrate-to-postgres.js
```

Migration script şunları yapacak:

- ✅ Destinations (Destinasyonlar)
- ✅ Tours (Turlar)
- ✅ Users (Admin kullanıcıları)
- ✅ Rental Cars (Kiralık Arabalar)
- ✅ Gallery (Galeri)
- ✅ Tour Pricing (Tur Fiyatlandırma)

### Migration başarılı olursa göreceğiniz çıktı:

```
🔄 Starting migration from SQLite to PostgreSQL...
✅ Connected to SQLite database
✅ Connected to PostgreSQL database

📦 Migrating destinations...
   ✅ Migrated 3 destinations
📦 Migrating tours...
   ✅ Migrated 5 tours
📦 Migrating users...
   ✅ Migrated 1 users
...

🎉 Migration completed successfully!
```

## 🌐 Adım 4: Render'a Deploy

### 1. Backend'i güncelle

Eski `index.js` dosyasını yedekleyin ve yeni dosyayı kullanın:

```bash
# Backend klasöründe
mv index.js index-sqlite-backup.js
mv index-postgres.js index.js
```

### 2. Render.yaml'ı güncelleyin (zaten güncellenmiş)

Render otomatik olarak yeni yapılandırmayı algılayacak.

### 3. Environment Variables'ı ayarlayın

Render Dashboard'da backend service'inize gidin:

1. "Environment" tab'ına tıklayın
2. `DATABASE_URL` var mı kontrol edin (PostgreSQL'den otomatik gelir)
3. Diğer environment variables'ları ekleyin:
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 4. Deploy edin

```bash
git add .
git commit -m "Migrate to PostgreSQL"
git push origin main
```

Render otomatik deploy başlatacak.

## 🔍 Adım 5: Doğrulama

### 1. Backend sağlık kontrolü:

```bash
curl https://YOUR-BACKEND-URL.onrender.com/api/health
```

Yanıt:

```json
{
  "status": "OK",
  "timestamp": "2026-01-20T...",
  "database": "PostgreSQL"
}
```

### 2. Login test edin:

```bash
curl -X POST https://YOUR-BACKEND-URL.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. Verileri kontrol edin:

```bash
curl https://YOUR-BACKEND-URL.onrender.com/api/destinations
curl https://YOUR-BACKEND-URL.onrender.com/api/tours
```

## ✨ Yeni Özellikler

### 1. Multi-Admin Desteği

PostgreSQL versiyonu artık birden fazla admin kullanıcı destekliyor:

```javascript
// Admin listesi (sadece super_admin)
GET /api/admin/users

// Yeni admin oluştur
POST /api/admin/users
{
  "username": "newadmin",
  "password": "securepassword",
  "email": "admin@example.com",
  "full_name": "Admin Name",
  "role": "admin"  // veya "super_admin"
}

// Admin güncelle
PUT /api/admin/users/:id
{
  "email": "newemail@example.com",
  "full_name": "Updated Name",
  "role": "admin",
  "is_active": true
}

// Admin sil
DELETE /api/admin/users/:id

// Activity log
GET /api/admin/activity-log
```

### 2. Activity Logging

Tüm admin işlemleri otomatik olarak loglanır:

- Login
- Create/Update/Delete operations
- Password changes

### 3. Role-Based Access

- `super_admin`: Tüm yetkilere sahip, diğer adminleri yönetebilir
- `admin`: Sadece içerik yönetimi (turlar, destinasyonlar, vb.)

## 🛠️ Troubleshooting

### Bağlantı hatası:

```
Error: connect ECONNREFUSED
```

**Çözüm**: DATABASE_URL'in doğru olduğundan emin olun.

### SSL hatası:

```
Error: self signed certificate
```

**Çözüm**: `.env` dosyasında `NODE_ENV=production` olduğundan emin olun.

### Migration hatası:

```
Error: relation "destinations" already exists
```

**Çözüm**: Tablolar zaten var. Migration'ı tekrar çalıştırmanıza gerek yok.

## 🔄 Rollback (Geri Dönüş)

Eğer sorun yaşarsanız SQLite'a geri dönebilirsiniz:

```bash
cd backend
mv index.js index-postgres.js
mv index-sqlite-backup.js index.js
git add .
git commit -m "Rollback to SQLite"
git push origin main
```

## 📊 PostgreSQL vs SQLite Farklar

| Özellik         | SQLite      | PostgreSQL |
| --------------- | ----------- | ---------- |
| Yedekleme       | Manuel      | Otomatik   |
| Ölçekleme       | Yok         | Var        |
| Eşzamanlı yazma | Sınırlı     | Tam destek |
| Multi-admin     | Zor         | Kolay      |
| Performans      | Orta        | Yüksek     |
| Maliyet         | $0 (+ disk) | $7/ay      |

## 📞 Destek

Sorun yaşarsanız:

1. Render logs'ları kontrol edin
2. PostgreSQL connection string'i doğrulayın
3. Environment variables'ları kontrol edin

## ✅ Checklist

- [ ] Render PostgreSQL oluşturuldu
- [ ] DATABASE_URL alındı
- [ ] Local'de test edildi
- [ ] Migration çalıştırıldı
- [ ] Backend güncellendi
- [ ] Render'a deploy edildi
- [ ] Health check başarılı
- [ ] Login test edildi
- [ ] Veriler kontrol edildi
- [ ] Default admin şifresi değiştirildi

🎉 Tebrikler! PostgreSQL'e başarıyla geçtiniz.
