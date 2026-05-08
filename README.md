# Teste Técnico QA — Colmeia ![alt text](.//assets/Cypress-Icon--Streamline-Svg-Logos.svg) ![alt text](./assets/Nodejs-Icon-Alt--Streamline-Svg-Logos.svg) ![alt text](./assets/Github-Actions--Streamline-Svg-Logos.svg)

Teste técnico QA automatizado com Cypress 15 para a plataforma Colmeia. Foram implementados 17 testes E2E cobrindo autenticação (login), CRUD de bancos de dados e navegação no dashboard, utilizando Page Objects, custom commands e fixtures parametrizadas. A suite identificou 4 bugs (popup de login inválido com credenciais corretas, dropdown sem ação, refresh que limpa dados, arquivamento que remove permanentemente) e 3 funcionalidades não implementadas. A execução dos testes é feita via GitHub Actions, com criação automática de [issues](https://github.com/carlinhoshk/Teste-tecnico-Colmeia-QA/issues/14) no repositório quando há falhas e que vai para o board [kanban](https://github.com/users/carlinhoshk/projects/5)
.

---

## Instalação e execução

**Pré-requisitos:** Node.js 16+

```bash
# Instalar dependências
npm install

# Abrir interface gráfica do Cypress
npx cypress open

# Rodar todos os testes via terminal
npm run cypress:run
```

---

## Estrutura do projeto

```
cypress/
  e2e/
    login.cy.js              # Testes de autenticação
    banco-de-dados.cy.js     # Testes de CRUD — Bancos de Dados
    dashboard.cy.js          # Testes de navegação e elementos do dashboard
  fixtures/
    credentials.json         # Dados de teste (usuários válidos, inválidos, edge cases)
  support/
    commands.js              # Custom commands: cy.login(), cy.loginViaUI()
    e2e.js                   # Configuração global do Cypress
    pages/
      LoginPage.js           # Page Object da tela de login
.github/
  workflows/
    cypress.yml              # Pipeline de CI com criação automática de issues
cypress.config.js
```

---

## Casos de Teste

### Login

| ID | Descrição | Tipo | Prioridade | Relacionado |
|----|-----------|------|------------|-------------|
| CT01 | Login com credenciais válidas deve acessar o dashboard sem mensagens de erro | Funcional | Alta | BUG-001 |
| CT02 | Login com credenciais inválidas deve exibir mensagem de erro e permanecer na tela de login | Funcional | Alta | |
| CT03 | Submeter formulário com campos vazios deve exibir validação obrigatória | Validação | Média | |
| CT04 | Submeter formulário apenas com email deve exibir validação no campo de senha | Validação | Média | |
| CT05 | Esqueceu sua senha? deve redirecionar para outra página | Funcional | Média | FIND-001 |
| CT06 | SQL Injection no campo de email não deve autenticar | Segurança | Alta | |
| CT07 | XSS no campo de email não deve executar script na interface | Segurança | Alta | |
| CT08 | Email com string muito longa não deve quebrar a aplicação | Borda | Média | |

### Bancos de Dados

| ID | Descrição | Tipo | Prioridade | Relacionado |
|----|-----------|------|------------|-------------|
| CT01 | Criar item com nome válido deve exibir na listagem | Funcional | Alta | |
| CT02 | Criar item sem nome não deve adicionar item à listagem | Validação | Média | |
| CT03 | Pesquisar por item existente deve exibir resultado | Funcional | Alta | |
| CT04 | Pesquisar por item inexistente deve exibir mensagem de lista vazia | Funcional | Média | |
| CT05 | Arquivar item individualmente deve movê-lo para a lista de arquivados | Funcional | Alta | BUG-004 |
| CT06 | Excluir item deve removê-lo da listagem | Funcional | Alta | |
| CT07 | Botão de refresh deve recarregar a listagem sem perder dados | Funcional | Alta | BUG-003 |

### Dashboard

| ID | Descrição | Tipo | Prioridade | Relacionado |
|----|-----------|------|------------|-------------|
| CT01 | Colmeia Forms deve exibir conteúdo ou instrução ao usuário | Funcional | Média | FIND-002 |
| CT02 | Dropdown Candidato deve exibir opções ao ser clicado | Funcional | Média | BUG-002 |

---

## Bugs identificados

| ID | Severidade | Tela | Descrição | Teste |
|---|---|---|---|---|
| BUG-001 | Alta | Login | Login com credenciais válidas exibe popup de erro antes de redirecionar | login.cy.js CT01 |
| BUG-002 | Média | Dashboard | Dropdown "Candidato" não responde ao clique | dashboard.cy.js CT02 |
| BUG-003 | Alta | Bancos de Dados | Botão de refresh limpa a listagem ao invés de recarregar os dados | banco-de-dados.cy.js CT07 |
| BUG-004 | Alta | Bancos de Dados | Arquivar item individualmente remove o item permanentemente de ambas as listas | banco-de-dados.cy.js CT05 |

### Detalhamento

**BUG-001 — Login com credenciais válidas exibe popup de erro**

1. Acesse a aplicação
2. Preencha email `qa@test.com` e senha `123456`
3. Clique em Entrar

**Esperado:** Redirecionamento direto ao dashboard.
**Obtido:** Popup "Seu login está incorreto, quer continuar?" é exibido. O acesso só ocorre após clicar em "Continuar".

---

**BUG-002 — Dropdown "Candidato" não responde ao clique**

1. Faça login na aplicação
2. Clique no elemento "Candidato" no canto superior direito

**Esperado:** Menu dropdown com opções de perfil ou logout.
**Obtido:** Nenhuma ação ocorre.

---

**BUG-003 — Botão de refresh limpa a listagem**

1. Acesse Campanhas > Bancos de Dados
2. Crie um ou mais itens
3. Clique no botão de refresh

**Esperado:** Listagem recarregada com os dados do servidor.
**Obtido:** Todos os itens desaparecem. A página exibe "Nenhum banco de dados encontrado".

---

**BUG-004 — Arquivar item individualmente remove o item permanentemente**

1. Acesse Campanhas > Bancos de Dados
2. Crie um item
3. Clique no botão "Arquivar" individual do item na linha da tabela
4. Clique no botão de arquivados (ícone de caixinha no topo)

**Esperado:** Item movido para a lista de arquivados.
**Obtido:** Item desaparece de ambas as listas sem possibilidade de recuperação.

> O botão de arquivar global (ícone de caixinha no topo) funciona corretamente. O problema é específico do botão individual por item.

---

## Findings — Funcionalidades não implementadas

| ID | Tela | Descrição |
|---|---|---|
| FIND-001 | Login | Elemento "Esqueceu sua senha?" sem ação associada |
| FIND-002 | Dashboard | Colmeia Forms acessível pelo menu mas sem conteúdo |
| FIND-003 | Global | Preload de fonte Poppins sem atributo `as="font"` |

**FIND-001** — O elemento existe no DOM com estilo visual de link clicável mas não possui `href` nem handler. Nenhuma ação ocorre ao clicar.

**FIND-002** — A rota `/dashboard/campanha/colmeia-forms` é acessível pelo menu lateral mas a página não exibe nenhum conteúdo, formulário ou instrução ao usuário.

**FIND-003** — O elemento `<link rel="preload">` da fonte Poppins não possui o atributo `as="font"`, gerando warning no console do browser e potencial impacto na performance de carregamento.

---

## CI — Integração Contínua

O projeto utiliza **GitHub Actions** para rodar os testes automaticamente a cada push ou pull request nas branches `main`.

Quando um ou mais testes falham, o pipeline:

1. Extrai os detalhes da falha do relatório JSON gerado pelo Cypress
2. Cria automaticamente uma issue no repositório com a lista dos testes que falharam e as mensagens de erro
3. Marca o job como falho para sinalizar o problema no PR ou commit

As issues recebem as labels `bug` e `qa` e podem ser integradas ao **GitHub Projects** para aparecerem automaticamente no board Kanban.

Testes que evidenciam bugs conhecidos foram mantidos ativos intencionalmente para que o CI sinalize as falhas e gere as issues correspondentes. Em um ambiente de produção, seriam marcados com `it.skip` vinculados a tickets de correção até que os bugs fossem resolvidos.
