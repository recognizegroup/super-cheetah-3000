import {access} from 'node:fs/promises'
import {constants} from 'node:fs'
import {join} from 'node:path'
import ts from 'typescript'
import {ProjectDefinition} from '@recognizebv/sc3000-generator'
import {importScript} from '../util/import-wrapper'

export const checkDefinitionFileExistsInDirectory = async (directory: string): Promise<void> => {
  const path = getDefinitionFilePath(directory)

  try {
    await access(path, constants.F_OK)
  } catch {
    throw new Error(`Definition file not found at ${path}`)
  }
}

export const checkDefinitionFileExistsInCurrentDirectory = async (): Promise<void> => {
  await checkDefinitionFileExistsInDirectory(process.cwd())
}

export const parseDefinitionFile = async (path: string): Promise<ProjectDefinition> => {
  const compiled = await compileDefinitionFileFromTypeScript(path)
  const {default: defined} = await importScript(compiled)

  if (!defined) {
    throw new Error('Definition file does not export anything')
  }

  if (!defined.entities) {
    throw new Error('Definition file does not export any entities')
  }

  if (!defined.project) {
    throw new Error('Definition file does not export a project')
  }

  return defined
}

export const compileDefinitionFileFromTypeScript = async (path: string): Promise<string> => {
  const output = join(__dirname, '../../tmp')

  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS,
    sourceMap: false,
    declaration: false,
    noImplicitAny: true,
    noImplicitThis: true,
    strictNullChecks: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    outDir: output,
  }

  try {
    ts.createProgram([path], options)
    return `${output}/sc3000.definition.js`
  } catch {
    throw new Error('Failed to compile definition file to JavaScript')
  }
}

export const parseDefinitionFileInCurrentDirectory = async (): Promise<ProjectDefinition> => {
  return parseDefinitionFile(getDefinitionFilePath(process.cwd()))
}

export const getDefinitionFilePath = (directory: string): string => join(directory, 'sc3000.definition.ts')
