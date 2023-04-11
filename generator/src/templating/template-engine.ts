export interface TemplateEngine {
    render(template: string, context: { [key: string]: any }): Promise<string>;
    supports(path: string): boolean;
    transformFilename(path: string): string;
}
