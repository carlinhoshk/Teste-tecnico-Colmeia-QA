import loginPage from '../pages/LoginPage.js'
import credentials from '../fixtures/credentials.json'

describe('Login', () => {

  beforeEach(() => {
    loginPage.acessarPagina()
  })

  //  Fluxo feliz

  /**
   * BUG-001: Login com credenciais válidas exibe popup de erro
   * antes de redirecionar. O fluxo esperado seria acesso direto
   * ao dashboard sem nenhuma mensagem de bloqueio.
   */
  it('CT01 - Login com credenciais válidas deve acessar o dashboard sem mensagens de erro', () => {
    loginPage.preencherEmail(credentials.valid.email)
    loginPage.preencherSenha(credentials.valid.password)
    loginPage.clicarEntrar()

    // BUG-001: popup "Seu login está incorreto" aparece mesmo com credenciais corretas
    loginPage.validarMensagemLoginIncorreto()

    // Workaround atual: usuário precisa clicar em "Continuar" para prosseguir
    loginPage.clicarContinuar()
    loginPage.validarRedirecionamentoParaDashboard()
  })

  // Fluxo negativo

  it('CT02 - Login com credenciais inválidas deve exibir mensagem de erro e permanecer na tela de login', () => {
    loginPage.preencherEmail(credentials.invalid.email)
    loginPage.preencherSenha(credentials.invalid.password)
    loginPage.clicarEntrar()

    loginPage.validarMensagemCredenciaisInvalidas()
    loginPage.validarPaginaDeLoginVisivel()
  })

  // ─── Validações de campo ────────────────────────────────────────────────

  it('CT03 - Submeter formulário com campos vazios deve exibir validação obrigatória', () => {
    loginPage.clicarEntrar()
    loginPage.validarCamposObrigatorios()
    loginPage.validarPaginaDeLoginVisivel()
  })

  it('CT04 - Submeter formulário apenas com email deve exibir validação no campo de senha', () => {
    loginPage.preencherEmail(credentials.valid.email)
    loginPage.clicarEntrar()

    cy.get('field[name="password"]').should('have.attr', 'data-invalid', 'true')
    loginPage.validarPaginaDeLoginVisivel()
  })

  // ─── Elemento sem ação ──────────────────────────────────────────────────

  /**
   * Elemento "Esqueceu sua senha?" existe na tela mas não possui
   * href nem handler associado — funcionalidade não implementada.
   */
  it('CT05 - Esqueceu sua senha? não deve executar nenhuma ação ao ser clicado', () => {
    cy.contains('Esqueceu sua senha?').click()

    // Esperado: redirecionamento ou modal de recuperação de senha
    // Obtido: nenhuma ação — usuário permanece na tela de login
    loginPage.validarPaginaDeLoginVisivel()
  })

})
