import { EntityCodeProvider as BaseProvider, EntityContext, Input, StringModificationHelper, RenderHookType } from "@recognizebv/sc3000-generator";

export class EntityCodeProvider extends BaseProvider {
    async generate(context: EntityContext): Promise<void> {
        const directory = context.findInputValue<string>('directory')
        const entity = context.entity
        const kebabCase = StringModificationHelper.toKebabCase(entity.name);

        this.renderer.setContext(context);

        await this.renderer.addFile('entity/other/__service.ts.njk', `${directory}/src/app/services/${kebabCase}.service.ts`);
        await this.renderer.addFile('entity/other/__model.ts.njk', `${directory}/src/app/models/${kebabCase}.ts`);
        await this.renderer.addFile('entity/other/__resolver.ts.njk', `${directory}/src/app/resolvers/${kebabCase}.resolver.ts`);

        const list = StringModificationHelper.toPlural(kebabCase);

        if (context.entity.operations?.create.enabled || context.entity.operations?.read.enabled) {
            await this.renderer.addFile('entity/components/list/component.html.njk', `${directory}/src/app/pages/${list}/${list}.component.html`);
            await this.renderer.addFile('entity/components/list/component.scss.njk', `${directory}/src/app/pages/${list}/${list}.component.scss`);
            await this.renderer.addFile('entity/components/list/component.ts.njk', `${directory}/src/app/pages/${list}/${list}.component.ts`);
            await this.renderer.addFile(`entity/components/list/component.spec.ts.njk`, `${directory}/src/app/pages/${list}/${list}.component.spec.ts`);
        }

        if (context.entity.operations?.create.enabled || context.entity.operations?.update.enabled) {
            await this.renderer.addFile('entity/components/edit/component.html.njk', `${directory}/src/app/pages/${kebabCase}-edit/${kebabCase}-edit.component.html`);
            await this.renderer.addFile('entity/components/edit/component.scss.njk', `${directory}/src/app/pages/${kebabCase}-edit/${kebabCase}-edit.component.scss`);
            await this.renderer.addFile('entity/components/edit/component.ts.njk', `${directory}/src/app/pages/${kebabCase}-edit/${kebabCase}-edit.component.ts`);
            await this.renderer.addFile(`entity/components/edit/component.spec.ts.njk`, `${directory}/src/app/pages/${kebabCase}-edit/${kebabCase}-edit.component.spec.ts`);
        }

        await this.renderer.addFile('entity/components/item-select/component.html.njk', `${directory}/src/app/components/${kebabCase}-item-select/${kebabCase}-item-select.component.html`);
        await this.renderer.addFile('entity/components/item-select/component.scss.njk', `${directory}/src/app/components/${kebabCase}-item-select/${kebabCase}-item-select.component.scss`);
        await this.renderer.addFile('entity/components/item-select/component.ts.njk', `${directory}/src/app/components/${kebabCase}-item-select/${kebabCase}-item-select.component.ts`);
        await this.renderer.addFile(`entity/components/item-select/component.spec.ts.njk`, `${directory}/src/app/components/${kebabCase}-item-select/${kebabCase}-item-select.component.spec.ts`);
    }
}
