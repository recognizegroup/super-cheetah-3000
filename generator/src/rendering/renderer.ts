import {Filesystem} from '../io/filesystem'
import {TemplateMetadata} from '../models/template-metadata'
import matter from 'gray-matter'
import {Generator} from '../models/generator'
import {LocalFilesystem} from '../io/local-filesystem'
import {TemplateEngine} from '../templating/template-engine'
import {RenderHookType} from '../enums/render-hook-type'
import {Context} from '../context/context'
import {exec} from '../util/command-wrapper'
import toposort from 'toposort'
import {NunjucksTemplateEngine} from '../templating/nunjucks-template-engine'

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
    private hooks: Partial<Record<RenderHookType, ((_: Context) => Promise<void>)[]>> = {};
    private fileExistsConfirmation: (path: string) => Promise<boolean> = async () => true;

    constructor(private readonly generator: Generator) {}

    async addDirectory(directory: string,
      transformFileName: (fileName: string) => string = fileName => fileName,
      filter: (sourceFile: string) => boolean = (_: string) => true,
      variables: Record<string, unknown> = {},
    ): Promise<void> {
      const filesystem = this.getGeneratorTemplateFilesystem()
      const children = await filesystem.list(directory)

      for (const child of children) {
        const shouldAdd = filter(`${directory}/${child}`)

        if (shouldAdd) {
          await this.addFile(`${directory}/${child}`, transformFileName(
            child.replace(new RegExp(`^${directory}`), ''),
          ), variables)
        }
      }
    }

    setFileExistsConfirmation(fileExistsConfirmation: (path: string) => Promise<boolean>): void {
      this.fileExistsConfirmation = fileExistsConfirmation
    }

    async addFile(file: string, output: string, variables: Record<string, unknown> = {}): Promise<void> {
      const metadata = await this.processMetadata(file, output, variables)
      this.files.push(metadata)
    }

    async render(): Promise<void> {
      await this.executeHook(RenderHookType.beforeRender)

      const tree = this.createDependencyTree(this.files)
      const filesystem = this.context?.filesystem

      const outputs: { [key: string]: { [key: string]: any }} = {}

      for (const group of tree) {
        for (const file of group) {
          const engine = this.getTemplateEngine(file.path)

          if (this.context) {
            await engine?.setup(this.generator.metaData.name, this.context!.incrementalDataHandler)
          }

          if (!engine) {
            const fileExists = await filesystem?.exists(file.outputPath)

            if (!fileExists || await this.fileExistsConfirmation(file.outputPath)) {
              await filesystem?.write(
                file.outputPath,
                file.content,
                file.permissions,
              )
            }

            continue
          }

          const constants = {...file.constants} || {}

          // First, render all constants
          for (const [key, value] of Object.entries(constants)) {
            constants[key] = await engine.render(value, this.buildVariables())
          }

          const dependencies = Object.fromEntries(
            file.dependencies.map(dependency => {
              return [dependency, outputs[dependency]]
            }),
          )

          const variables = this.buildVariables({constants, dependencies}, file.variables)
          const output = engine.transformFilename(file.outputPath)

          const content = await engine.render(file.content.toString(), variables, output)
          const fileExists = await filesystem?.exists(output)

          if (!fileExists || await this.fileExistsConfirmation(output)) {
            await filesystem?.write(
              output,
              Buffer.from(content),
              file.permissions,
            )
          }

          if (file.id) outputs[file.id] = constants
        }
      }

      await this.executeHook(RenderHookType.afterRender)
    }

    async processMetadata(file: string, output: string, variables: Record<string, unknown>): Promise<TemplateMetadata> {
      // If the file is not a template, just return an empty metadata object
      const engine = this.getTemplateEngine(file)
      const filesystem = this.getGeneratorTemplateFilesystem()

      const content = await filesystem.read(file)
      const permissions = await filesystem.fetchPermissions(file)

      if (!engine) {
        return {
          id: null,
          path: file,
          permissions,
          outputPath: output,
          content,
          constants: {},
          dependencies: [],
          variables,
        }
      }

      const asString = content.toString()
      const {data, content: body} = matter(asString)

      const constants = data.constants ?? {}
      const dependencies = data.dependencies ?? []
      const id = data.id ?? null

      return {
        id,
        path: file,
        permissions,
        outputPath: output,
        content: Buffer.from(body),
        constants,
        dependencies,
        variables,
      }
    }

    createDependencyTree(files: TemplateMetadata[]): TemplateMetadata[][] {
      // We have a list of files, each with a list of dependencies.
      // Before a file is rendered, all of its dependencies must be rendered.
      // Therefore, we split the list into groups, where each group contains
      // files that have no dependencies on files in the same group or a later groups

      // First, apply a topological sort to the files
      const sortedIds = toposort.array(
        files.map(file => file.id ?? file.path),
        files.flatMap(file => file.dependencies.map(dependency => [file.id ?? file.path, dependency])),
      )
      const sorted = sortedIds.map(id => files.find(file => file.id === id || file.path === id))

      // Now, we can create the groups
      const groups: TemplateMetadata[][] = []
      let currentGroup: TemplateMetadata[] = []

      for (const file of sorted) {
        if (currentGroup.some(groupFile => groupFile.dependencies.includes(file.id!))) {
          groups.push(currentGroup)
          currentGroup = []
        }

        currentGroup.push(file)
      }

      if (currentGroup.length > 0) {
        groups.push(currentGroup)
      }

      return groups.reverse()
    }

    setVariables(variables: { [key: string]: any }): void {
      this.variables = variables
    }

    setContext(context: Context): void {
      this.context = context
    }

    getVariables(): { [key: string]: any } {
      return this.variables
    }

    getContext(): Context | null {
      return this.context
    }

    getFiles(): TemplateMetadata[] {
      return this.files
    }

    getHooks(): Partial<Record<RenderHookType, ((_: Context) => Promise<void>)[]>> {
      return this.hooks
    }

    addHook(type: RenderHookType, hook: (context: Context) => Promise<void>): void {
      if (!this.hooks[type]) {
        this.hooks[type] = []
      }

      this.hooks[type]?.push(hook)
    }

    addShellCommandHook(type: RenderHookType, command: string): void {
      this.addHook(type, async context => {
        const workingDirectory = context.filesystem?.getRoot() ?? process.cwd()

        await exec(command, {cwd: workingDirectory})
      })
    }

    reset(): void {
      this.variables = {}
      this.context = null
      this.files = []
      this.hooks = {}
    }

    buildVariables(additional: Record<string, unknown> = {}, fileSpecificVariables: Record<string, unknown> = {}): Record<string, any> {
      return {
        variables: {...this.variables, ...fileSpecificVariables},
        ...this.context?.buildVariables(),
        ...additional,
      }
    }

    getGeneratorTemplateFilesystem(): Filesystem {
      const metadata = this.generator.metaData

      return new LocalFilesystem(metadata.templateRoot)
    }

    async executeHook(type: RenderHookType): Promise<void> {
      const hooks = this.hooks[type] ?? []

      for (const hook of hooks) {
        await hook(this.context!)
      }
    }

    private getTemplateEngine(file: string): TemplateEngine | null {
      return [
        new NunjucksTemplateEngine(this.generator.metaData.templateRoot),
      ].find(it => it.supports(file)) ?? null
    }
}
