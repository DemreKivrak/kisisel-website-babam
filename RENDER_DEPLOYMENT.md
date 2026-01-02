# Render.com Deployment Guide

## 📋 Gereksinimler

- GitHub hesabı
- Render.com hesabı
- Cloudinary hesabı (mevcut)
- Mevcut database.sqlite dosyanız

---

## 🚀 Adım 1: GitHub'a Push

```bash
# Projenizi GitHub'a yükleyin (henüz yapmadıysanız)
git add .
git commit -m "Render deployment için hazırlık"
git push origin main
```

---

## 🔧 Adım 2: Render.com'da Proje Oluşturma

### A) Blueprint Kullanarak (ÖNERİLEN - Otomatik)

1. **Render Dashboard** → [New Blueprint](https://dashboard.render.com/select-repo?type=blueprint)
2. GitHub reponuzu seçin: `DokiDokiDesu/kisisel-website-babam`
3. `render.yaml` dosyası otomatik algılanacak
4. "Apply" butonuna tıklayın

### B) Manuel Kurulum (Alternatif)

Eğer Blueprint çalışmazsa:

#### Backend Servisi:

1. **New** → **Web Service**
2. GitHub repo: `kisisel-website-babam`
3. Ayarlar:
   - **Name**: `kisisel-website-backend`
   - **Region**: Frankfurt (veya Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Starter ($7/month)

#### Frontend Servisi:

1. **New** → **Static Site**
2. GitHub repo: `kisisel-website-babam`
3. Ayarlar:
   - **Name**: `kisisel-website-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

---

## 🔐 Adım 3: Environment Variables (Backend)

Backend servisinizde **Environment** sekmesine gidin:

### Zorunlu Variables:

```bash
# Database (Persistent Disk için)
DB_PATH=/data/database.sqlite

# Node Environment
NODE_ENV=production
PORT=10000

# JWT Secret (Generate Random Secret üretin)
JWT_SECRET=super_gizli_random_string_buraya

# Frontend URL (frontend URL'inizi backend oluşturduktan sonra güncelleyin)
FRONTEND_URL=https://kisisel-website-frontend.onrender.com

# Cloudinary (Mevcut değerlerinizi girin)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### JWT_SECRET Nasıl Üretilir?

Render'da "Generate" butonuna tıklayın veya:

```bash
# Terminalden:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 💾 Adım 4: Persistent Disk Ekleme (BACKEND)

Backend servisinizde:

1. **Storage** sekmesine gidin
2. **Add Disk** butonuna tıklayın
3. Ayarlar:
   - **Name**: `database-disk`
   - **Mount Path**: `/data`
   - **Size**: 1 GB
4. **Create Disk** → Servis yeniden deploy olacak

---

## 🌐 Adım 5: Frontend Environment Variables

Frontend servisinizde **Environment** sekmesine gidin:

```bash
# Backend API URL (backend URL'inizi buraya girin)
VITE_API_URL=https://kisisel-website-backend.onrender.com/api
```

**NOT**: Backend servisiniz deploy olduktan sonra URL'yi kopyalayıp buraya yapıştırın.

---

## 📤 Adım 6: Mevcut Database'i Yükleme

### Seçenek A: SSH ile (Backend Deploy Olduktan Sonra)

1. Render Dashboard → Backend Service → **Shell** sekmesi
2. Terminalden:

```bash
# Lokal database'inizi base64'e çevirin (kendi bilgisayarınızda)
# Windows:
certutil -encode database.sqlite database.txt

# Render Shell'de:
cd /data
# Base64 decode (database içeriğini yapıştırın)
cat > database.sqlite
# Ctrl+D ile kaydedin
```

### Seçenek B: API ile Admin Üzerinden

Alternatif olarak admin panelinden yeni veriler ekleyebilirsiniz.

---

## ✅ Adım 7: Test ve Doğrulama

### Backend Testi:

```bash
curl https://kisisel-website-backend.onrender.com/api/destinations
```

### Frontend Testi:

Tarayıcıda: `https://kisisel-website-frontend.onrender.com`

---

## 🔄 Sonraki Deploymentlar

Her `git push` sonrası:

- Backend ve Frontend **otomatik** deploy olur
- Database `/data` klasöründe **KORUNUR** ✅
- Hiçbir veri kaybı olmaz

---

## 💰 Maliyet Özeti

| Servis                 | Maliyet   |
| ---------------------- | --------- |
| Backend (Starter Plan) | $7/ay     |
| Persistent Disk (1GB)  | $1/ay     |
| Frontend (Static Site) | ÜCRETSİZ  |
| **TOPLAM**             | **$8/ay** |

---

## 🐛 Sorun Giderme

### Problem: "Cannot find module"

**Çözüm**: `package.json`'da tüm dependencies var mı kontrol edin

### Problem: Database empty

**Çözüm**: Persistent disk doğru mount edildi mi? `/data` path'i doğru mu?

### Problem: CORS hatası

**Çözüm**: Backend'de `FRONTEND_URL` environment variable'ı doğru mu?

### Problem: 502 Bad Gateway

**Çözüm**: Backend loglarını kontrol edin, `PORT` environment variable 10000 olmalı

---

## 📞 Yardım

Render Docs: https://render.com/docs
Support: https://render.com/support

---

## 🎉 Tamamlandı!

Projeniz artık Render.com'da çalışıyor ve database persistent disk ile korunuyor!
