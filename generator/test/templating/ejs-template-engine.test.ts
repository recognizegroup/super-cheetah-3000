import {expect} from 'chai'
import {EjsTemplateEngine} from '../../src'

describe('ejs template engine', () => {
  describe('render', () => {
    it('should render the EJS template with the given context', async () => {
      // Arrange
      const engine = new EjsTemplateEngine('views')
      const template = '<h1><%= title %></h1>'
      const context = {title: 'Hello, world!'}
      const expectedOutput = '<h1>Hello, world!</h1>'

      // Act
      const output = await engine.render(template, context)

      // Assert
      expect(output).to.equal(expectedOutput)
    })

    it('should render the EJS template with helper functions', async () => {
      // Arrange
      const engine = new EjsTemplateEngine('views')
      const template = '<p><%= toPascalCase("hello world") %></p>'
      const context = {}
      const expectedOutput = '<p>HelloWorld</p>'

      // Act
      const output = await engine.render(template, context)

      // Assert
      expect(output).to.equal(expectedOutput)
    })
  })

  describe('supports', () => {
    it('should support .ejs file extension', () => {
      // Arrange
      const engine = new EjsTemplateEngine('views')
      const path = 'index.ejs'

      // Act
      const isSupported = engine.supports(path)

      // Assert
      expect(isSupported).to.be.true
    })
  })

  describe('transform filename', () => {
    it('should transform .ejs file extension to empty string', () => {
      // Arrange
      const engine = new EjsTemplateEngine('views')
      const path = 'index.ejs'
      const expectedPath = 'index'

      // Act
      const transformedPath = engine.transformFilename(path)

      // Assert
      expect(transformedPath).to.equal(expectedPath)
    })
  })
})
