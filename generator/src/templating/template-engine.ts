export interface TemplateEngine {
    render(template: string, context: any): Promise<string>;
    supports(path: string): boolean;
    transformFilename(path: string): string;
}