import {LockFile} from '../../src/models/lock-file'
import {IncrementalDataHandler} from '../../src/templating/incremental-data-handler'
import sinon from 'sinon'
import {EntityContext, FakerTestDataManager, Generator, LocalFilesystem, Project} from '../../src'
import {LockFileManager} from '../../src/lock-file/lock-file-manager'
import {expect} from 'chai'

describe('incremental data handler', () => {
  let handler: IncrementalDataHandler
  let sandbox: sinon.SinonSandbox
  let filesystemStub: sinon.SinonStubbedInstance<LocalFilesystem>
  let lockFileManagerStub: sinon.SinonStubbedInstance<LockFileManager>

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    filesystemStub = sinon.createStubInstance(LocalFilesystem)
    lockFileManagerStub = sinon.createStubInstance(LockFileManager)
    handler = new IncrementalDataHandler(lockFileManagerStub, filesystemStub)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should load data from a lock file', () => {
    const lockFile: LockFile = {
      generated: [],
      incrementalData: [
        {
          outputFile: 'test.txt',
          marker: '<!-- SC3000: 1234567890 do not remove this line -->',
          body: 'test',
          id: '1234567890',
        },
      ],
    }

    handler.loadFromLockFile(lockFile)
    expect(handler.getDataPieces()).to.deep.equal(lockFile.incrementalData)
  })

  it('should register a html data piece', async () => {
    const marker = await handler.registerDataPiece('1234567890', 'test', 'test.txt', 'html')
    const validateMarkerRegex = /<!-- sc3000: 1234567890-[\da-z]+ do not remove this line -->/gi

    expect(marker).to.match(validateMarkerRegex)
    expect(handler.getDataPieces()).to.deep.equal([
      {
        id: '1234567890',
        marker,
        body: 'test',
        outputFile: 'test.txt',
      },
    ])
    sinon.assert.calledOnceWithExactly(lockFileManagerStub.addIncrementalData, {
      id: '1234567890',
      marker,
      body: 'test',
      outputFile: 'test.txt',
    })
  })

  it('should register a ts data piece', async () => {
    const marker = await handler.registerDataPiece('1234567890', 'test', 'test.txt', 'ts')
    const validateMarkerRegex = /\/\/ sc3000: 1234567890-[\da-z]+ do not remove this line/gi

    expect(marker).to.match(validateMarkerRegex)
    expect(handler.getDataPieces()).to.deep.equal([
      {
        id: '1234567890',
        marker,
        body: 'test',
        outputFile: 'test.txt',
      },
    ])
    sinon.assert.calledOnceWithExactly(lockFileManagerStub.addIncrementalData, {
      id: '1234567890',
      marker,
      body: 'test',
      outputFile: 'test.txt',
    })
  })

  it('should render incremental data', async () => {
    const lockFile: LockFile = {
      generated: [],
      incrementalData: [
        {
          outputFile: 'test.txt',
          marker: '<!-- SC3000: 1234567890 do not remove this line -->',
          body: 'body {{ entity.name }}',
          id: '1234567890',
        },
      ],
    }

    handler.loadFromLockFile(lockFile)

    const testData = sinon.createStubInstance(FakerTestDataManager)
    const incrementalDataHandler = sinon.createStubInstance(IncrementalDataHandler)
    const generator: Generator = {metaData: {name: 'generator1'}} as any

    const project: Project = {
      client: 'recognize',
      name: 'bezoekersapp',
      team: 'team-technology',
    }

    const entity = {
      name: 'Project',
      fields: [],
    }

    filesystemStub.read.resolves(Buffer.from('<!-- SC3000: 1234567890 do not remove this line -->'))

    const context = new EntityContext({
      project,
      filesystem: filesystemStub,
      testData,
      entity,
      incrementalDataHandler,
      inputs: {
        directory: '/tmp',
      },
    })

    await handler.renderIncrementalData(context, generator)

    const result = `body Project
<!-- SC3000: 1234567890 do not remove this line -->`

    sinon.assert.calledOnceWithExactly(filesystemStub.write, 'test.txt', Buffer.from(result))
  })
})
