describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'jdpassword'
    }
    const user2 = {
      name: 'Jane Schmoe',
      username: 'janeschmoe',
      password: 'jspassword'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('johndoe')
      cy.get('#password').type('jdpassword')
      cy.get('#login-button').click()

      cy.contains('John Doe logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('johndoe')
      cy.get('#password').type('wrong password')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')

      cy.get('html').should('not.contain', 'John Doe logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'johndoe', password: 'jdpassword' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('Test blog')
      cy.get('#author').type('John Doe')
      cy.get('#url').type('www.testblog.com')
      cy.get('.submit').click()
      cy.contains('a new blog Test blog by John Doe')
    })

    describe('and several blogs post exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'First Blog Post', author: 'John Doe', url: 'www.someurl.com', likes: 8 })
        cy.createBlog({ title: 'Another Blog Post', author: 'John Doe', url: 'www.someurl.com' })
        cy.createBlog({ title: 'Third Blog Post', author: 'John Doe', url: 'www.someurl.com', likes: 15 })
        cy.createBlogByAnotherUser({ title: 'Blog Post by Jane Schmoe', author: 'Jane Schmoe', url: 'www.someurl.com', likes: 2 })
      })

      it('User can like a blog', function () {
        cy.contains('First Blog Post').parent().find('.toggle').click()
        cy.contains('First Blog Post').parent().parent().find('.toggleContent').find('.likeButton').click()
        cy.contains('First Blog Post').parent().parent().find('.toggleContent').contains('likes 9')
      })

      it('User who created a blog can delete it', function () {
        cy.contains('First Blog Post').parent().find('.toggle').click()
        cy.contains('First Blog Post').parent().parent().find('.toggleContent').find('.removeButton').click()
        cy.get('html').should('not.contain', 'First Blog Post')
      })

      it('Only the creator can see the delete button of a blog', function () {
        cy.contains('Blog Post by Jane Schmoe').parent().find('.toggle').click()
        cy.contains('Blog Post by Jane Schmoe').parent().parent().find('.toggleContent').should('not.contain', 'remove')
      })

      it('Blogs are ordered according to likes', function () {
        cy.get('.blog').eq(0).should('contain', 'Third Blog Post')
        cy.get('.blog').eq(1).should('contain', 'First Blog Post')
        cy.get('.blog').eq(2).should('contain', 'Blog Post by Jane Schmoe')
        cy.get('.blog').eq(3).should('contain', 'Another Blog Post')
      })
    })
  })
})
