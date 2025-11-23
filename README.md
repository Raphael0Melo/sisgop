# BPA - Sistema de Gestão Operacional

Sistema migrado de React para Next.js com TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **Firebase** - Backend como serviço (autenticação e banco de dados)
- **Lucide React** - Ícones modernos
- **React Toastify** - Notificações elegantes

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── page.tsx           # Página de login
│   ├── home/              # Dashboard principal
│   ├── controlcar/        # Controle de acesso de veículos
│   ├── homebookday/       # Livro do dia
│   ├── homeproductivity/  # Produtividade
│   └── homemapforce/      # Mapa de força
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes shadcn/ui
│   ├── Layout/           # Componentes de layout
│   └── ProtectedRoute.tsx # Proteção de rotas
├── context/              # Contextos React
│   └── AuthContext.tsx   # Contexto de autenticação
├── lib/                  # Configurações e utilitários
│   ├── firebase.ts       # Configuração Firebase
│   └── utils.ts          # Utilitários gerais
└── types/                # Definições TypeScript
    └── index.ts          # Tipos principais
```

## 🔧 Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.local.example` para `.env.local` e configure suas credenciais do Firebase:

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com suas configurações do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🔐 Credenciais de Teste (Modo Demo)

Para testar a aplicação, use uma das seguintes credenciais:

**Usuário Padrão:**
- Email: `demo@bpa.com`
- Senha: `demo123`

**Administrador:**
- Email: `admin@bpa.com`
- Senha: `admin123`

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- Login com email e senha
- Proteção de rotas
- Persistência de sessão
- Logout seguro

### ✅ Dashboard Principal
- Visão geral do sistema
- Navegação por módulos
- Controle de acesso baseado em perfil

### ✅ Módulos Principais
- **Controle de Acesso**: Gerenciamento de entrada/saída de veículos
- **Livro do Dia**: Registro de ocorrências diárias
- **Produtividade**: Métricas e indicadores
- **Mapa de Força**: Distribuição de unidades operacionais

### ✅ Interface Moderna
- Design responsivo
- Sidebar de navegação
- Componentes acessíveis
- Tema consistente

## 🎨 Componentes shadcn/ui Utilizados

- Button
- Input
- Card
- Table
- Dialog
- Form
- Select
- Textarea
- Badge
- Label

## 🔄 Principais Melhorias da Migração

### De React para Next.js:
1. **Roteamento**: App Router do Next.js 15
2. **Performance**: Server-side rendering e otimizações automáticas
3. **SEO**: Melhor indexação e meta tags
4. **Bundle**: Otimização automática de código

### De JavaScript para TypeScript:
1. **Tipagem**: Detecção de erros em tempo de desenvolvimento
2. **IntelliSense**: Melhor experiência de desenvolvimento
3. **Refatoração**: Mudanças mais seguras
4. **Documentação**: Tipos servem como documentação

### De CSS para Tailwind:
1. **Consistência**: Sistema de design unificado
2. **Performance**: CSS otimizado e purificado
3. **Responsividade**: Classes utilitárias responsivas
4. **Manutenibilidade**: Estilos co-localizados

### De Componentes Customizados para shadcn/ui:
1. **Acessibilidade**: Componentes seguem padrões ARIA
2. **Consistência**: Design system profissional
3. **Customização**: Fácil personalização via CSS variables
4. **Manutenção**: Componentes bem testados e documentados

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
npx vercel --prod
```

### Outros Provedores
```bash
npm run build
npm start
```

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting do código

## 🔧 Próximos Passos

1. **Configurar Firebase Real**: Substituir configurações demo por projeto real
2. **Implementar CRUD Completo**: Adicionar operações de criação, edição e exclusão
3. **Adicionar Gráficos**: Implementar visualizações de dados com Recharts
4. **Integrar Mapas**: Adicionar Google Maps para o módulo Mapa de Força
5. **Testes**: Implementar testes unitários e de integração
6. **PWA**: Transformar em Progressive Web App

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS**

