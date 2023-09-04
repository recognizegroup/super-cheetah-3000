import {expect} from 'chai'
import {InfrastructureBuilder} from '../src/infrastructure-builder'
import {DatabaseType} from '@recognizebv/sc3000-generator'

describe('infrastructure builder', () => {
  let builder: InfrastructureBuilder

  beforeEach(() => {
    builder = new InfrastructureBuilder()
  })

  it('should add a network if none exists', () => {
    const ipRange = '10.0.0.0/16'

    builder.withNetwork(ipRange)
    expect(builder.network?.ipRange).to.equal(ipRange)
  })

  it('should throw an error when trying to add a network when one is already present', () => {
    const ipRangeOne = '10.0.0.0/16'
    const ipRangeTwo = '192.168.0.0/16'

    builder.withNetwork(ipRangeOne)

    try {
      builder.withNetwork(ipRangeTwo)
      expect.fail('Expected an error to be thrown')
    } catch (error) {
      expect((error as any).message).to.equal('Network already set')
    }
  })

  it('should add a storage', () => {
    const name = 'blob'

    builder.withStorage(name)
    expect(builder.storages).to.deep.equal([{name}])
  })

  it('should add a service', () => {
    const name = 'application'

    builder.withService(name)
    expect(builder.services).to.deep.equal([{name}])
  })

  it('should add a database', () => {
    const name = 'database'
    const type = DatabaseType.mssql

    builder.withDatabase(type, name)
    expect(builder.databases).to.deep.equal([{name, type}])
  })
})
