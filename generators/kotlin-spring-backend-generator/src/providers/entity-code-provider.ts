import { EntityCodeProvider as BaseProvider, EntityContext, Input, StringModificationHelper, RenderHookType } from "@recognizebv/sc3000-generator";

export class EntityCodeProvider extends BaseProvider {
    async generate(context: EntityContext): Promise<void> {
        const directory = context.findInputValue<string>('directory')
        const packageName = this.generatePackage(context);
        const entity = context.entity
        const pascalCase = StringModificationHelper.toPascalCase(entity.name);

        this.renderer.setContext(context);
        this.renderer.setVariables({
            packageName,
        });

        await this.renderer.addFile('entity/__DTO.kt.ejs', `${directory}/src/main/kotlin/${packageName.replace(/\./g, '/')}/model/${pascalCase}DTO.kt`);
        await this.renderer.addFile('entity/__Entity.kt.ejs', `${directory}/src/main/kotlin/${packageName.replace(/\./g, '/')}/entity/${pascalCase}.kt`);
        await this.renderer.addFile('entity/__Repository.kt.ejs', `${directory}/src/main/kotlin/${packageName.replace(/\./g, '/')}/repository/${pascalCase}Repository.kt`);
        await this.renderer.addFile('entity/__Controller.kt.ejs', `${directory}/src/main/kotlin/${packageName.replace(/\./g, '/')}/controller/${pascalCase}Controller.kt`);
        await this.renderer.addFile('entity/__ControllerTest.kt.ejs', `${directory}/src/test/kotlin/${packageName.replace(/\./g, '/')}/controller/${pascalCase}ControllerTest.kt`);
        await this.renderer.addFile('entity/__test_fixture.sql.ejs', `${directory}/src/test/resources/fixtures/${StringModificationHelper.toKebabCase(entity.name)}.sql`);

        // Create migrations
        await this.renderer.addShellCommandHook(RenderHookType.afterRender, `cd ${directory} && docker compose up -d && sleep 5`);
        await this.renderer.addShellCommandHook(RenderHookType.afterRender, `cd ${directory} && ./gradlew diffChangeLog`);
        await this.renderer.addShellCommandHook(RenderHookType.afterRender, `cd ${directory} && mv src/main/resources/db/changelog/changes.yaml src/main/resources/db/changelog/changes/001-initial.yaml`);
    }

    private generatePackage(context: EntityContext): string {
        return `nl.${context.project.client}.${context.project.name}`;
    }
}
