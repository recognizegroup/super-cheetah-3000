import { TemplateEngine } from "./template-engine";
import * as ejs from "ejs";
import { StringModifificationHelper } from "../helpers/string-modification-helper";

export class EjsTemplateEngine implements TemplateEngine {
    constructor(private root: string) { }

    async render(template: string, context: any): Promise<string> {
        return ejs.render(
            template,
            {
                ...context,
                ...this.constructHelperFunctions(),
            },
            { root: this.root }
        );
    }

    supports(path: string) {
        return path.endsWith('.ejs');
    }

    transformFilename(path: string) {
        return path.replace(/\.ejs$/, '');
    }

    private constructHelperFunctions() {
        return {
            toPascalCase: StringModifificationHelper.toPascalCase,
            toCamelCase: StringModifificationHelper.toCamelCase,
            toKebabCase: StringModifificationHelper.toKebabCase,
            toSnakeCase: StringModifificationHelper.toSnakeCase,
            toTitleCase: StringModifificationHelper.toTitleCase,
            toSentenceCase: StringModifificationHelper.toSentenceCase,
            toUrlCase: StringModifificationHelper.toUrlCase,
            toPlural: StringModifificationHelper.toPlural,
        }
    }
}