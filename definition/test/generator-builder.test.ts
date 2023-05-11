import {expect} from 'chai'
import {GeneratorBuilder} from '../src/generator-builder'

describe('generator builder', () => {
  let generatorBuilder: GeneratorBuilder
  const packageName = 'my-package'

  beforeEach(() => {
    generatorBuilder = new GeneratorBuilder(packageName)
  })

  it('should set the package name', () => {
    expect(generatorBuilder.packageName).to.equal(packageName)
  })

  it('should add an input', () => {
    const inputName = 'apiKey'
    const inputValue = 'abc123'
    const result = generatorBuilder.withInput(inputName, inputValue)

    expect(result).to.equal(generatorBuilder)
    expect(generatorBuilder.inputs[inputName]).to.equal(inputValue)
  })
})
