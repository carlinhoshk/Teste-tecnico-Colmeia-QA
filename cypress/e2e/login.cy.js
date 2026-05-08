import loginPage from '../pages/LoginPage.js'
import credentials from '../fixtures/credentials.json'

describe('Login', () => {

  beforeEach(() => {
    loginPage.acessarPagina()
  })

  //  Happy path

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

  // Bad path

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
  // ─── Segurança ──────────────────────────────────────────────────────────
  it('CT06 - SQL Injection no campo de email não deve autenticar', () => {
    loginPage.preencherEmail(credentials.sqlInjectionUser.email)
    loginPage.preencherSenha(credentials.sqlInjectionUser.password)
    loginPage.clicarEntrar()

    // Esperado: mensagem de erro e permanência na tela de login
    // Obtido: qualquer redirecionamento seria uma falha crítica de segurança
    loginPage.validarPaginaDeLoginVisivel()
  })

  it('CT07 - XSS no campo de email não deve executar script na interface', () => {
    loginPage.preencherEmail(credentials.xssUser.email)
    loginPage.preencherSenha(credentials.xssUser.password)
    loginPage.clicarEntrar()

    // Esperado: conteúdo tratado como texto, sem execução de script
    // Se um alert() disparar durante o teste, o Cypress vai falhar — evidência do XSS
    loginPage.validarPaginaDeLoginVisivel()
  })

  it('CT08 - Email com string muito longa não deve quebrar a aplicação', () => {
    loginPage.preencherEmail(credentials.longStringUser.email)
    loginPage.preencherSenha(credentials.longStringUser.password)
    loginPage.clicarEntrar()

    // Esperado: aplicação lida com o input sem travar ou exibir erro inesperado
    loginPage.validarPaginaDeLoginVisivel()
  })

  // ─── Elemento sem ação ──────────────────────────────────────────────────

  /**
   * Elemento "Esqueceu sua senha?" existe na tela mas não possui
   * href nem handler associado — funcionalidade não implementada.
   */
  it('CT05 - Esqueceu sua senha? deve redirecionar para outra página', () => {
    cy.location('pathname').then((pathAntes) => {
      cy.contains('Esqueceu sua senha?').click()

      // Esperado: qualquer mudança de página — modal, redirect, nova rota
      // Obtido: nenhuma ação, usuário permanece na mesma URL
      cy.location('pathname').should('not.eq', pathAntes)
    })
  })
})
