import {expect, test} from '@oclif/test'
import sinon from 'sinon'
import {AzureAdAuthenticationProvider} from '../../../src/auth/azure-ad-authentication-provider'
import {TokenResponse} from '../../../src/auth/token-response'
import {LocalConfigProvider} from '../../../src/config/local-config-provider'
import {GeneratorLoader} from '../../../src/generators/generator-loader'
import * as definition from '../../../src/datamodel/definition'
import {DataType, ProjectCodeProvider} from '@recognizebv/sc3000-generator'

describe('generate', () => {
  const stubTokenResponse: TokenResponse = {
    accessToken: 'sample-access-token',
    idToken: 'sample-id-token',
    expiresOn: new Date(),
    refreshToken: 'sample-refresh-token',
    username: 'j.doe@recognize.nl',
  }

  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    const projectCodeProvider = sinon.createStubInstance(ProjectCodeProvider)
    const entityCodeProvider = sinon.createStubInstance(ProjectCodeProvider)

    sandbox.stub(AzureAdAuthenticationProvider.prototype, 'fetchTokenOrRefresh').callsFake(async () => stubTokenResponse)
    sandbox.stub(LocalConfigProvider.prototype, 'retrieveConfig').callsFake(async () => ({authentication: stubTokenResponse}))
    sandbox.stub(LocalConfigProvider.prototype, 'storeConfig').callsFake(async () => {})
    sandbox.stub(GeneratorLoader.prototype, 'loadProjectGenerators').callsFake(async () => [
      {
        entityCodeProvider,
        projectCodeProvider,
        metaData: {
          name: 'kotlin',
          description: 'Kotlin generator',
          version: '1.0.0',
          templateRoot: '/tmp',
          authors: [],
        },
        inputs: [
          {
            name: 'directory',
            description: 'The directory to generate the project in',
            type: DataType.string,
            required: true,
          },
        ],
      },
    ])
    sandbox.stub(definition, 'checkDefinitionFileExistsInDirectory').callsFake(async () => {})
    sandbox.stub(definition, 'parseDefinitionFileInCurrentDirectory').callsFake(async () => ({
      project: {
        name: 'test-project',
        version: '1.0.0',
        client: 'recognize',
        team: 'technology',
      },
      entities: [
        {
          name: 'test-entity',
          fields: [
            {name: 'title', type: DataType.string, required: true},
            {name: 'description', type: DataType.text, required: false},
          ],
        },
        {
          name: 'other-entity',
          fields: [
            {name: 'projectNumber', type: DataType.integer, required: true},
            {name: 'address', type: DataType.string, required: false},
          ],
        },
      ],
      workingDirectory: '/tmp',
      generators: [
        {packageName: '@recognizegroup/kotlin', inputs: {directory: 'tmp'}},
      ],
    }))
  })

  afterEach(() => {
    sandbox.restore()
  })

  test
  .stdout()
  .command(['generate'])
  .it('runs generate command', ctx => {
    expect(ctx.stdout).to.contain('✅  Generated 1 projects and 2 entities')
  })
})
