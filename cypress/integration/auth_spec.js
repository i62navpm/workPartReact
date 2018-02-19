import { env, user, mockUser } from '../../src/config/config'

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

    cy.get('#email').type(mockUser.username)
    cy.get('#password').type(mockUser.password)

    cy.server()
    cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/').as('userRegister')
    cy.get('form').submit()

    cy.wait('@userRegister').then((xhr) => {
      if (xhr.status === 400) {
        expect(xhr.status).to.equal(400)
        cy.url().should('include', url)
      } else if (xhr.status === 200) {
        expect(xhr.status).to.equal(200)

        cy.contains('Verification')

        cy.get('#verificationCode').type('123456')

        cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/').as('userVerificateEmail')
        cy.get('form').submit()
        cy.wait('@userVerificateEmail').then((xhr) => {
          expect(xhr.status).to.equal(400)
          cy.url().should('include', 'auth/verification')
        })
      }
    })
  })

  it('Submit the forgot password component', function () {
    const url = '/auth/forgotPassword'

    cy.visit(env + url)
    cy.contains('Forgot the password')
    cy.url().should('include', url)

    cy.get('#email').type(user.username)

    cy.server()

    cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/').as('userSendEmail')
    cy.get('button[type="button"]').click()
    
    cy.wait('@userSendEmail').then((xhr) => {
      expect(xhr.status).to.equal(400)
      
      if (xhr.status === 200) {
        cy.contains('Verification')

        cy.get('#password').type(user.password)
        cy.get('#verificationCode').type('123456')

        cy.route('POST', 'https://cognito-idp.eu-central-1.amazonaws.com/').as('userForgotPassword')
        cy.get('form').submit()
        cy.wait('@userForgotPassword').then((xhr) => {
          expect(xhr.status).to.equal(400)
        })
      }
    })

    cy.url().should('include', url)
  })

})