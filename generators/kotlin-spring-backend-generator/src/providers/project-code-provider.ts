import { ProjectCodeProvider as BaseProvider, EntityContext, Input, ProjectContext } from "@recognizebv/sc3000-generator";

export class ProjectCodeProvider extends BaseProvider {
    async generate(context: ProjectContext): Promise<void> {
        const directory = context.findInputValue<string>('directory')
        const packageName = this.generatePackage(context);
        const originalPackageName = 'nl.customer.projectname';

        this.renderer.setContext(context);
        this.renderer.setVariables({
            packageName,
        });

        await this.renderer.addDirectory('project',
            (fileName: string) => directory + '/' + fileName
                 .replace(originalPackageName.replace(/\./g, '/'), packageName.replace(/\./g, '/'))
        );
    }

    private generatePackage(context: ProjectContext): string {
        return `nl.${context.project.client}.${context.project.name}`;
    }
}
