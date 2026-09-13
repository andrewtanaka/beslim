# BeSlim — v1

Webapp estático (HTML/CSS/JS puro, sem build), pronto para publicar direto no Netlify.

## Como publicar no Netlify

1. Arraste a pasta inteira `beslim/` para o painel do Netlify ("Deploys" → arrastar e soltar), **ou**
2. Suba os arquivos para um repositório Git e conecte o Netlify a ele (build command: vazio; publish directory: `.`).

Não precisa de `npm install` nem build — é HTML/CSS/JS puro.

## Estrutura

```
beslim/
├── index.html        → todas as telas do app
├── css/style.css      → identidade visual (preto/branco/cinza #909a9d)
├── js/i18n.js          → todos os textos (EN/ES) + conteúdo de aulas, loja e cardápio
├── js/app.js            → toda a lógica (cálculo de TMB, navegação, carrinho, progresso)
└── assets/logo.png     → sua logo enviada
```

## O que já está pronto nesta v1

- **Onboarding em 3 passos separados** (dados pessoais → medidas → estilo de vida) com barra de progresso animada, seguido de uma tela de "calculando" com barra de loading animada antes de liberar o app — como pedido.
- **Cálculo de TMB** (fórmula Mifflin-St Jeor) e **gasto total diário**, com meta calórica ajustada por objetivo (emagrecer / manter / ganhar massa) e metas de macros (proteína/carbo/gordura).
- **Tela inicial** com "Dica do dia" (rotaciona automaticamente por dia + botão para outra dica aleatória), resumo calórico do dia, registro rápido de refeições.
- **Menu inferior fixo**: Home / Plan / Lessons / Shop / Progress — nomes em inglês (idioma padrão do app).
- **Troca de idioma** (EN/ES) pelo ícone no topo — atualiza todos os textos e conteúdos na hora.
- **Aba Aulas (Lessons)**: grade de vídeo-aulas com modal de vídeo. Cada aula tem um campo `videoUrl` vazio — é só colar o link do vídeo (mp4, ou trocar por um `<iframe>` do YouTube/Vimeo) em `js/i18n.js`.
- **Aba Loja (Shop)**: cards de infoprodutos com carrinho lateral e botão de finalizar compra. Cada produto tem um campo `checkoutUrl` — troque pelo link real de pagamento (Hotmart, Kiwify, Stripe etc). O botão "Finalizar compra" hoje mostra um aviso — é só conectar ao seu checkout real.
- **Aba Progresso**: histórico de peso com gráfico e comparação início → atual → meta.
- Tudo salvo localmente no navegador da pessoa (localStorage) — não precisa de banco de dados nesta v1.

## Onde editar o conteúdo

- **Textos e traduções (EN/ES):** `js/i18n.js`, objeto `I18N`.
- **Dicas do dia:** `js/i18n.js`, dentro de `I18N.en.tips` e `I18N.es.tips`.
- **Aulas, produtos da loja e alimentos do cardápio:** `js/i18n.js`, objeto `CONTENT`.
- **Cores:** `css/style.css`, no topo, dentro de `:root`.

## Próximos passos sugeridos (v2)

- Conectar checkout real (Hotmart/Stripe) na Loja.
- Hospedar os vídeos das aulas (Youtube/Vimeo/Bunny) e colar os links.
- Trocar o localStorage por uma conta de verdade (ex: Supabase) se quiser sincronizar entre dispositivos.
- Adicionar avatar/foto de perfil e histórico de refeições por data.
