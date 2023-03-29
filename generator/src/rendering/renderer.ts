import { Filesystem } from "../io/filesystem";
import { TemplateMetadata } from "../models/template-metadata";
import matter from 'gray-matter';
import { EjsTemplateEngine } from "../templating/ejs-template-engine";
import { Generator } from "../models/generator";
import { LocalFilesystem } from "../io/local-filesystem";
import { TemplateEngine } from "../templating/template-engine";
import { RenderHookType } from "../enums/render-hook-type";
import { Context } from "../models/context";
import util from 'util';
const exec = util.promisify(require('child_process').exec);

/**
 * The Renderer class is responsible for rendering one or more templates.
 * Templates can have a context, which is a map of key-value pairs.
 * Furthermore, templates can have dependencies on other templates.
 * These dependencies are defined using frontmatter. Before rendering, 
 * all dependencies are resolved and a dependency graph is created.
 * 
 * @class Renderer
 */
export class Renderer {
    private variables: { [key: string]: any } = {};
    private context: Context | null = null;
    private files: TemplateMetadata[] = [];
    private hooks: Partial<Record<RenderHookType, ((context: Context) => Promise<void>)[]>> = {};

    constructor (private readonly generator: Generator) { }

    async addDirectory(directory: string, transformFileName: (fileName: string) => string = (fileName) => fileName) {
        const filesystem = this.getGeneratorTemplateFilesystem();
        const children = await filesystem.list(directory);

        for (const child of children) {
            await this.addFile(`${directory}/${child}`, transformFileName(
                child.replace(new RegExp(`^${directory}`), ''),
            ));
        }
    }

    async addFile(file: string, output: string) {
        const metadata = await this.processMetadata(file, output);
        this.files.push(metadata);
    }

    async render(): Promise<void> {
        await this.executeHook(RenderHookType.beforeRender);

        const tree = this.createDependencyTree();
        const filesystem = this.context?.filesystem;

        const outputs: { [key: string]: { [key: string]: any }} = {};

        for (const group of tree) {
            for (const file of group) {
                const engine = this.getTemplateEngine(file.path);

                if (!engine) {
                    await filesystem?.write(
                        file.outputPath, 
                        file.content,
                        file.permissions,
                    );

                    continue;
                }

                const constants = {...file.constants } || {};

                // First, render all constants
                for (const [key, value] of Object.entries(constants)) {
                    constants[key] = await engine.render(value, this.buildVariables());
                }

                const dependencies = Object.fromEntries(
                    file.dependencies.map((dependency) => {
                        return [dependency, outputs[dependency]];
                    }),
                )

                const variables = this.buildVariables({ constants, dependencies });

                const content = await engine.render(file.content.toString(), variables);
                await filesystem?.write(
                    engine.transformFilename(file.outputPath), 
                    Buffer.from(content),
                    file.permissions,
                );

                if (file.id) outputs[file.id] = constants;
            }
        }

        await this.executeHook(RenderHookType.afterRender);
    }

    async processMetadata(file: string, output: string): Promise<TemplateMetadata> {
        // If the file is not a template, just return an empty metadata object
        const engine = this.getTemplateEngine(file);
        const filesystem = this.getGeneratorTemplateFilesystem();

        const content = await filesystem.read(file);
        const permissions = await filesystem.fetchPermissions(file);

        if (!engine) {
            return {
                id: null,
                path: file,
                permissions,
                outputPath: output,
                content,
                constants: {},
                dependencies: [],
            } 
        }

        const asString = content.toString();
        const { data, content: body } = matter(asString);

        const constants = data.constants ?? {};
        const dependencies = data.dependencies ?? [];
        const id = data.id ?? null;

        return {
            id,
            path: file,
            permissions,
            outputPath: output,
            content: Buffer.from(body),
            constants,
            dependencies,
        }
    }

    createDependencyTree(): TemplateMetadata[][] {
        const list = [...this.files];

        // Split the list into groups of files that do not depend on each other
        // The order of the groups is important, because the first group can be rendered first
        // The files are identified by ID, which can be empty. If empty, there is no file that depends on it
        // Each file has an array of dependencies, which are the IDs of the files it depends on
        const groups: TemplateMetadata[][] = [];

        while (list.length > 0) {
            const group: TemplateMetadata[] = [];
            const dependencies = list.flatMap(it => it.dependencies);

            for (let i = list.length - 1; i >= 0; i--) {
                const file = list[i];

                if (dependencies.includes(file.id ?? '')) {
                    continue;
                }

                group.push(file);
                list.splice(i, 1);
            }

            groups.push(group);
        }

        return groups.reverse();
    }

    setVariables(variables: { [key: string]: any }) {
        this.variables = variables;
    }

    setContext(context: Context) {
        this.context = context;
    }

    addHook(type: RenderHookType, hook: (context: Context) => Promise<void>) {
        if (!this.hooks[type]) {
            this.hooks[type] = [];
        }

        this.hooks[type]?.push(hook);
    }

    addShellCommandHook(type: RenderHookType, command: string) {
        this.addHook(type, async (context) => {
            const workingDirectory = context.filesystem?.getRoot() ?? process.cwd();
            
            const { stdout } = await exec(command, { cwd: workingDirectory });
            console.log(stdout);
        });
    }

    reset() {
        this.variables = {};
        this.context = null;
        this.files = [];
        this.hooks = {};
    }

    private buildVariables(additional: { [key: string]: any } = {}) {
        return {
            variables: { ...this.variables },
            ...this.context,
            ...additional,
        };
    }

    private getTemplateEngine(file: string): TemplateEngine | null {
        return [
            new EjsTemplateEngine(this.generator.metaData.templateRoot),
        ].find(it => it.supports(file)) ?? null;
    }

    protected getGeneratorTemplateFilesystem(): Filesystem {
        const metadata = this.generator.metaData;

        return new LocalFilesystem(metadata.templateRoot);
    }

    private async executeHook(type: RenderHookType) {
        const hooks = this.hooks[type] ?? [];

        for (const hook of hooks) {
            await hook(this.context!);
        }
    }
}