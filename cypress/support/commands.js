/**
 * @command login
 * @description Custom Command para encapsular o fluxo completo de login.
 * Utiliza `cy.session` para cachear a sessão entre testes,
 * evitando logins repetitivos e acelerando a suíte.
 *
 * @param {string} email
 * @param {string} password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/')
      cy.get('[type="email"]').type(email)
      cy.get('[type="password"]').type(password, { log: false })
      cy.get('[type="submit"]').click()
      // O login é um form submit tradicional — valida saída da página de login
      cy.url().should('not.include', '/login')
    },
    {
      cacheAcrossSpecs: true,
    }
  )
})

/**
 * @command loginViaUI
 * @description Variante simples de login sem cache de sessão.
 * Útil para testes que precisam de um estado limpo a cada execução.
 *
 * @param {string} email
 * @param {string} password
 */
Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.get('[type="email"]').type(email)
  cy.get('[type="password"]').type(password, { log: false })
  cy.get('[type="submit"]').click()
})
