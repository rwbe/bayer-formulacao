# Bayer Formulacao - Sistema de Controle Industrial

Sistema de controle de producao para a area de Formulacao da Bayer.
Funciona no Expo Go (mobile) e no navegador web.

---

## Estrutura do Projeto

    bayer-app/
    app/
      (tabs)/
        index.tsx      - Planilha de producao (dashboard)
        guide.tsx      - Guia de Formulacao (produtos + receitas)
        report.tsx     - Relatorio WhatsApp
        settings.tsx   - Configuracoes
      login.tsx        - Tela de login
      _layout.tsx      - Layout raiz
    src/
      auth.tsx         - Autenticacao + modo demo offline
      theme.tsx        - Temas (claro/escuro)
      types.ts         - Tipos TypeScript
      StatusPill.tsx   - Componente de status
    backend/
      server.py        - API FastAPI (Python)
      requirements.txt - Dependencias Python
      .env.example     - Template de variaveis de ambiente

---

## Inicio Rapido

### 1. Instalar dependencias

    npm install

### 2. Iniciar no navegador (web)

    npx expo start --web

Acesse: http://localhost:8081

### 3. Iniciar no celular (Expo Go)

    npx expo start

Escaneie o QR code com o app Expo Go.

### Conta demo (sem backend)

    Email: admin@bayer.com
    Senha: admin123

    Email: operador@bayer.com
    Senha: op123

---

## Configurar o Backend

### Passo 1: Instalar dependencias Python

    cd backend
    pip install -r requirements.txt

### Passo 2: Configurar variaveis de ambiente

    cd backend
    cp .env.example .env

Edite o arquivo .env:

    MONGO_URL=mongodb://localhost:27017
    DB_NAME=bayer_production
    JWT_SECRET=minha-chave-secreta-longa

### Passo 3: Iniciar o backend

    cd backend
    uvicorn server:app --reload --host 0.0.0.0 --port 8000

Servidor em: http://localhost:8000
Documentacao: http://localhost:8000/docs

---

## Conectar App ao Backend (Celular)

### Opcao A: IP local (mesma rede Wi-Fi)

1. Descubra o IP do PC:
   - Windows: ipconfig
   - Mac/Linux: ifconfig ou ip addr
   - Exemplo: 192.168.1.10

2. Crie o arquivo .env na raiz do projeto:

       EXPO_PUBLIC_BACKEND_URL=http://192.168.1.10:8000

3. Inicie o backend com --host 0.0.0.0:

       uvicorn server:app --reload --host 0.0.0.0 --port 8000

4. Celular e PC devem estar na mesma rede Wi-Fi

### Opcao B: ngrok (qualquer rede, ignora firewall)

    npm install -g ngrok
    ngrok http 8000

Copie a URL (ex: https://abc123.ngrok-free.app) e coloque no .env:

    EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok-free.app

### Opcao C: Backend em nuvem (producao)

Hospede em Railway, Render ou outro servidor e use o endereco fixo.

---

## Modo Demonstracao (offline)

Se o backend nao estiver disponivel, o app usa modo demo automaticamente.

Contas demo disponiveis:

    admin@bayer.com / admin123  - Administrador
    operador@bayer.com / op123  - Operador

No modo demo, dados nao sao persistidos no servidor.

---

## Solucao de Problemas

### Network Error no Expo Go

1. Verifique se backend esta rodando
2. Use EXPO_PUBLIC_BACKEND_URL com IP correto (nao localhost)
3. Celular e PC na mesma rede Wi-Fi
4. Tente usar ngrok para contornar firewalls
5. Ou use a conta demo (funciona sem backend)

### Connection refused

- Execute: uvicorn server:app --reload --host 0.0.0.0 --port 8000

### MongoDB connection failed

- Verifique se MongoDB esta ativo
- Confirme MONGO_URL no .env

### Input nao aceita digitacao no navegador

- Bug corrigido na versao atual

---

## Identidade Visual

- Verde Bayer: #009A44
- Azul Bayer: #10069F
- Suporte a modo escuro e claro
- Interface responsiva para mobile e web

---

## Scripts

    npm run start   - Expo (mobile/QR)
    npm run web     - Expo web (porta 8081)
    npm run lint    - Verificar erros
