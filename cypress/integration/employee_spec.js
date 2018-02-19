import { env, user } from '../../src/config/config'

describe('Employee test', function () {
  before(function () {
    const url = '/auth/login'

    cy.visit(env + url)
    cy.contains('Login')
    cy.url().should('include', url)

    cy.get('#username').type(user.username)
    cy.get('#password').type(user.password)

    cy.get('form').submit()

    cy.get('button[aria-label="Menu"]').click()
    cy.get('nav li').contains('Workforce').click()
  })

  after(function () {
    cy.get('#menu-appbar').click()
    cy.get('li').contains('Logout').click()
    cy.url().should('include', '/auth/login')
  })

  it('Employee card query DOM elements', function() {
    cy.url().should('include', '/workforce')
  })

  it('New workforce form', function () {
    cy.get('button.add-button').click()
    cy.url().should('include', '/workforce/employee')

    cy.contains('Employee')
    cy.get('#name').type('Demo username')
    cy.get('#nif').type('B11111111')

    cy.get('form').submit()

    cy.url().should('include', '/workforce')
  })
  
  it('Edit workforce form', function () {
    cy.get('.edit-workforce').first().click()
    cy.url().should('include', '/workforce/employee')

    cy.contains('Employee')

    cy.get('form').submit()

    cy.url().should('include', '/workforce')
  })
})