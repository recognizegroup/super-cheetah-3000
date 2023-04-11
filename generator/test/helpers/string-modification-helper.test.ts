import {expect} from 'chai'
import {StringModificationHelper} from '../../src'

describe('string modification helper', () => {
  describe('to pascal case', () => {
    it('should convert a space-separated string to pascal case', () => {
      expect(StringModificationHelper.toPascalCase('hello world')).to.equal('HelloWorld')
    })

    it('should convert a dash-separated string to pascal case', () => {
      expect(StringModificationHelper.toPascalCase('hello-world')).to.equal('HelloWorld')
    })
  })

  describe('to camel case', () => {
    it('should convert a space-separated string to camel case', () => {
      expect(StringModificationHelper.toCamelCase('hello world')).to.equal('helloWorld')
    })

    it('should convert a dash-separated string to camel case', () => {
      expect(StringModificationHelper.toCamelCase('hello-world')).to.equal('helloWorld')
    })
  })

  describe('to kebab case', () => {
    it('should convert a space-separated string to kebab case', () => {
      expect(StringModificationHelper.toKebabCase('Hello World')).to.equal('hello-world')
    })

    it('should convert a pascal case string to kebab case', () => {
      expect(StringModificationHelper.toKebabCase('HelloWorld')).to.equal('hello-world')
    })
  })

  describe('to snake case', () => {
    it('should convert a space-separated string to snake case', () => {
      expect(StringModificationHelper.toSnakeCase('Hello World')).to.equal('hello_world')
    })

    it('should convert a pascal case string to snake case', () => {
      expect(StringModificationHelper.toSnakeCase('HelloWorld')).to.equal('hello_world')
    })
  })

  describe('to title case', () => {
    it('should convert a space-separated string to title case', () => {
      expect(StringModificationHelper.toTitleCase('hello world')).to.equal('Hello World')
    })

    it('should convert a dash-separated string to title case', () => {
      expect(StringModificationHelper.toTitleCase('hello-world')).to.equal('Hello World')
    })
  })

  describe('to sentence case', () => {
    it('should capitalize the first letter of a string', () => {
      expect(StringModificationHelper.toSentenceCase('hello world')).to.equal('Hello world')
    })

    it('should leave an already-sentence-cased string unchanged', () => {
      expect(StringModificationHelper.toSentenceCase('Hello world.')).to.equal('Hello world.')
    })
  })

  describe('to plural', () => {
    it('should add "s" to a singular noun', () => {
      expect(StringModificationHelper.toPlural('cat')).to.equal('cats')
    })

    it('should convert nouns ending in "y" to plural by changing "y" to "ies"', () => {
      expect(StringModificationHelper.toPlural('baby')).to.equal('babies')
    })
  })

  describe('to url case', () => {
    it('should convert a space-separated string to kebab case and add "s"', () => {
      expect(StringModificationHelper.toUrlCase('Hello World')).to.equal('hello-worlds')
    })

    it('should convert a pascal case string to kebab case and add "s"', () => {
      expect(StringModificationHelper.toUrlCase('HelloWorld')).to.equal('hello-worlds')
    })
  })
})
