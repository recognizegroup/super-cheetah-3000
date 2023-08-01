import {Context} from '../context/context'
import {Generator} from '../models/generator'
import {Renderer} from '../rendering/renderer'
import {RenderHookType} from '../enums/render-hook-type'

export abstract class CodeProvider<C extends Context> {
    public renderer: Renderer;

    constructor(protected generator: Generator) {
      this.renderer = new Renderer(generator)
    }

    abstract generate(context: C): Promise<void>;

    public async render(context: C): Promise<void> {
      this.renderer.setContext(context)
      await this.generate(context)
      await this.renderer.render()
    }

    public reset() {
      this.renderer.reset()
    }

    public async postProcessing() {
      await this.renderer.executeHook(RenderHookType.finalize)
    }
}
