import {expect} from 'chai'
import {SinonSandbox} from 'sinon'
import sinon from 'sinon'
import {promises as fs} from 'node:fs'
import {LockFileManager} from '../../src/lock-file/lock-file-manager'
import {LockFile} from '../../src/models/lock-file'
import {Entity, Generator, Infrastructure, RelationshipParity} from '../../src'

describe('lock file manager', () => {
  let lockFileManager: LockFileManager
  let sandbox: SinonSandbox

  beforeEach(() => {
    lockFileManager = new LockFileManager('path/to/files')
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('read lock file', () => {
    it('should return null if the lock file does not exist', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')
      const lockFilePath = 'path/to/files/sc3000.lock.json'
      readFileStub.withArgs(lockFilePath, 'utf8').throws()

      const lockFile = await lockFileManager.readLockFile()

      expect(lockFile).to.be.null
    })

    it('should throw an error if the lock file is invalid', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')
      const lockFilePath = 'path/to/files/sc3000.lock.json'
      const invalidLockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: null,
          },
        ],
      }
      readFileStub.withArgs(lockFilePath, 'utf8').resolves(JSON.stringify(invalidLockFile))

      try {
        await lockFileManager.readLockFile()
        expect.fail('Expected error to be thrown.')
      } catch (error) {
        expect((error as Error).message).to.equal('Invalid lock file.')
      }
    })

    it('should return the lock file object if it is valid', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')
      const lockFilePath = 'path/to/files/sc3000.lock.json'
      const validLockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
          },
        ],
      }
      readFileStub.withArgs(lockFilePath, 'utf8').resolves(JSON.stringify(validLockFile))

      const lockFile = await lockFileManager.readLockFile()

      expect(lockFile).to.deep.equal(validLockFile)
    })
  })

  describe('add generated entity', () => {
    it('should create a new lock file if lockFile is null', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')
      readFileStub.rejects(new Error('File not found'))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const entity: Entity = {name: 'entity1', fields: []} as any
      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedEntity(generator, entity)

      expect(result).to.deep.equal(expectedLockFile)
      sinon.assert.calledWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })

    it('should create a new lock file if there are circular references', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')
      readFileStub.rejects(new Error('File not found'))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const entityOne: Entity = {name: 'entity1', fields: []} as any
      const entityTwo: Entity = {name: 'entity2', fields: [
        {
          name: 'entityOne',
          type: {
            target: entityOne,
            parity: RelationshipParity.manyToOne,
          },
        },
      ]} as any

      entityOne.fields.push({
        name: 'entityTwo',
        type: {
          target: entityTwo,
          parity: RelationshipParity.oneToMany,
        },
      })

      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [
                  {
                    name: 'entityTwo',
                    type: {
                      target: {name: 'entity2', fields: []},
                      parity: RelationshipParity.oneToMany,
                    },
                  },
                ],
              },
            ],
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedEntity(generator, entityOne)

      expect(result).to.deep.equal(expectedLockFile)
      sinon.assert.calledWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })

    it('should add the entity to an existing lock file', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const entity: Entity = {name: 'entity2', fields: []} as any
      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
              {
                name: 'entity2',
                fields: [],
              },
            ],
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedEntity(generator, entity)

      expect(result).to.deep.equal(expectedLockFile)
      sinon.assert.calledOnceWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })
  })

  describe('add generated project', () => {
    it('should create a new lock file if lockFile is null', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')

      readFileStub.rejects(new Error('File not found'))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            project: true,
            entities: [],
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedProject(generator)

      expect(result).to.deep.equal(expectedLockFile)

      sinon.assert.calledOnceWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })

    it('should add the project to an existing lock file', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
            project: true,
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedProject(generator)

      expect(result).to.deep.equal(expectedLockFile)
      sinon.assert.calledOnceWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })

    it('should create a new generator item with project flag if it does not exist', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator2'}} as any
      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
          },
          {
            generator: 'generator2',
            project: true,
            entities: [],
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedProject(generator)

      expect(result).to.deep.equal(expectedLockFile)
      sinon.assert.calledOnceWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })
  })

  describe('has generated entity with generator', () => {
    it('should return false if lockFile is null', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')

      readFileStub.rejects(new Error('File not found'))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const entity: Entity = {name: 'entity1'} as any

      const result = await lockFileManager.hasGeneratedEntityWithGenerator(generator, entity)

      expect(result).to.be.false
    })

    it('should return false if the generator or entity does not exist in the lock file', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator2'}} as any
      const entity: Entity = {name: 'entity2'} as any

      const result = await lockFileManager.hasGeneratedEntityWithGenerator(generator, entity)

      expect(result).to.be.false
    })

    it('should return true if the generator and entity exist in the lock file', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))
      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const entity: Entity = {name: 'entity1'} as any

      const result = await lockFileManager.hasGeneratedEntityWithGenerator(generator, entity)

      expect(result).to.be.true
    })
  })

  describe('has generated project with generator', () => {
    it('should return false if lockFile is null', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')
      readFileStub.rejects(new Error('File not found'))
      const generator: Generator = {metaData: {name: 'generator1'}} as any

      const result = await lockFileManager.hasGeneratedProjectWithGenerator(generator)

      expect(result).to.be.false
    })

    it('should return false if the generator does not exist in the lock file', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator2'}} as any

      const result = await lockFileManager.hasGeneratedProjectWithGenerator(generator)

      expect(result).to.be.false
    })

    it('should return true if the generator exists as a project in the lock file', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')
      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
            project: true,
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator1'}} as any

      const result = await lockFileManager.hasGeneratedProjectWithGenerator(generator)

      expect(result).to.be.true
    })

    it('should return false if the generator exists but not as a project in the lock file', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')
      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator1'}} as any

      const result = await lockFileManager.hasGeneratedProjectWithGenerator(generator)

      expect(result).to.be.false
    })
  })

  describe('write lock file', () => {
    it('should write the lock file content to the specified file', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const lockFile: LockFile = {
        generated: [],
      }
      const expectedContent = JSON.stringify(lockFile, null, 2)
      writeFileStub.resolves()

      await lockFileManager.writeLockFile(lockFile)

      sinon.assert.calledOnceWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', expectedContent)
    })
  })

  describe('validate lock file', () => {
    it('should return false if lockFile.generated is not an array', () => {
      const lockFile: any = {
        version: 0,
        lastModified: '',
        generated: {},
      }

      const result = lockFileManager.validateLockFile(lockFile)

      expect(result).to.be.false
    })

    it('should return false if any generated item is missing the generator field', () => {
      const lockFile: any = {
        generated: [
          {
            entities: [],
          },
        ],
      }

      const result = lockFileManager.validateLockFile(lockFile)

      expect(result).to.be.false
    })

    it('should return false if any generated item has entities that are not an array', () => {
      const lockFile: any = {
        generated: [
          {
            generator: 'generator1',
            entities: {},
          },
        ],
      }

      const result = lockFileManager.validateLockFile(lockFile)

      expect(result).to.be.false
    })

    it('should return true if the lock file is valid', () => {
      const lockFile: any = {
        generated: [
          {
            generator: 'generator1',
            entities: [],
          },
        ],
      }

      const result = lockFileManager.validateLockFile(lockFile)

      expect(result).to.be.true
    })
  })

  describe('add generated infrastructure', () => {
    const infrastructure: Infrastructure = {
      services: [
        {name: 'application '},
      ],
      storages: [
        {name: 'blob'},
      ],
      databases: [],
      network: {
        ipRange: '10.0.0.0/16',
      },
    }

    it('should create a new lock file if lockFile is null', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')
      readFileStub.rejects(new Error('File not found'))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            infrastructure,
            entities: [],
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedInfrastructure(generator, infrastructure)

      expect(result).to.deep.equal(expectedLockFile)
      sinon.assert.calledWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })

    it('should add the infrastructure to an existing lock file', async () => {
      const writeFileStub = sandbox.stub(fs, 'writeFile')
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const expectedLockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
            infrastructure,
          },
        ],
      }
      writeFileStub.resolves()

      const result = await lockFileManager.addGeneratedInfrastructure(generator, infrastructure)

      expect(result).to.deep.equal(expectedLockFile)
      sinon.assert.calledOnceWithExactly(writeFileStub, 'path/to/files/sc3000.lock.json', JSON.stringify(expectedLockFile, null, 2))
    })
  })

  describe('has generated infrastructure with generator', () => {
    const infrastructure: Infrastructure = {
      services: [
        {name: 'application '},
      ],
      storages: [
        {name: 'blob'},
      ],
      databases: [],
      network: {
        ipRange: '10.0.0.0/16',
      },
    }

    it('should return false if lockFile is null', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')

      readFileStub.rejects(new Error('File not found'))

      const generator: Generator = {metaData: {name: 'generator1'}} as any
      const result = await lockFileManager.hasGeneratedInfrastructureWithGenerator(generator)

      expect(result).to.be.false
    })

    it('should return false if the generator or infrastructure does not exist in the lock file', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))

      const generator: Generator = {metaData: {name: 'generator2'}} as any

      const result = await lockFileManager.hasGeneratedInfrastructureWithGenerator(generator)

      expect(result).to.be.false
    })

    it('should return true if the generator and infrastructure exist in the lock file', async () => {
      const readFileStub = sandbox.stub(fs, 'readFile')

      const lockFile: LockFile = {
        generated: [
          {
            generator: 'generator1',
            entities: [
              {
                name: 'entity1',
                fields: [],
              },
            ],
            infrastructure,
          },
        ],
      }

      readFileStub.resolves(JSON.stringify(lockFile))
      const generator: Generator = {metaData: {name: 'generator1'}} as any

      const result = await lockFileManager.hasGeneratedInfrastructureWithGenerator(generator)

      expect(result).to.be.true
    })
  })
})
