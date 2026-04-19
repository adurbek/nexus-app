# ⚡ Nexus — Smart Dashboard

React + Vite bilan qurilgan zamonaviy shaxsiy dashboard ilovasi.

## 🚀 O'rnatish

```bash
cd nexus-app
npm install
npm run dev
```

Brauzerda `http://localhost:5173` oching.

## 🔑 API Kalitlar

`.env.example` → `.env` ga nusxa oling va to'ldiring:

| Kalit | Nima uchun | Qayerdan |
|-------|-----------|----------|
| `VITE_ANTHROPIC_API_KEY` | AI Chat | console.anthropic.com |
| `VITE_YT_API_KEY` | YouTube musiqa qidiruvi | console.cloud.google.com → YouTube Data API v3 |

> Kalitlarsiz ham ishlaydi — demo rejimda.

## 📁 Struktura

```
src/
├── App.jsx
├── main.jsx
├── styles/global.css
├── store/useStore.js        ← Auth + localStorage
├── components/
│   ├── Icons.jsx
│   ├── Modal.jsx
│   ├── Sidebar.jsx          ← Desktop chap nav
│   ├── MobileNav.jsx        ← Mobil pastki nav
│   └── ProfileModal.jsx     ← Profil tahrirlash
└── pages/
    ├── AuthPage.jsx         ← Login / Ro'yxat
    ├── HomePage.jsx         ← Dashboard
    ├── MusicPage.jsx        ← Pleyer + YouTube qidiruv
    ├── LampPage.jsx         ← Notion notepad
    ├── AIPage.jsx           ← Claude AI chat
    └── SavePage.jsx         ← Fotoalbom + kamera
```

## 📱 Responsive
- Desktop → Chap qora sidebar
- Mobil/Planshet → Pastki navigatsiya

## 🛠️ Build
```bash
npm run build
```
