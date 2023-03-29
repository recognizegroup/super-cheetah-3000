import { EntityCodeProvider as BaseProvider, EntityContext, Input, StringModifificationHelper } from "@recognizebv/sc3000-generator";
import { RenderHookType } from "@recognizebv/sc3000-generator/dist/enums/render-hook-type";

export class EntityCodeProvider extends BaseProvider {
    getInputs(): Input[] {
        return [

        ];
    }

    async generate(context: EntityContext): Promise<void> {
        const packageName = this.generatePackage(context);
        const { entity } = context;
        const pascalCase = StringModifificationHelper.toPascalCase(entity.name);

        this.renderer.setContext(context);
        this.renderer.setVariables({
            packageName,
        });

        await this.renderer.addFile('entity/__DTO.kt.ejs', `src/main/kotlin/${packageName.replace(/\./g, '/')}/model/${pascalCase}DTO.kt`);
        await this.renderer.addFile('entity/__Entity.kt.ejs', `src/main/kotlin/${packageName.replace(/\./g, '/')}/entity/${pascalCase}.kt`);
        await this.renderer.addFile('entity/__Repository.kt.ejs', `src/main/kotlin/${packageName.replace(/\./g, '/')}/repository/${pascalCase}Repository.kt`);
        await this.renderer.addFile('entity/__Controller.kt.ejs', `src/main/kotlin/${packageName.replace(/\./g, '/')}/controller/${pascalCase}Controller.kt`);
        await this.renderer.addFile('entity/__ControllerTest.kt.ejs', `src/test/kotlin/${packageName.replace(/\./g, '/')}/controller/${pascalCase}ControllerTest.kt`);
        await this.renderer.addFile('entity/__test_fixture.sql.ejs', `src/test/resources/fixtures/${StringModifificationHelper.toKebabCase(entity.name)}.sql`);

        // Create migrations
        await this.renderer.addShellCommandHook(RenderHookType.afterRender, 'docker compose up -d && sleep 5');
        await this.renderer.addShellCommandHook(RenderHookType.afterRender, './gradlew diffChangeLog');
        await this.renderer.addShellCommandHook(RenderHookType.afterRender, 'mv src/main/resources/db/changelog/changes.yaml src/main/resources/db/changelog/changes/001-initial.yaml');
    }

    private generatePackage(context: EntityContext): string {
        return `nl.${context.project.client}.${context.project.name}`;
    }
}