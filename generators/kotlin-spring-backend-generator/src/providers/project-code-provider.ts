import { ProjectCodeProvider as BaseProvider, EntityContext, Input, ProjectContext } from "@recognizebv/sc3000-generator";

export class ProjectCodeProvider extends BaseProvider {
    getInputs(): Input[] {
        return [

        ];
    }

    async generate(context: ProjectContext): Promise<void> {
        const packageName = this.generatePackage(context);
        const originalPackageName = 'nl.customer.projectname';

        this.renderer.setContext(context);
        this.renderer.setVariables({
            packageName,
        });

        await this.renderer.addDirectory('project',
            (fileName: string) => fileName
                 .replace(originalPackageName.replace(/\./g, '/'), packageName.replace(/\./g, '/'))
        );
    }

    private generatePackage(context: ProjectContext): string {
        return `nl.${context.project.client}.${context.project.name}`;
    }
}