# Romanos Oito 🕊️

> Site oficial do movimento católico **Romanos Oito** — uma plataforma web moderna para conectar, engajar e servir a comunidade do movimento.

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-2.x-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Stripe" src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-private-red?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://romanosoito.com/oikos" target="_blank">
    🌐 Acessar o site em produção →
  </a>
</p>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Rodando com Docker](#-rodando-com-docker)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **Romanos Oito** é um movimento católico com presença digital construída sobre uma stack moderna, performática e escalável. A plataforma oferece uma experiência fluida ao usuário, integrando autenticação, pagamentos e conteúdo dinâmico gerenciado via Supabase.

O nome do projeto é uma referência ao oitavo capítulo da Carta de Paulo aos Romanos — um dos textos mais profundos do Novo Testamento sobre vida no Espírito.

---

## ✨ Funcionalidades

- 🔐 **Autenticação de usuários** via Supabase Auth
- 💳 **Processamento de pagamentos** integrado com Stripe
- 📱 **Design responsivo** — funciona em qualquer dispositivo
- 🎨 **Componentes acessíveis** com shadcn/ui + Radix UI
- 🌙 **Suporte a tema claro/escuro** via next-themes
- 🎞️ **Animações fluidas** com Framer Motion
- 📅 **Seleção de datas** com react-day-picker
- 📊 **Visualização de dados** com Recharts
- 📋 **Formulários validados** com React Hook Form + Zod
- 📁 **Exportação para Excel** com xlsx
- 🔔 **Notificações toast** com Sonner
- ⚡ **Carrossel** com Embla Carousel

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| **Frontend** | React | 18.x |
| **Linguagem** | TypeScript | 5.x |
| **Build Tool** | Vite + SWC | 5.x |
| **Estilização** | Tailwind CSS | 3.x |
| **Componentes UI** | shadcn/ui + Radix UI | latest |
| **Animações** | Framer Motion | 12.x |
| **Roteamento** | React Router DOM | 6.x |
| **Server State** | TanStack React Query | 5.x |
| **Formulários** | React Hook Form | 7.x |
| **Validação** | Zod | 3.x |
| **Backend / Auth / DB** | Supabase | 2.x |
| **Pagamentos** | Stripe | 20.x |
| **Testes** | Vitest + Testing Library | 3.x |
| **Servidor Web** | Nginx | stable |
| **Containerização** | Docker | — |

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) `>= 20`
- [npm](https://www.npmjs.com/) ou [bun](https://bun.sh/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) *(opcional, somente para ambiente de produção)*

Você também vai precisar de contas ativas em:
- [Supabase](https://supabase.com) — para banco de dados e autenticação
- [Stripe](https://stripe.com) — para processamento de pagamentos

---

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/augustobernardo/romanos_oito.git

# 2. Entre na pasta do projeto
cd romanos_oito

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais (veja a seção abaixo)

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:8080](http://localhost:8080) no seu navegador.

> 💡 O servidor de desenvolvimento usa a porta `8080` conforme configurado no `vite.config.ts`.

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxx
```

> ⚠️ **Atenção:** nunca commite o arquivo `.env` com dados reais. Ele já está incluído no `.gitignore`. Para produção, use variáveis de ambiente configuradas diretamente no servidor ou na plataforma de deploy.

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot reload na porta 8080 |
| `npm run build` | Gera o build de produção otimizado na pasta `/dist` |
| `npm run build:dev` | Gera o build em modo desenvolvimento (útil para debug) |
| `npm run preview` | Pré-visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint e aponta problemas no código |
| `npm run test` | Executa todos os testes uma única vez |
| `npm run test:watch` | Executa os testes em modo watch (ideal durante o desenvolvimento) |

---

## 📁 Estrutura do Projeto

```
romanos_oito/
├── public/                  # Arquivos estáticos públicos (favicon, imagens, etc.)
├── src/
│   ├── components/          # Componentes reutilizáveis da aplicação
│   │   └── ui/              # Componentes base gerados pelo shadcn/ui
│   ├── hooks/               # Custom hooks reutilizáveis
│   ├── lib/                 # Utilitários, helpers e configurações (ex: supabase client)
│   ├── pages/               # Páginas da aplicação (cada arquivo = uma rota)
│   ├── index.css            # Estilos globais e variáveis CSS do Tailwind
│   └── main.tsx             # Ponto de entrada da aplicação
├── supabase/                # Configurações, migrações e funções do Supabase
├── Dockerfile               # Multi-stage build para produção (Node → Nginx)
├── nginx.conf               # Configuração do servidor Nginx
├── components.json          # Configuração do shadcn/ui (tema slate, CSS variables)
├── tailwind.config.ts       # Configuração e customização do Tailwind CSS
├── vite.config.ts           # Configuração do Vite (alias @/, porta 8080)
├── vitest.config.ts         # Configuração dos testes com Vitest
├── tsconfig.json            # Configuração principal do TypeScript
└── package.json             # Dependências e scripts do projeto
```

---

## 🐳 Rodando com Docker

O projeto possui um `Dockerfile` com **multi-stage build** — a aplicação é compilada com Node.js 20 e servida com Nginx em produção, resultando em uma imagem final leve e otimizada.

```bash
# Build da imagem Docker
docker build -t romanos-oito .

# Rodar o container na porta 80
docker run -p 80:80 romanos-oito
```

Acesse [http://localhost](http://localhost) no seu navegador.

**Etapas do build:**

| Estágio | Base | Responsabilidade |
|---|---|---|
| `build` | `node:20` | Instala dependências e compila a aplicação |
| `production` | `nginx:stable` | Serve os arquivos estáticos gerados |

---

## 🧪 Testes

O projeto utiliza **Vitest** com **Testing Library** para testes de componentes e unidade.

```bash
# Rodar todos os testes
npm run test

# Rodar em modo watch (ideal durante o desenvolvimento)
npm run test:watch
```

Os testes ficam localizados próximos aos arquivos que testam, seguindo a convenção `*.test.tsx` ou `*.spec.tsx`.

---

## 🚢 Deploy

O projeto está configurado para deploy via **Docker + Nginx**, com um pipeline de qualidade protegendo a branch `main`.

### Pipeline completo

```
feat/* ou fix/*
      ↓
   develop  ←─── GitHub Actions ───→  ✅ testes + 🔒 segurança
      ↓ (aprovado)
     main
      ↓
   Docker build (Node 20 → Nginx)
      ↓
  romanosoito.com
```

### GitHub Actions

Ao abrir um Pull Request para `develop`, as seguintes verificações são executadas automaticamente:

| Action | Descrição |
|---|---|
| ✅ **Testes** | Executa `vitest` para garantir que nada quebrou |
| 🔒 **Segurança** | Analisa o código em busca de vulnerabilidades |

O merge para `main` só é permitido após todas as Actions passarem com sucesso.

### Build de produção

O `Dockerfile` utiliza **multi-stage build**:

| Estágio | Base | Responsabilidade |
|---|---|---|
| `build` | `node:20` | Instala dependências e compila a aplicação |
| `production` | `nginx:stable` | Serve os arquivos estáticos gerados |

O site está disponível em produção em: **[romanosoito.com](https://romanosoito.com)**

---

## 🤝 Contribuindo

Este projeto segue um fluxo de branches protegido para garantir qualidade e segurança antes de qualquer alteração chegar à produção.

### Fluxo de branches

```
feat/minha-feature  →  develop  →  main
                           ↓
                     GitHub Actions
                   (testes + segurança)
```

| Branch | Propósito |
|---|---|
| `main` | Produção — código estável e validado |
| `develop` | Integração — onde as features se encontram antes de ir para produção |
| `feat/*` | Features individuais em desenvolvimento |
| `fix/*` | Correções de bugs |

### Passo a passo

1. Crie sua branch a partir de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/minha-feature
   ```

2. Desenvolva e commite suas alterações seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):
   ```bash
   git commit -m "feat: adiciona minha feature"
   ```

3. Faça o push e abra um Pull Request **para a branch `develop`**:
   ```bash
   git push origin feat/minha-feature
   ```

4. As **GitHub Actions** serão executadas automaticamente ao abrir o PR para `develop`:
   - ✅ Testes automatizados (`vitest`)
   - 🔒 Verificações de segurança

5. Após aprovação e Actions passando, o merge é feito em `develop`.

6. Quando `develop` estiver estável, abre-se um PR de `develop` → `main` para o deploy em produção.

> ⚠️ **Nunca abra Pull Requests diretamente para `main`.** Todo código deve passar pela `develop` e pelas Actions antes.

### Padrão de prefixos para commits

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Alteração em documentação |
| `style:` | Formatação, sem mudança de lógica |
| `refactor:` | Refatoração de código |
| `test:` | Adição ou ajuste de testes |
| `chore:` | Tarefas de manutenção e configuração |

---

## 📄 Licença

Este projeto é privado e de uso exclusivo do movimento **Romanos Oito**. Todos os direitos reservados.
