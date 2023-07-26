import ts from 'typescript'

export const createProgram = (files: string[], options: ts.CompilerOptions): ts.Program => {
  return ts.createProgram(files, options)
}
