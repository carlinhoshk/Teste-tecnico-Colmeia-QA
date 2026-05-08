class LoginPage {

  get emailInput() { return cy.get('[type="email"] input') }
  get passwordInput() { return cy.get('[type="password"] input') }
  get btnEntrar() { return cy.get('[type="submit"]') }
  get btnContinuar() { return cy.get('button').contains('Continuar') }

  // Mensagens de feedback
  get mensagemLoginIncorreto() { return cy.contains('Seu login está incorreto, quer continuar?') }
  get mensagemCredenciaisInvalidas() { return cy.contains('Usuário ou senha inválidos') }


  /**
   * Navega para a página de login e aguarda o campo de e-mail estar pronto.
   */
  acessarPagina() {
    cy.visit('/')
    this.emailInput.should('be.visible')
  }

  preencherEmail(email) {
    this.emailInput.clear().type(email)
  }

  preencherSenha(password) {
    // log: false oculta a senha nos logs e relatórios do Cypress
    this.passwordInput.clear().type(password, { log: false })
  }

  clicarEntrar() {
    this.btnEntrar.click()
  }

  clicarContinuar() {
    this.btnContinuar.click()
  }

  // ─── Asserções 

  /**
   * Valida a mensagem de alerta exibida mesmo com credenciais válidas (BUG-001).
   * Valida também que o botão "Continuar" — que submete o formulário — está disponível.
   */
  validarMensagemLoginIncorreto() {
    this.mensagemLoginIncorreto
      .should('be.visible')
      .and('contain.text', 'Seu login está incorreto, quer continuar?')
    this.btnContinuar.should('be.visible').and('not.be.disabled')
  }
  validarCamposObrigatorios() {
    cy.get('field[name="email"]')
      .should('have.attr', 'data-invalid', 'true')
    cy.get('field[name="password"]')
      .should('have.attr', 'data-invalid', 'true')
  }
  validarMensagemCredenciaisInvalidas() {
    this.mensagemCredenciaisInvalidas
      .should('be.visible')
      .and('contain.text', 'Usuário ou senha inválidos')
    // Valida que não houve redirecionamento indevido
    cy.url().should('not.include', '/dashboard')
  }

  /**
   * Após clicar em "Continuar", o formulário é submetido e o usuário
   * deve ser redirecionado para a área interna. Como é um form submit
   * tradicional (sem chamada de API separada), a validação é feita
   * pela mudança de URL.
   */
  validarRedirecionamentoParaDashboard() {
    cy.url().should('not.include', '/login')
  }

  validarPaginaDeLoginVisivel() {
    this.emailInput.should('be.visible')
    this.passwordInput.should('be.visible')
    this.btnEntrar.should('be.visible')
    cy.url().should('not.include', '/dashboard')
  }

}

export default new LoginPage()
