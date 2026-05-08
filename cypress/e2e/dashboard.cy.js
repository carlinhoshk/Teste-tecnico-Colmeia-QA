import loginPage from '../pages/LoginPage.js'
import credentials from '../fixtures/credentials.json'

describe('Dashboard', () => {

  beforeEach(() => {
    loginPage.acessarPagina()
    loginPage.preencherEmail(credentials.valid.email)
    loginPage.preencherSenha(credentials.valid.password)
    loginPage.clicarEntrar()
    loginPage.validarMensagemLoginIncorreto()
    loginPage.clicarContinuar()
    loginPage.validarRedirecionamentoParaDashboard()
  })

  // ─── Colmeia Forms 
  /**
  * Funcionalidade não implementada: Colmeia Forms existe no menu
  * mas a página está vazia sem nenhum conteúdo ou ação disponível.
  */
  it('CT01 - Colmeia Forms deve exibir conteúdo ou instrução ao usuário', () => {
    cy.visit('/dashboard/campanha/colmeia-forms')

    // Página carrega mas não exibe nenhum conteúdo funcional
    // Esperado: formulário, lista, ou instrução para o usuário
    // Obtido: área de conteúdo vazia
    cy.get('router-outlet').next().should('not.be.empty')
  })

  // ─── Dropdown Candidato 

  /**
   * Dropdown de perfil do usuário visualmente indica interatividade
   * (ícone de seta) mas não responde ao clique — funcionalidade não implementada.
   */
  it('CT02 - Dropdown Candidato deve exibir opções ao ser clicado', () => {
    cy.visit('/dashboard/campanha')

    cy.contains('Candidato').click()

    // Esperado: menu dropdown com opções de perfil, logout, configurações
    // Obtido: nenhuma ação ocorre
    cy.get('[class*="dropdown"], [class*="menu"], [role="menu"]')
      .should('be.visible')
  })

})
