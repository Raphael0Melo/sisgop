# Copilot Instructions for SISGOP_BPA (BPA 2.0)

## Visão Geral
Este projeto é um sistema de gestão operacional migrado de React para Next.js 15, usando TypeScript, Tailwind CSS e shadcn/ui. O backend utiliza Firebase para autenticação e banco de dados. O foco é modularidade, responsividade e acessibilidade.

## Estrutura Principal
- `src/app/`: Módulos de página (roteamento Next.js)
- `src/components/`: Componentes reutilizáveis, organizados por domínio
- `src/components/ui/`: Componentes shadcn/ui customizados
- `src/context/AuthContext.tsx`: Autenticação e persistência de sessão
- `src/lib/firebase.ts`: Configuração do Firebase
- `src/service/api.ts`: Integração com APIs externas
- `src/types/index.ts`: Tipos TypeScript globais

## Convenções e Padrões
- **Tipagem Estrita**: Sempre use tipos explícitos para props e dados.
- **Componentização**: Prefira componentes funcionais e reutilizáveis, agrupados por domínio.
- **Estilização**: Use Tailwind CSS para estilos. Evite CSS customizado fora do padrão.
- **shadcn/ui**: Utilize componentes de `src/components/ui/` para UI consistente e acessível.
- **Contextos**: Use React Context para autenticação e estados globais.
- **Proteção de Rotas**: Implemente lógica de acesso em `ProtectedRoute.tsx`.
- **Firebase**: Use helpers de `lib/firebase.ts` para autenticação e acesso ao Firestore.

## Fluxos de Trabalho
- **Desenvolvimento**: `npm run dev` para iniciar localmente.
- **Build**: `npm run build` para produção.
- **Lint**: `npm run lint` para validação de código.
- **Deploy**: Recomenda-se Vercel (`npx vercel --prod`).
- **Variáveis de Ambiente**: Configure `.env.local` com credenciais do Firebase.

## Integrações e Comunicação
- **Firebase**: Autenticação e banco de dados. Configure via `lib/firebase.ts`.
- **API Externa**: Use `service/api.ts` para chamadas HTTP customizadas.
- **PDF**: Geração de PDF via `pdfMake` em `PdfbookDay.ts`.

## Exemplos de Padrões
- Componentes de formulário seguem o padrão de `BookDayForm.tsx`, `ControlCarForm.tsx`, etc.
- Proteção de rotas: `ProtectedRoute.tsx` verifica autenticação antes de renderizar children.
- Uso de contexto: `AuthContext.tsx` fornece métodos e estados de autenticação.
- Estilização: `<button className="bg-primary text-white ...">` (Tailwind)

## Recomendações para Agentes
- Sempre siga a estrutura de pastas e padrões de tipagem.
- Prefira reutilizar componentes existentes antes de criar novos.
- Consulte `README.md` para detalhes de configuração e scripts.
- Documente novos padrões diretamente neste arquivo.

---

Se algum padrão ou fluxo não estiver claro, peça feedback ao usuário para detalhamento ou atualização deste documento.
