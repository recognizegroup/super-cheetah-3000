import {LockFileGeneratedItem} from './lock-file-generated-item'
import {IncrementalDataTemplatePiece} from './incremental-data-template-piece'

export interface LockFile {
  generated: LockFileGeneratedItem[];
  incrementalData?: IncrementalDataTemplatePiece[];
}
