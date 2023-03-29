import { Context } from "../models/context";
import { Input } from "../models/input";
import { Generator } from "../models/generator";
import { LocalFilesystem } from "../io/local-filesystem";
import { Filesystem } from "../io/filesystem";
import { Renderer } from "../rendering/renderer";

export abstract class CodeProvider<C extends Context> {
    protected renderer: Renderer;

    constructor(protected generator: Generator) {
        this.renderer = new Renderer(generator);
    }

    abstract getInputs(): Input[];
    abstract generate(context: C): Promise<void>;

    public async render(context: C): Promise<void> {
        this.renderer.setContext(context);
        await this.generate(context);
        await this.renderer.render();
        await this.renderer.reset();
    }
    
}
