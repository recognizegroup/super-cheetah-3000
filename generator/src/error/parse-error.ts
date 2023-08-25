export class ParseError extends Error {
  public path: string;
  public line: number;
  public column: number;
  public cause: string;
  public template?: string;

  constructor({path, line, column, cause, template}: { path: string, line: number, column: number, cause: string, template?: string }) {
    super(template ?
      `Parse error in ${path} at line ${line}, column ${column} in template ${template}: ${cause}` :
      `Parse error in ${path} at line ${line}, column ${column}: ${cause}`)

    this.path = path
    this.line = line
    this.column = column
    this.cause = cause
    this.template = template
  }
}
