import {expect} from 'chai'
import {
  EntityContext,
  FakerTestDataManager,
  LocalFilesystem,
  Project,
  ProjectContext,
} from '../../src'

describe('context', () => {
  const project: Project = {
    client: 'recognize',
    name: 'bezoekersapp',
    team: 'team-technology',
  }

  const sampleRoot = '/tmp/test'

  it('should be able construct a project context and build variables', () => {
    const filesystem = new LocalFilesystem(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new ProjectContext({
      project,
      filesystem,
      testData,
      inputs: {
        directory: '/tmp',
      },
    })

    expect(context.project).to.equal(project)
    expect(context.filesystem).to.equal(filesystem)
    expect(context.testData).to.equal(testData)
    expect(context.findInputValue('directory')).to.equal('/tmp')

    const variables = context.buildVariables()
    expect(variables).to.have.property('project')
    expect(variables).to.have.property('testData')
  })

  it('should be able construct an entity context and build variables', () => {
    const entity = {
      name: 'Project',
      fields: [],
    }

    const filesystem = new LocalFilesystem(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new EntityContext({
      project,
      filesystem,
      testData,
      entity,
      inputs: {
        directory: '/tmp',
      },
    })

    expect(context.project).to.equal(project)
    expect(context.filesystem).to.equal(filesystem)
    expect(context.testData).to.equal(testData)
    expect(context.entity).to.equal(entity)
    expect(context.findInputValue('directory')).to.equal('/tmp')

    const variables = context.buildVariables()
    expect(variables).to.have.property('project')
    expect(variables).to.have.property('testData')
    expect(variables).to.have.property('entity')
    expect(variables.entity).to.equal(entity)
  })

  it('should enable all operations if none provided', () => {
    const entity = {
      name: 'Project',
      fields: [],
    }

    const filesystem = new LocalFilesystem(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new EntityContext({
      project,
      filesystem,
      testData,
      entity,
      inputs: {
        directory: '/tmp',
      },
    })

    expect(context.entity.operations).not.to.be.undefined
    expect(context.entity.operations?.create).to.be.true
    expect(context.entity.operations?.read).to.be.true
    expect(context.entity.operations?.update).to.be.true
    expect(context.entity.operations?.delete).to.be.true
  })

  it('should merge operations if explicitely defined', () => {
    const entity = {
      name: 'Project',
      fields: [],
      operations: {
        read: false,
      },
    }

    const filesystem = new LocalFilesystem(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new EntityContext({
      project,
      filesystem,
      testData,
      entity,
      inputs: {
        directory: '/tmp',
      },
    })

    expect(context.entity.operations).not.to.be.undefined
    expect(context.entity.operations?.create).to.be.true
    expect(context.entity.operations?.read).to.be.false
    expect(context.entity.operations?.update).to.be.true
    expect(context.entity.operations?.delete).to.be.true
  })
})
