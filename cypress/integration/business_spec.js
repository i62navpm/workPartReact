import { env, user } from '../../src/config/config'

describe('Business test', function () {
  before(function () {
    const url = '/auth/login'

    cy.visit(env + url)
    cy.contains('Login')
    cy.url().should('include', url)

    cy.get('#username').type(user.username)
    cy.get('#password').type(user.password)

    cy.get('form').submit()
  })

  after(function () {
    cy.get('#menu-appbar').click()
    cy.get('li').contains('Logout').click()
    cy.url().should('include', '/auth/login')
  })

  it('Business card query DOM elements', function() {
    cy.url().should('include', '/business')
  })

  it('New business form', function () {
    cy.get('button.add-button').click()
    cy.url().should('include', '/business/company')

    cy.contains('Employee')
    cy.get('#name').type('Demo username')
    cy.get('#cif').type('11111111B')

    cy.get('form').submit()

    cy.url().should('include', '/business')
  })
  
  it('Edit business form', function () {
    cy.get('.edit-business').first().click()
    cy.url().should('include', '/business/company')

    cy.contains('Employee')

    cy.get('form').submit()

    cy.url().should('include', '/business')
  })
})