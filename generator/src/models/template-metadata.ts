export interface TemplateMetadata {
    id: string | null;
    path: string;
    permissions: number;
    outputPath: string;
    content: Buffer;
    constants: { [key: string]: any };
    dependencies: string[];
    frontMatterLength?: number;
    variables: Record<string, unknown>;
}
