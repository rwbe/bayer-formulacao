# 🚀 Guia Completo de Deployment - Bayer Formulação

## 📋 Sumário

- [Arquitetura](#arquitetura)
- [Setup Local](#setup-local)
- [Deploy Backend](#deploy-backend)
- [Deploy Frontend](#deploy-frontend)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Banco de Dados](#banco-de-dados)
- [Segurança](#segurança)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

```
┌─────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│   Frontend      │          │    Backend       │          │   MongoDB        │
│   (React Native)│◄────────►│    (FastAPI)     │◄────────►│    Atlas/Local   │
│   Expo Router   │  HTTP    │                  │  Motor   │                  │
└─────────────────┘          └──────────────────┘          └──────────────────┘
     Web/Mobile                 Python 3.11+                  Replicaset
```

### Stack

- **Frontend**: React Native (Expo Router), TypeScript
- **Backend**: FastAPI, Motor (async MongoDB driver)
- **Database**: MongoDB (Atlas ou Self-hosted)
- **Auth**: JWT + SecureStore (mobile)

---

## 🏠 Setup Local

### Pré-requisitos

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- MongoDB 5.0+ (local ou Atlas)
- Git

### Clone e Setup

```bash
# Clone o repositório
git clone <repo-url>
cd bayer-formulacao-v2
# Frontend
npm install
# Backend
cd backend
pip install -r requirements.txt
```

### Configurar .env Local

**Backend** (`backend/.env`):

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=bayer_production
JWT_SECRET=dev-secret-change-in-production
ADMIN_EMAIL=admin@bayer.com
ADMIN_PASSWORD=changeme123
CORS_ORIGINS=*
```

**Frontend** (`.env.local`):

```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Rodar Localmente

**Backend**:

```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**:

```bash
npm run web
# ou
npm run android
npm run ios
```

---

## ☁️ Deploy Backend

### Opção 1: Render (Recomendado - Freemium)

#### Setup

1. **Criar conta**: https://render.com
2. **Criar PostgreSQL** (ou usar MongoDB Atlas):
   - Novo → PostgreSQL
   - Plan: Free (0.4GB)
   - Salvar credentials
3. **Criar Web Service**:
   - Novo → Web Service
   - Conectar repo GitHub
   - Runtime: Python 3.11
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn server:app --host 0.0.0.0 --port 8000`
4. **Variáveis de Ambiente** (no painel Render):
   ```
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net
   DB_NAME=bayer_production
   JWT_SECRET=<gerar-secret-seguro>
   ADMIN_EMAIL=admin@seu-dominio.com
   ADMIN_PASSWORD=<senha-forte>
   CORS_ORIGINS=https://seu-dominio.com,https://web-app-url.com
   ```
5. **Deploy**: Render faz auto-deploy ao push para `main`
   **Custo**: Gratuito (com limitações de RAM/CPU), $7/mês para produção

---

### Opção 2: Railway (Alternativa)

1. **Criar conta**: https://railway.app
2. **Conectar repo GitHub**
3. **Criar MongoDB plugin**:
   - Adicionar Plugin → MongoDB
4. **Criar Web Service**:
   - Novo → Repo GitHub
   - Root directory: `backend`
   - Start command: `uvicorn server:app --host 0.0.0.0 --port 8000`
5. **Variáveis de Ambiente** (Railway gera `MONGO_URL` automaticamente):
   ```
   DB_NAME=bayer_production
   JWT_SECRET=<secret>
   ADMIN_EMAIL=admin@seu-dominio.com
   ADMIN_PASSWORD=<senha>
   CORS_ORIGINS=https://seu-dominio.com
   ```
   **Custo**: $5/mês de crédito, pré-pago

---

### Opção 3: Heroku (Descontinuado, não recomendado)

## Heroku deprecou seu free tier. Use Render ou Railway.

### Opção 4: DigitalOcean App Platform

1. **Criar conta**: https://www.digitalocean.com
2. **Create App**:
   - Select repo GitHub
   - Detecta `requirements.txt` automaticamente
   - Configure HTTP port: 8000
3. **Variáveis**:
   ```
   MONGO_URL=mongodb+srv://...
   (outras conforme acima)
   ```
   **Custo**: $12/mês (mínimo)

---

## 📱 Deploy Frontend

### Opção 1: Expo Go (Desenvolvimento)

Não recomendado para produção, mas útil para testing:

```bash
npm run web  # Web preview
npm start    # Expo Go
```

---

### Opção 2: Expo EAS (Recomendado)

Gera binários iOS/Android prontos para App Store/Play Store.

#### Setup

```bash
npm install -g eas-cli
eas login
# No projeto
eas build --platform all  # iOS + Android
```

## **Custo**: Free (com limitações), $99+/mês para custom

### Opção 3: Web App (React Native Web)

Deploy em Vercel/Netlify:

```bash
# Build
npm run web:build
# Deploy (Vercel)
vercel deploy --prod
```

## **Custo**: Gratuito (Vercel/Netlify)

### Opção 4: AWS S3 + CloudFront

```bash
npm run web:build
aws s3 sync dist/ s3://seu-bucket/
# CloudFront invalida cache
```

## **Custo**: $0.085/GB transferência (uso baixo = grátis)

## 🔐 Variáveis de Ambiente

### Backend

| Variável         | Exemplo                                       | Descrição                 |
| ---------------- | --------------------------------------------- | ------------------------- |
| `MONGO_URL`      | `mongodb+srv://user:pass@cluster.mongodb.net` | Connection string MongoDB |
| `DB_NAME`        | `bayer_production`                            | Nome do banco de dados    |
| `JWT_SECRET`     | (32+ chars)                                   | Chave para assinar JWT    |
| `ADMIN_EMAIL`    | `admin@bayer.com`                             | Email do admin inicial    |
| `ADMIN_PASSWORD` | (8+ chars)                                    | Senha do admin inicial    |
| `CORS_ORIGINS`   | `https://app.com,https://web.com`             | Origens permitidas        |

### Frontend

| Variável                  | Exemplo                       | Descrição  |
| ------------------------- | ----------------------------- | ---------- |
| `EXPO_PUBLIC_BACKEND_URL` | `https://api.seu-dominio.com` | URL da API |

### Gerar Secret Seguro

```bash
# macOS/Linux
openssl rand -base64 32
# Windows (PowerShell)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## 💾 Banco de Dados

### MongoDB Atlas (Cloud - Recomendado)

1. **Criar conta**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**:
   - Plan: Free (512MB)
   - Region: São Paulo (sa-east-1)
3. **Network Access**:
   - IP Whitelist: `0.0.0.0/0` (ou restringir a IPs do backend)
4. **Connection String**:
   ```
   mongodb+srv://user:password@cluster.mongodb.net/bayer_production
   ```

### MongoDB Local

Para desenvolvimento:

```bash
# Docker
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
# Connection
mongodb://admin:password@localhost:27017
```

### Backup & Restauração

**Atlas (automático)**: Free tier backup a cada 6 horas
**Manual**:

```bash
# Backup
mongodump --uri="mongodb+srv://user:pass@cluster" --out=./backup
# Restaurar
mongorestore --uri="mongodb+srv://user:pass@cluster" ./backup
```

---

## 🔒 Segurança

### Checklist

- [ ] **JWT Secret**: 32+ caracteres aleatórios
- [ ] **HTTPS**: Certificado SSL/TLS (Render/Railway incluem)
- [ ] **CORS**: Restringir apenas domínios conhecidos
- [ ] **Senhas**: Mínimo 8 caracteres, hash bcrypt
- [ ] **Rate Limiting**: Implementar (FastAPI limiter)
- [ ] **Input Validation**: Pydantic models validam tipos
- [ ] **Database**: Usar credenciais fortes, IP whitelist
- [ ] **Env Vars**: Nunca commitar `.env` no Git
- [ ] **Dependencies**: `pip audit` para vulnerabilidades

### Implementar Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address)
@api_router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, payload: LoginRequest):
    ...
```

### Implementar HTTPS

## Render/Railway auto-renovam certificados SSL. Configure `CORS_ORIGINS` com `https://`.

## 📊 Monitoramento

### Logs

**Render/Railway**: Painel → Logs

```bash
# Backend logs
tail -f /var/log/app.log
```

### Health Check

Adicionar endpoint:

```python
@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc),
        "database": "connected"  # validar
    }
```

### Alertas

**Render**: Integra com Datadog
**Railway**: Integra com Sentry para erro tracking

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Automático)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install deps
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run lint
        run: |
          cd backend
          pip install flake8
          flake8 server.py --max-line-length=120
```

---

## 🚀 Deployment Checklist

### Pré-Deploy

```bash
# 1. Testar localmente
npm run web
cd backend && python -m uvicorn server:app --reload
# 2. Verificar variáveis
echo $MONGO_URL
echo $EXPO_PUBLIC_BACKEND_URL
# 3. Build test
npm run build (se existir)
# 4. Lint
cd backend && flake8 server.py
npm run lint
```

### Deploy

**Backend (Render)**:

```bash
git push origin main  # Auto-deploy
```

**Frontend (Expo)**:

```bash
eas update --branch production  # OTA update
# ou
eas build --platform all
```

### Pós-Deploy

```bash
# Verificar saúde
curl https://api-seu-dominio.com/api/health
# Testar login
curl -X POST https://api-seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bayer.com","password":"..."}'
# Verificar CORS
curl -H "Origin: https://seu-dominio.com" \
  https://api-seu-dominio.com/api/health
```

---

## 🆘 Troubleshooting

### "CORS error" no frontend

**Solução**:

1. Verificar `CORS_ORIGINS` no backend
2. Adicionar domínio correto
3. Restart backend

```python
# backend/server.py
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
```

### "Connection timeout" no MongoDB

**Causas**:

- IP não whitelistado (Atlas)
- Connection string errada
- Rede do host bloqueada
  **Solução**:

```bash
# Testar conexão
python -c "import pymongo; pymongo.MongoClient('MONGO_URL').admin.command('ping')"
```

### "Port already in use"

```bash
# Matar processo na porta 8000
lsof -i :8000
kill -9 <PID>
```

### "Module not found"

```bash
# Reinstalar dependências
cd backend
pip install --upgrade -r requirements.txt
```

---

## 📞 Suporte

- **Render Docs**: https://render.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas
- **Expo Docs**: https://docs.expo.dev

---

## 🎯 Próximos Passos

1. **Escolher plataforma**: Render (recomendado) ou Railway
2. **Configurar MongoDB Atlas**: Criar cluster free
3. **Deploy Backend**: Push para auto-deploy
4. **Deploy Frontend**: Build + Expo EAS ou Vercel
5. **Testar integração**: Verificar conexão API
6. **Monitorar logs**: Setup alertas no painel
7. **Backup automático**: Verificar retention policy

---

**Última atualização**: Maio 2026
**Status**: Pronto para produção
