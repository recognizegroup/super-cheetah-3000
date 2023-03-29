export interface Filesystem {
    write(path: string, content: Buffer, permissions?: number): Promise<void>;
    read(path: string): Promise<Buffer>;
    exists(path: string): Promise<boolean>;
    delete(path: string): Promise<void>;
    copy(source: string, destination: string): Promise<void>;
    list(path: string): Promise<string[]>;
    createDirectory(path: string): Promise<void>;
    deleteDirectory(path: string): Promise<void>;
    isDirectory(path: string): Promise<boolean>;
    updatePermissions(path: string, permissions: number): Promise<void>;
    fetchPermissions(path: string): Promise<number>;
    getRoot(): string;
}