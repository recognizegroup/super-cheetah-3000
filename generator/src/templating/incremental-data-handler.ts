import {IncrementalDataTemplatePiece} from '../models/incremental-data-template-piece'
import {LockFile} from '../models/lock-file'
import {LockFileManager} from '../lock-file/lock-file-manager'
import {Filesystem} from '../io/filesystem'
import {NunjucksTemplateEngine} from './nunjucks-template-engine'
import {EntityContext} from '../context/entity-context'

export class IncrementalDataHandler {
  private dataPieces: IncrementalDataTemplatePiece[] = []

  constructor(private lockFileManager: LockFileManager, private filesystem: Filesystem) {}

  loadFromLockFile(lockFile: LockFile | null) {
    this.dataPieces = lockFile?.incrementalData ?? []
  }

  getDataPieces(): IncrementalDataTemplatePiece[] {
    return this.dataPieces
  }

  async renderIncrementalData(context: EntityContext) {
    const engine = new NunjucksTemplateEngine()
    await engine.setup(this)

    for (const piece of this.dataPieces) {
      const file = await this.filesystem.read(piece.outputFile)
      const text = file.toString()

      const body = await engine.render(piece.body, context.buildVariables())
      const newText = text.replace(new RegExp(piece.marker, 'g'), body + `\n${piece.marker}`)

      await this.filesystem.write(piece.outputFile, Buffer.from(newText))
    }
  }

  async registerDataPiece(id: string, body: string, path: string): Promise<string> {
    const marker = this.createMarker(id)
    const piece = {
      id,
      marker,
      body,
      outputFile: path,
    }

    this.dataPieces.push(piece)

    await this.lockFileManager.addIncrementalData(piece)

    return marker
  }

  createMarker(id: string): string {
    const random = Math.random().toString(36).slice(7)

    return `<!-- SC3000: ${id}-${random} do not remove this line -->`
  }
}
