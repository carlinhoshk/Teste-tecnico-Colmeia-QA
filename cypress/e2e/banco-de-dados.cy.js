import loginPage from '../pages/LoginPage.js'
import credentials from '../fixtures/credentials.json'

describe('Bancos de Dados', () => {

  beforeEach(() => {
    loginPage.acessarPagina()
    loginPage.preencherEmail(credentials.valid.email)
    loginPage.preencherSenha(credentials.valid.password)
    loginPage.clicarEntrar()
    loginPage.validarMensagemLoginIncorreto()
    loginPage.clicarContinuar()
    loginPage.validarRedirecionamentoParaDashboard()

    // Navega direto para Bancos de Dados
    cy.visit('/dashboard/campanha/bancos-de-dados')
    cy.contains('Bancos de dados').should('be.visible')
  })

  // ─── Helpers ────────────────────────────────────────────────────────────

  const criarItem = (nome) => {
    cy.contains('Criar').click()
    cy.get('input').filter(':visible').last().clear().type(nome)
    cy.contains('Salvar').click()
  }

  // ─── Criação ────────────────────────────────────────────────────────────

  it('CT01 - Criar item com nome válido deve exibir na listagem', () => {
    const nome = `Banco Teste ${Date.now()}`
    criarItem(nome)

    cy.contains(nome).should('be.visible')
  })

  it('CT02 - Criar item sem nome não deve adicionar item à listagem', () => {
    cy.contains('Criar').click()
    cy.contains('Salvar').click()

    cy.contains('Nenhum banco de dados encontrado').should('exist')
  })

  // ─── Pesquisa ───────────────────────────────────────────────────────────

  it('CT03 - Pesquisar por item existente deve exibir resultado', () => {
    const nome = `Busca ${Date.now()}`
    criarItem(nome)

    cy.get('input[placeholder="Pesquisar"]').type(nome)
    cy.contains(nome).should('be.visible')
  })

  it('CT04 - Pesquisar por item inexistente deve exibir mensagem de lista vazia', () => {
    cy.get('input[placeholder="Pesquisar"]').type('xxxxxxxxinexistente')

    cy.wait(500)

    cy.contains('Nenhum resultado encontrado para').should('exist')
  })

  // ─── Arquivar ───────────────────────────────────────────────────────────

  /**
   * BUG-004: Botão "Arquivar" individual (por item na listagem) remove o item
   * de ambas as listas sem movê-lo para arquivados.
   * O botão de arquivar global (ícone de caixinha no topo) funciona corretamente.
   */
  it('CT05 - Arquivar item individualmente deve movê-lo para a lista de arquivados', () => {
    const nome = `Arquivar ${Date.now()}`
    criarItem(nome)

    // Clica no botão Arquivar individual do item
    cy.contains('tr', nome)
      .find('button[title="Arquivar"]')
      .click()

    // Abre lista de arquivados pelo botão global (caixinha)
    cy.get('button[btn][data-variant="icon"]').first().click()

    // BUG-004 EVIDENCIADO: item some após arquivar individualmente
    // não aparece nem na lista principal nem na lista de arquivados
    cy.contains(nome).should('be.visible')
  })

  // ─── Excluir ────────────────────────────────────────────────────────────

  it('CT06 - Excluir item deve removê-lo da listagem', () => {
    const nome = `Apagar ${Date.now()}`
    criarItem(nome)

    cy.contains('tr', nome)
      .find('button[title="Apagar"]')
      .click()

    cy.contains(nome).should('not.exist')
  })

  // ─── Refresh ────────────────────────────────────────────────────────────

  /**
   * BUG-003: Botão de refresh limpa a listagem ao invés de recarregar os dados.
   */
  it('CT07 - Botão de refresh deve recarregar a listagem sem perder dados', () => {
    const nome = `Refresh ${Date.now()}`
    criarItem(nome)

    // Identifica o botão de reload pelo path único do SVG
    cy.get('button[btn][data-variant="icon"]')
      .filter(':has(path[d^="M17.65"])')
      .click()

    // BUG-003 EVIDENCIADO: item some após clicar em refresh
    cy.contains(nome).should('be.visible')
  })

})
