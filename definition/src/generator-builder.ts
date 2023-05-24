export class GeneratorBuilder {
  public inputs: Record<string, unknown> = {};

  constructor(public packageLocation: string, public version: string) {}

  public withInput(name: string, value: unknown): GeneratorBuilder {
    this.inputs[name] = value
    return this
  }
}
