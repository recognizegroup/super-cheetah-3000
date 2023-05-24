import {expect} from 'chai'
import {GeneratorBuilder} from '../src/generator-builder'

describe('generator builder', () => {
  let generatorBuilder: GeneratorBuilder
  const packageLocation = 'my-package'

  beforeEach(() => {
    generatorBuilder = new GeneratorBuilder(packageLocation, '^1.0')
  })

  it('should set the package name and version', () => {
    expect(generatorBuilder.packageLocation).to.equal(packageLocation)
    expect(generatorBuilder.version).to.equal('^1.0')
  })

  it('should add an input', () => {
    const inputName = 'apiKey'
    const inputValue = 'abc123'
    const result = generatorBuilder.withInput(inputName, inputValue)

    expect(result).to.equal(generatorBuilder)
    expect(generatorBuilder.inputs[inputName]).to.equal(inputValue)
  })
})
