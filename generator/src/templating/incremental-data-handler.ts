import {IncrementalDataTemplatePiece} from '../models/incremental-data-template-piece'
import {LockFile} from '../models/lock-file'
import {LockFileManager} from '../lock-file/lock-file-manager'
import {Filesystem} from '../io/filesystem'
import {NunjucksTemplateEngine} from './nunjucks-template-engine'
import {EntityContext} from '../context/entity-context'
import {Generator} from '../models/generator'
import {EOL} from 'node:os'

export class IncrementalDataHandler {
  private dataPieces: IncrementalDataTemplatePiece[] = []

  constructor(private lockFileManager: LockFileManager, private filesystem: Filesystem) {}

  loadFromLockFile(lockFile: LockFile | null) {
    this.dataPieces = lockFile?.incrementalData ?? []
  }

  getDataPieces(): IncrementalDataTemplatePiece[] {
    return this.dataPieces
  }

  async renderIncrementalData(context: EntityContext, generator: Generator) {
    const engine = new NunjucksTemplateEngine(generator.metaData.templateRoot)
    await engine.setup(generator.metaData.name, this)

    for (const piece of this.dataPieces.filter(d => d.generatorName === undefined || d.generatorName === generator.metaData.name)) {
      const file = await this.filesystem.read(piece.outputFile)
      const text = file.toString()

      const body = await engine.render(piece.body, context.buildVariables())
      const newText = text.replaceAll(piece.marker, body + `${EOL}${piece.marker}`)

      await this.filesystem.write(piece.outputFile, Buffer.from(newText))
    }
  }

  // eslint-disable-next-line max-params
  async registerDataPiece(id: string, body: string, path: string, markerLanguage: string, generatorName?: string): Promise<string> {
    const marker = this.createMarker(id, markerLanguage)
    const piece = {
      id,
      marker,
      body,
      outputFile: path,
      generatorName: generatorName,
    } as IncrementalDataTemplatePiece

    this.dataPieces.push(piece)

    await this.lockFileManager.addIncrementalData(piece)

    return marker
  }

  createMarker(id: string, markerLanguage: string): string {
    const random = Math.random().toString(36).slice(7)

    switch (markerLanguage) {
    case 'html':
      return `<!-- SC3000: ${id}-${random} do not remove this line -->`
    case 'ts':
    case 'cs':
    case 'kt':
    case 'java':
    case 'tf':
    case 'hcl':
      return `// SC3000: ${id}-${random} do not remove this line`
    default:
      throw new Error(`Unknown marker language: ${markerLanguage}`)
    }
  }
}
