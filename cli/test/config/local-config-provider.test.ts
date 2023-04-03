import {SinonStub, stub} from 'sinon'
import {expect} from 'chai'
import {promises as fs} from 'node:fs'
import {LocalConfigProvider} from '../../src/config/local-config-provider'
import {Config} from '../../src/config/config'
import {TokenResponse} from '../../src/auth/token-response'

describe('local config provider', () => {
  let provider: LocalConfigProvider
  let accessStub: SinonStub
  let readFileStub: SinonStub
  let mkdirStub: SinonStub
  let writeFileStub: SinonStub

  beforeEach(() => {
    provider = new LocalConfigProvider('/path/to/config')
    accessStub = stub(fs, 'access')
    readFileStub = stub(fs, 'readFile')
    mkdirStub = stub(fs, 'mkdir')
    writeFileStub = stub(fs, 'writeFile')
  })

  afterEach(() => {
    accessStub.restore()
    readFileStub.restore()
    mkdirStub.restore()
    writeFileStub.restore()
  })

  describe('retrieveConfig', () => {
    it('should return an empty object if config file does not exist', async () => {
      accessStub.rejects(new Error('File not found'))
      const config = await provider.retrieveConfig()
      expect(config).to.deep.equal({})
    })

    it('should return the parsed contents of the config file', async () => {
      accessStub.resolves(true)

      const expectedConfig: Config = {authentication: {accessToken: 'test'} as TokenResponse}
      readFileStub.resolves(JSON.stringify(expectedConfig))
      const config = await provider.retrieveConfig()
      expect(config).to.deep.equal(expectedConfig)
    })
  })

  describe('storeConfig', () => {
    it('should create the config directory if it does not exist', async () => {
      accessStub.rejects(new Error('File not found'))
      const config: Config = {authentication: {accessToken: 'test'} as TokenResponse}
      await provider.storeConfig(config)
      expect(mkdirStub.calledOnceWith('/path/to/config')).to.be.true
    })

    it('should write the config file with the specified contents', async () => {
      const config: Config = {authentication: {accessToken: 'test'} as TokenResponse}
      await provider.storeConfig(config)
      expect(writeFileStub.calledOnceWith('/path/to/config/config.json', JSON.stringify(config, null, 2), 'utf8')).to.be.true
    })
  })
})
