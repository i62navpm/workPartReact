import { env, user } from '../../src/config/config'

describe('Auth test', function () {
  beforeEach(function () {
    cy.visit(`${env}/auth`)
  })

  it('Submit the login component', function () {
    const url = '/auth/login'

    cy.visit(env + url)
    cy.contains('Login')
    cy.url().should('include', url)

    cy.get('#username').type(user.username)
    cy.get('#password').type(user.password)

    cy.get('form').submit()

    cy.url().should('include', '/business')
  })

  it('Submit the register component', function () {
    const url = '/auth/register'

    cy.visit(env + url)
    cy.contains('Register')
    cy.url().should('include', url)

    cy.get('#email').type(user.username)
    cy.get('#password').type(user.password)

    cy.server()

    cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/', {}).as('userRegister')
    cy.get('form').submit()
    cy.wait('@userRegister').then((xhr) => {
      expect(xhr.status).to.equal(200)
    })

    cy.url().should('include', '/auth/verification')
    cy.contains('Verification')

    cy.get('#verificationCode').type('123456')

    cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/', {}).as('userVerificateCode')
    cy.get('form').submit()
    cy.wait('@userVerificateCode').then((xhr) => {
      expect(xhr.status).to.equal(200)
    })

    cy.url().should('include', '/auth/login')
  })

  it('Submit the forgot password component', function () {
    const url = '/auth/forgotPassword'

    cy.visit(env + url)
    cy.contains('Forgot the password')
    cy.url().should('include', url)

    cy.get('#email').type(user.username)

    cy.server()

    cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/', {}).as('userSendEmail')
    cy.get('button[type="button"]').click()
    cy.wait('@userSendEmail').then((xhr) => {
      expect(xhr.status).to.equal(200)
    })

    cy.contains('Verification')

    cy.get('#verificationCode').type('123456')
    cy.get('#password').type(user.password)

    cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/', {}).as('userForgotPassword')
    cy.get('form').submit()
    cy.wait('@userForgotPassword').then((xhr) => {
      expect(xhr.status).to.equal(200)
    })

    cy.url().should('include', '/auth/login')
  })

})