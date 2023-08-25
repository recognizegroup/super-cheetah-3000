import {expect} from 'chai'
import sinon, {SinonSandbox} from 'sinon'
import {TemplateMetadata} from '../../src/models/template-metadata'
import {Renderer} from '../../src/rendering/renderer'
import {
  EntityCodeProvider,
  FakerTestDataManager,
  LocalFilesystem,
  Project,
  ProjectCodeProvider,
  ProjectContext,
  Context,
  RenderHookType, NunjucksTemplateEngine, IdentityProviderType,
} from '../../src'
import * as commandWrapper from '../../src/util/command-wrapper'
import {IncrementalDataHandler} from '../../src/templating/incremental-data-handler'

describe('renderer', () => {
  let sandbox: SinonSandbox
  let renderer: Renderer

  const project: Project = {
    client: 'recognize',
    name: 'bezoekersapp',
    team: 'team-technology',
  }

  const securityConfiguration = {
    identityProvider: {
      type: IdentityProviderType.AZURE_AD,
      properties: {
        clientId: '1234',
        tenantId: '1234',
      },
    },
    roles: [],
  }

  const filesystem = sinon.createStubInstance(LocalFilesystem)
  const testData = sinon.createStubInstance(FakerTestDataManager)
  const incrementalDataHandler = sinon.createStubInstance(IncrementalDataHandler)

  const context = new ProjectContext({
    project,
    filesystem,
    testData,
    incrementalDataHandler,
    securityConfiguration,
    inputs: {
      directory: '/tmp',
    },
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    const generator = {
      metaData: {
        name: 'Kotlin Spring Backend',
        description: 'A generator for Kotlin Spring Backends',
        version: '0.0.1-alpha',
        authors: ['Recognize', 'Bart Wesselink'],
        templateRoot: '/templates/',
      },
      entityCodeProvider: sinon.createStubInstance(EntityCodeProvider),
      projectCodeProvider: sinon.createStubInstance(ProjectCodeProvider),
      inputs: [],
    }

    renderer = new Renderer(generator)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('create dependency tree', () => {
    let files: TemplateMetadata[]

    beforeEach(() => {
      files = [
        {
          id: 'file1',
          path: 'path/to/file1',
          permissions: 0o644,
          outputPath: 'output/path/to/file1',
          content: Buffer.from(''),
          constants: {},
          dependencies: [],
          variables: {},
        },
        {
          id: 'file2',
          path: 'path/to/file2',
          permissions: 0o644,
          outputPath: 'output/path/to/file2',
          content: Buffer.from(''),
          constants: {},
          dependencies: ['file1'],
          variables: {},
        },
        {
          id: 'file3',
          path: 'path/to/file3',
          permissions: 0o644,
          outputPath: 'output/path/to/file3',
          content: Buffer.from(''),
          constants: {},
          dependencies: ['file1', 'file2'],
          variables: {},
        },
        {
          id: 'file4',
          path: 'path/to/file4',
          permissions: 0o644,
          outputPath: 'output/path/to/file4',
          content: Buffer.from(''),
          constants: {},
          dependencies: [],
          variables: {},
        },
        {
          id: null,
          path: 'path/to/file4',
          permissions: 0o644,
          outputPath: 'output/path/to/file5',
          content: Buffer.from(''),
          constants: {},
          dependencies: [],
          variables: {},
        },
      ]
    })

    it('should group files by their dependencies', () => {
      const filesByOutputPath: TemplateMetadata[] = [{
        id: null,
        path: 'path/to/file4',
        permissions: 0o644,
        outputPath: 'output/path/to/file5',
        content: Buffer.from(''),
        constants: {},
        dependencies: [],
        variables: {},
      }, {
        id: null,
        path: 'path/to/file4',
        permissions: 0o644,
        outputPath: 'output/path/to/file6',
        content: Buffer.from(''),
        constants: {},
        dependencies: [],
        variables: {},
      }]
      const expectedGroups = [
        [filesByOutputPath[0], filesByOutputPath[1]],
      ]

      const actualGroups = renderer.createDependencyTree(filesByOutputPath)

      expect(actualGroups).to.deep.equal(expectedGroups)
    })

    it('should add files by their outputPath', () => {
      const expectedGroups = [
        [files[0], files[3], files[4]],
        [files[1]],
        [files[2]],
      ]

      const actualGroups = renderer.createDependencyTree(files)

      expect(actualGroups).to.deep.equal(expectedGroups)
    })

    it('should not modify the original array', () => {
      const originalFiles = [...files]
      renderer.createDependencyTree(files)
      expect(files).to.deep.equal(originalFiles)
    })

    it('should handle files without any dependencies', () => {
      const expectedGroups = [
        [files[0], files[1], files[2], files[3], files[4]],
      ]

      files[1].dependencies = []
      files[2].dependencies = []
      const actualGroups = renderer.createDependencyTree(files)

      expect(actualGroups).to.deep.equal(expectedGroups)
    })

    it('should handle empty input array', () => {
      const expectedGroups: TemplateMetadata[][] = []

      const actualGroups = renderer.createDependencyTree([])

      expect(actualGroups).to.deep.equal(expectedGroups)
    })
  })

  describe('reset', () => {
    it('should reset all fields', () => {
      renderer.setContext(context)
      renderer.setVariables({
        foo: 'bar',
      })

      const processMetadataStub = sandbox.stub(renderer, 'processMetadata')
      processMetadataStub.resolves()

      renderer.addFile('foo', 'bar')
      renderer.addHook(RenderHookType.afterRender, async (_context: Context) => {})

      renderer.reset()

      expect(renderer.getVariables()).to.deep.equal({})
      expect(renderer.getContext()).to.be.null
      expect(renderer.getFiles()).to.be.empty
      expect(renderer.getHooks()).to.be.empty
    })
  })

  describe('build variables', () => {
    it('should create an object containing all necessary data', () => {
      renderer.setContext(context)
      renderer.setVariables({
        foo: 'bar',
      })

      const additional = {
        baz: 'qux',
      }

      const built = renderer.buildVariables(additional)

      expect(built).to.deep.equal({
        ...additional,
        variables: {
          foo: 'bar',
        },
        project,
        testData,
        security: securityConfiguration,
        inputs: {
          directory: '/tmp',
        },
      })
    })
  })

  describe('hooks', () => {
    it('should call regular hooks when rendering', async () => {
      const afterRenderHook = sandbox.stub()
      afterRenderHook.resolves()

      const beforeRenderHook = sandbox.stub()
      beforeRenderHook.resolves()

      renderer.addHook(RenderHookType.beforeRender, beforeRenderHook)
      renderer.addHook(RenderHookType.afterRender, afterRenderHook)

      await renderer.render()

      sinon.assert.calledOnce(beforeRenderHook)
      sinon.assert.calledOnce(afterRenderHook)
    })

    it('should call shell command hooks', async () => {
      const commandStub = sandbox.stub(commandWrapper, 'exec')
      commandStub.resolves({
        stdout: '',
        stderr: '',
      })

      renderer.addShellCommandHook(RenderHookType.beforeRender, 'echo "foo"')

      renderer.setContext(context)
      await renderer.render()

      sinon.assert.calledOnce(commandStub)
      expect(commandStub.firstCall.args[0]).to.equal('echo "foo"')
    })
  })

  describe('process metadata', () => {
    it('should process files with metadata (frontmatter)', async () => {
      const fileContent = `
---
id: sample
dependencies: [foo]
constants:
    foo: bar
---
Test file`.trim()

      sandbox.stub(NunjucksTemplateEngine.prototype, 'render').resolves('Test file')
      filesystem.read.resolves(Buffer.from(fileContent))
      filesystem.fetchPermissions.resolves(0o644)

      sandbox.stub(renderer, 'getGeneratorTemplateFilesystem').returns(filesystem)

      renderer.setContext(context)
      const file = await renderer.processMetadata('foo/bar.njk', 'output/foo/bar.njk', {})

      const expectedFile: TemplateMetadata = {
        id: 'sample',
        path: 'foo/bar.njk',
        permissions: 0o644,
        outputPath: 'output/foo/bar.njk',
        content: Buffer.from('Test file'),
        constants: {
          foo: 'bar',
        },
        dependencies: ['foo'],
        frontMatterLength: 6,
        variables: {},
      }

      expect(file).to.deep.equal(expectedFile)
    })

    it('should return a simple file when no template engine was found', async () => {
      const fileContent = 'Test file'.trim()
      filesystem.read.resolves(Buffer.from(fileContent))
      filesystem.fetchPermissions.resolves(0o644)

      sandbox.stub(renderer, 'getGeneratorTemplateFilesystem').returns(filesystem)

      renderer.setContext(context)
      const file = await renderer.processMetadata('foo/bar.yml', 'output/foo/bar.yml', {
        foo: 'bar',
      })

      const expected = {
        id: null,
        path: 'foo/bar.yml',
        permissions: 0o644,
        outputPath: 'output/foo/bar.yml',
        content: Buffer.from(fileContent),
        constants: {},
        dependencies: [],
        frontMatterLength: 0,
        variables: {
          foo: 'bar',
        },
      }

      expect(file).to.deep.equal(expected)
    })
  })

  describe('render', () => {
    it('should render all files that were added', async () => {
      const executeRenderHook = sandbox.stub(renderer, 'executeHook')

      renderer.reset()
      renderer.setContext(context)

      const processMetadataStub = sandbox.stub(renderer, 'processMetadata').resolves({
        id: 'sample',
        path: 'sample.kt.njk',
        permissions: 0o644,
        outputPath: 'sample.kt',
        content: Buffer.from('Test file one ({{ constants.foo }})'),
        constants: {
          foo: 'bar',
        },
        dependencies: [],
        variables: {},
      })

      await renderer.addFile('sample.kt.njk', 'sample.kt')

      processMetadataStub.restore()
      sandbox.stub(renderer, 'processMetadata').resolves({
        id: null,
        path: 'two.yml',
        permissions: 0o644,
        outputPath: 'two.yml',
        content: Buffer.from('Test file two'),
        constants: {},
        dependencies: [],
        variables: {},
      })
      await renderer.addFile('two.yml', 'two.yml')

      await renderer.render()

      sinon.assert.calledWith(executeRenderHook, RenderHookType.beforeRender)
      sinon.assert.calledWith(executeRenderHook, RenderHookType.afterRender)
      sinon.assert.calledWith(filesystem.write, 'sample.kt', Buffer.from('Test file one (bar)'), 0o644)
      sinon.assert.calledWith(filesystem.write, 'two.yml', Buffer.from('Test file two'), 0o644)
    })

    it('should render files with file-specific variables', async () => {
      const executeRenderHook = sandbox.stub(renderer, 'executeHook')

      renderer.reset()
      renderer.setContext(context)

      sandbox.stub(renderer, 'processMetadata').resolves({
        id: 'sample',
        path: 'sample.kt.njk',
        permissions: 0o644,
        outputPath: 'sample.kt',
        content: Buffer.from('Test file one ({{ variables.foo }})'),
        constants: {},
        dependencies: [],
        variables: {
          foo: 'baz',
        },
      })

      await renderer.addFile('sample.kt.njk', 'sample.kt')
      await renderer.render()

      sinon.assert.calledWith(executeRenderHook, RenderHookType.beforeRender)
      sinon.assert.calledWith(executeRenderHook, RenderHookType.afterRender)
      sinon.assert.calledWith(filesystem.write, 'sample.kt', Buffer.from('Test file one (baz)'), 0o644)
    })

    it('should render all files that have outputs and dependencies on other files', async () => {
      renderer.reset()
      renderer.setContext(context)

      const processMetadataStub = sandbox.stub(renderer, 'processMetadata').resolves({
        id: 'sample',
        path: 'sample.kt.njk',
        permissions: 0o644,
        outputPath: 'sample.kt',
        content: Buffer.from('Test file one ({{ constants.foo }})'),
        constants: {
          foo: 'bar',
        },
        dependencies: [],
        variables: {},
      })

      await renderer.addFile('sample.kt.njk', 'sample.kt')

      processMetadataStub.restore()
      sandbox.stub(renderer, 'processMetadata').resolves({
        id: 'second',
        path: 'second.kt.njk',
        permissions: 0o644,
        outputPath: 'second.kt',
        content: Buffer.from('With a dependency ({{ dependencies.sample.foo }})'),
        constants: {},
        dependencies: ['sample'],
        variables: {},
      })
      await renderer.addFile('second.kt.njk', 'second.kt')

      await renderer.render()

      sinon.assert.calledWith(filesystem.write, 'sample.kt', Buffer.from('Test file one (bar)'), 0o644)
      sinon.assert.calledWith(filesystem.write, 'second.kt', Buffer.from('With a dependency (bar)'), 0o644)
    })

    it('should skip writing a file when no confirmation was given', async () => {
      const filesystem = sinon.createStubInstance(LocalFilesystem)

      const context = new ProjectContext({
        project,
        filesystem,
        testData,
        incrementalDataHandler,
        securityConfiguration,
        inputs: {
          directory: '/tmp',
        },
      })

      renderer.reset()
      renderer.setContext(context)
      renderer.setFileExistsConfirmation(async () => false)

      filesystem.exists.resolves(true)

      const processMetadataStub = sandbox.stub(renderer, 'processMetadata').resolves({
        id: 'sample',
        path: 'sample.kt.njk',
        permissions: 0o644,
        outputPath: 'sample.kt',
        content: Buffer.from('Test file one ({{ constants.foo }})'),
        constants: {
          foo: 'bar',
        },
        dependencies: [],
        variables: {},
      })

      await renderer.addFile('sample.kt.njk', 'sample.kt')

      processMetadataStub.restore()
      sandbox.stub(renderer, 'processMetadata').resolves({
        id: 'second',
        path: 'second.kt.njk',
        permissions: 0o644,
        outputPath: 'second.kt',
        content: Buffer.from('With a dependency ({{ dependencies.sample.foo }})'),
        constants: {},
        dependencies: ['sample'],
        variables: {},
      })
      await renderer.addFile('second.kt.njk', 'second.kt')

      await renderer.render()

      sinon.assert.notCalled(filesystem.write)
    })
  })
})
