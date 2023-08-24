import {expect} from 'chai'
import {NunjucksTemplateEngine} from '../../src'
import {TemplateInfo} from "../../src/models/template-info";
import {ParseError} from "../../src/error/parse-error";

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
    it('should support .njk file extension', () => {
      // Arrange
      const engine = new NunjucksTemplateEngine('views')
      const path = 'index.njk'

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
      const path = 'index.njk'
      const expectedPath = 'index'

      // Act
      const transformedPath = engine.transformFilename(path)

      // Assert
      expect(transformedPath).to.equal(expectedPath)
    })
  })

  describe('transform parse errors', () => {
    it('should transform parse errors into a ParseErrors object', () => {
      // Arrange
      const engine = new NunjucksTemplateEngine('views')

      const info: TemplateInfo = {
        path: 'index.njk',
        lineOffset: 5,
      }

      const error = new Error(`Template render error: (unknown path) [Line 50, Column 4]
  unknown block tag: abc`)

      const result = engine.transformError(error, info)

      // Assert
      expect(result).to.be.instanceOf(ParseError)
      expect((result as ParseError).line).to.equal(55)
      expect((result as ParseError).column).to.equal(4)
      expect((result as ParseError).message).to.equal('Parse error in index.njk at line 55, column 4: unknown block tag: abc')
    })

    it('should ignore non-parser errors', () => {
      // Arrange
      const engine = new NunjucksTemplateEngine('views')

      const info: TemplateInfo = {
        path: 'index.njk',
        lineOffset: 5,
      }

      const error = new Error(`Something else went wrong`)

      const result = engine.transformError(error, info)

      // Assert
      expect(result).not.to.be.instanceOf(ParseError)
    })
  })
})
