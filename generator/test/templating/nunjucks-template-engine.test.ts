import {expect} from 'chai'
import {NunjucksTemplateEngine} from '../../src'

describe('nunjucks template engine', () => {
  describe('render', () => {
    it('should render the NJS template with the given context', async () => {
      // Arrange
      const engine = new NunjucksTemplateEngine('views')
      const template = '<h1>{{ title }}</h1>'
      const context = {title: 'Hello, world!'}
      const expectedOutput = '<h1>Hello, world!</h1>'

      // Act
      const output = await engine.render(template, context)

      // Assert
      expect(output).to.equal(expectedOutput)
    })

    it('should render the NJS template with helper functions', async () => {
      // Arrange
      const engine = new NunjucksTemplateEngine('views')
      const template = '<p>{{ \'hello world\' | pascalCase }}</p>'
      const context = {}
      const expectedOutput = '<p>HelloWorld</p>'

      // Act
      const output = await engine.render(template, context)

      // Assert
      expect(output).to.equal(expectedOutput)
    })
  })

  describe('supports', () => {
    it('should support .njs file extension', () => {
      // Arrange
      const engine = new NunjucksTemplateEngine('views')
      const path = 'index.njs'

      // Act
      const isSupported = engine.supports(path)

      // Assert
      expect(isSupported).to.be.true
    })
  })

  describe('transform filename', () => {
    it('should transform .ejs file extension to empty string', () => {
      // Arrange
      const engine = new NunjucksTemplateEngine('views')
      const path = 'index.njs'
      const expectedPath = 'index'

      // Act
      const transformedPath = engine.transformFilename(path)

      // Assert
      expect(transformedPath).to.equal(expectedPath)
    })
  })
})
