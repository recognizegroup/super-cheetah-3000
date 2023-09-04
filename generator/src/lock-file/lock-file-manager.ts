import {LockFile} from '../models/lock-file'
import {writeFile, readFile} from 'node:fs/promises'
import {Generator} from '../models/generator'
import {Entity} from '../models/entity'
import {IncrementalDataTemplatePiece} from '../models/incremental-data-template-piece'
import {Infrastructure} from '../models/infrastructure'

export class LockFileManager {
  readonly lockFileName = 'sc3000.lock.json'

  constructor(private path: string) {}

  public async readLockFile(): Promise<LockFile | null> {
    let object: any

    try {
      const file = await readFile(this.path + '/' + this.lockFileName, 'utf8')
      object = JSON.parse(file)
    } catch {
      return null
    }

    if (!this.validateLockFile(object)) {
      throw new Error('Invalid lock file.')
    }

    return object
  }

  public async addGeneratedEntity(generator: Generator, entity: Entity): Promise<LockFile> {
    const lockFile = await this.readLockFile()
    const base = lockFile ?? this.createBaseLockFile()

    const generatorItem = base.generated.find(it => it.generator === generator.metaData.name)
    if (generatorItem) {
      generatorItem.entities = generatorItem.entities ?? []
      generatorItem.entities.push(entity)
    } else {
      base.generated.push({
        generator: generator.metaData.name,
        entities: [entity],
      })
    }

    this.updateLockFileMetadata(base)

    return this.writeLockFile(base)
  }

  public async addGeneratedProject(generator: Generator): Promise<LockFile> {
    const lockFile = await this.readLockFile()
    const base = lockFile ?? this.createBaseLockFile()

    const generatorItem = base.generated.find(it => it.generator === generator.metaData.name)
    if (generatorItem) {
      generatorItem.project = true
    } else {
      base.generated.push({
        generator: generator.metaData.name,
        project: true,
      })
    }

    this.updateLockFileMetadata(base)
    await this.writeLockFile(base)

    return base
  }

  public async addGeneratedInfrastructure(generator: Generator, infrastructure: Infrastructure): Promise<LockFile> {
    const lockFile = await this.readLockFile()
    const base = lockFile ?? this.createBaseLockFile()

    const generatorItem = base.generated.find(it => it.generator === generator.metaData.name)
    if (generatorItem) {
      generatorItem.infrastructure = {...infrastructure}
    } else {
      base.generated.push({
        generator: generator.metaData.name,
        infrastructure: {...infrastructure},
      })
    }

    this.updateLockFileMetadata(base)

    return this.writeLockFile(base)
  }

  public async addIncrementalData(piece: IncrementalDataTemplatePiece) {
    const lockFile = await this.readLockFile()
    const base = lockFile ?? this.createBaseLockFile()
    const existing = base.incrementalData?.find(it => it.id === piece.id)

    if (existing) {
      existing.body = piece.body
    } else {
      base.incrementalData = base.incrementalData ?? []
      base.incrementalData.push(piece)
    }

    this.updateLockFileMetadata(base)

    return this.writeLockFile(base)
  }

  private updateLockFileMetadata(lockFile: LockFile): LockFile {
    // Sort generated items by generator name and entities by entity name
    lockFile.generated = lockFile.generated.sort((a, b) => a.generator.localeCompare(b.generator))
    for (const it of lockFile.generated) {
      if (it.entities) {
        it.entities = it.entities.sort((a, b) => a.name.localeCompare(b.name))
      }
    }

    return lockFile
  }

  private createBaseLockFile(): LockFile {
    return {
      generated: [],
    }
  }

  public async hasGeneratedEntityWithGenerator(generator: Generator, entity: Entity): Promise<boolean> {
    const lockFile = await this.readLockFile()
    const generatorName = generator.metaData.name
    const entityName = entity.name

    return lockFile?.generated.some(generatedItem => {
      return generatedItem.generator === generatorName && generatedItem.entities?.some(it => it.name === entityName)
    }) ?? false
  }

  public async hasGeneratedProjectWithGenerator(generator: Generator): Promise<boolean> {
    const lockFile = await this.readLockFile()
    const generatorName = generator.metaData.name

    return lockFile?.generated.some(generatedItem => {
      return generatedItem.generator === generatorName && generatedItem.project
    }) ?? false
  }

  public async hasGeneratedInfrastructureWithGenerator(generator: Generator): Promise<boolean> {
    const lockFile = await this.readLockFile()
    const generatorName = generator.metaData.name

    return lockFile?.generated.some(generatedItem => {
      return generatedItem.generator === generatorName && generatedItem.infrastructure
    }) ?? false
  }

  public async writeLockFile(lockFile: LockFile): Promise<LockFile> {
    const withoutCircularReferences = this.removeCircularReferences(lockFile)

    const content = JSON.stringify(withoutCircularReferences, null, 2)
    await writeFile(this.path + '/' + this.lockFileName, content)

    return withoutCircularReferences
  }

  public validateLockFile(lockFile: any): lockFile is LockFile {
    if (!Array.isArray(lockFile.generated)) {
      return false
    }

    return lockFile.generated.every((generatedItem: any) => {
      if (!generatedItem.generator) {
        return false
      }

      return generatedItem.project === true || Array.isArray(generatedItem.entities)
    })
  }

  private removeCircularReferences(lockFile: LockFile): LockFile {
    const copy = {...lockFile}
    copy.generated = copy.generated.map(it => ({
      ...it,
      entities: it.entities?.map(entity => ({
        ...entity,
        fields: entity.fields?.map(field => ({
          ...field,
          type: typeof field.type === 'string' ? field.type : {
            ...field.type,
            target: {
              ...field.type.target,
              fields: [],
            },
          },
        })),
      })) ?? [],
    }))

    return copy
  }
}
