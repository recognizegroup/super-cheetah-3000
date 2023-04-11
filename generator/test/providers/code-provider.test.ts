import {expect} from 'chai'
import {SinonSandbox} from 'sinon'
import sinon from 'sinon'
import {
  CodeProvider,
  Context,
  EjsTemplateEngine,
  FakerTestDataManager,
  Generator,
  Input,
  LocalFilesystem, Project, ProjectContext,
} from '../../src'

class ConcreteCodeProvider extends CodeProvider<Context> {
  constructor(generator: Generator) {
    super(generator)
  }

  getInputs(): Input[] {
    return []
  }

  async generate(_context: Context): Promise<void> {
    // Do something here to generate code for the given context
  }
}

describe('code provider', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  const root = '/tmp/test'

  describe('render', () => {
    it('should call correct render methods', async () => {
      const generator = {
        metaData: {
          name: 'Kotlin Spring Backend',
          description: 'A generator for Kotlin Spring Backends',
          version: '0.0.1-alpha',
          authors: ['Recognize', 'Bart Wesselink'],
          templateRoot: root + '/../templates/',
        },
        entityCodeProvider: new ConcreteCodeProvider(this as any),
        projectCodeProvider: new ConcreteCodeProvider(this as any),
      }

      const codeProvider = new ConcreteCodeProvider(generator)
      const setContextSpy = sandbox.spy(codeProvider.renderer, 'setContext')
      const renderSpy = sandbox.spy(codeProvider.renderer, 'render')
      const resetSpy = sandbox.spy(codeProvider.renderer, 'reset')

      const filesystem = new LocalFilesystem(root)
      const templateEngine = new EjsTemplateEngine(root)
      const testData = new FakerTestDataManager()

      const project: Project = {
        client: 'recognize',
        name: 'bezoekersapp',
        team: 'team-technology',
      }

      const context = new ProjectContext({
        project,
        filesystem,
        templateEngine,
        testData,
      })

      await codeProvider.render(context)

      expect(setContextSpy.calledOnce).to.be.true
      expect(renderSpy.calledOnce).to.be.true
      expect(resetSpy.calledOnce).to.be.true
      expect(setContextSpy.calledBefore(renderSpy)).to.be.true
      expect(renderSpy.calledBefore(resetSpy)).to.be.true
    })
  })
})
