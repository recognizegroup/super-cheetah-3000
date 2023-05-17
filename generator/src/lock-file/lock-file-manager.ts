import {LockFile} from '../models/lock-file'
import {writeFile, readFile} from 'node:fs/promises'
import {Generator} from '../models/generator'
import {Entity} from '../models/entity'

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

  public async addGeneratedEntity(lockFile: LockFile | null, generator: Generator, entity: Entity): Promise<LockFile> {
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
    await this.writeLockFile(base)

    return base
  }

  public async addGeneratedProject(lockFile: LockFile | null, generator: Generator): Promise<LockFile> {
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

  public hasGeneratedEntityWithGenerator(lockFile: LockFile | null, generator: Generator, entity: Entity): boolean {
    const generatorName = generator.metaData.name
    const entityName = entity.name

    return lockFile?.generated.some(generatedItem => {
      return generatedItem.generator === generatorName && generatedItem.entities?.some(it => it.name === entityName)
    }) ?? false
  }

  public hasGeneratedProjectWithGenerator(lockFile: LockFile | null, generator: Generator): boolean {
    const generatorName = generator.metaData.name

    return lockFile?.generated.some(generatedItem => {
      return generatedItem.generator === generatorName && generatedItem.project
    }) ?? false
  }

  public async writeLockFile(lockFile: LockFile): Promise<void> {
    const content = JSON.stringify(lockFile, null, 2)
    await writeFile(this.path + '/' + this.lockFileName, content)
  }

  public validateLockFile(lockFile: any): lockFile is LockFile {
    if (!Array.isArray(lockFile.generated)) {
      return false
    }

    return lockFile.generated.every((generatedItem: any) => {
      if (!generatedItem.generator) {
        return false
      }

      return Array.isArray(generatedItem.entities)
    })
  }
}
