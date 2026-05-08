/**
 * @command login
 * @description Custom Command que encapsula o fluxo completo de login
 * utilizando cy.session para cachear a sessão entre specs.
 * Ideal para testes que precisam estar autenticados mas não testam
 * o login em si — evita logins repetitivos e acelera a suíte.
 *
 * ATENÇÃO: devido ao BUG-001, o fluxo de login exige clicar em
 * "Continuar" após o popup de erro mesmo com credenciais válidas.
 */
Cypress.Commands.add('login', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/')
      cy.get('field[name="email"] input').type(email)
      cy.get('field[name="password"] input').type(password, { log: false })
      cy.get('[type="submit"]').click()

      // BUG-001: popup aparece mesmo com credenciais válidas
      cy.contains('Continuar').click()
      cy.url().should('not.include', '/login')
    },
    {
      cacheAcrossSpecs: true,
    }
  )
})

/**
 * @command loginViaUI
 * @description Variante sem cache de sessão.
 * Usar nos testes que validam o próprio fluxo de login,
 * garantindo estado limpo a cada execução.
 */
Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.get('field[name="email"] input').type(email)
  cy.get('field[name="password"] input').type(password, { log: false })
  cy.get('[type="submit"]').click()
})
