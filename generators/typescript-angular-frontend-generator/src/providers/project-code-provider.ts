import {ProjectCodeProvider as BaseProvider, ProjectContext, RenderHookType} from "@recognizebv/sc3000-generator";

export class ProjectCodeProvider extends BaseProvider {
    async generate(context: ProjectContext): Promise<void> {
        const directory = context.findInputValue<string>('directory')

        this.renderer.setContext(context);
        this.renderer.setVariables({});

        await this.renderer.addDirectory('project',
            (fileName: string) => directory + '/' + fileName
        );

        this.renderer.addShellCommandHook(RenderHookType.afterRender, `cd ${directory} && yarn`);
    }
}
