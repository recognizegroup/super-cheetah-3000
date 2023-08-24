export class ParseError extends Error {
  constructor(public path: string, public line: number, public column: number, public cause: string, private template?: string) {
    super(template ?
      `Parse error in ${path} at line ${line}, column ${column} in template ${template}: ${cause}` :
      `Parse error in ${path} at line ${line}, column ${column}: ${cause}`)

    this.line = line
    this.column = column
  }
}
