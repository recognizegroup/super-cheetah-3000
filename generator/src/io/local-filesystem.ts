import { Filesystem } from "./filesystem";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * Local filesystem implementation of the Filesystem interface, using nodejs fs/promises.
 */
export class LocalFilesystem implements Filesystem {
    constructor(private readonly root: string) { }

    read(path: string): Promise<Buffer> {
        return fs.readFile(
            this.resolve(path),
        )
    }

    async write(path: string, content: Buffer, permissions?: number): Promise<void> {
        const full = this.resolve(path);
        await this.ensureDirectoryExistsForFile(full);
        
        await fs.writeFile(
            full,
            content,
        );

        if (permissions) {
            await fs.chmod(full, permissions);
        }
    }

    exists(path: string): Promise<boolean> {
        return fs.access(this.resolve(path))
            .then(() => true)
            .catch(() => false);
    }

    delete(path: string): Promise<void> {
        return fs.unlink(this.resolve(path));
    }

    async copy(source: string, destination: string): Promise<void> {
        const fullDestination = this.resolve(destination);
        await this.ensureDirectoryExistsForFile(fullDestination);

        return await fs.copyFile(this.resolve(source), fullDestination);
    }

    async list(path: string): Promise<string[]> {
        return (await this.readDirectoryRecursively(path))
            .map(it => it.replace(new RegExp(`^${path}/`), ''));
    }

    async createDirectory(path: string): Promise<void> {
        return fs.mkdir(this.resolve(path));
    }

    deleteDirectory(path: string): Promise<void> {
        return fs.rmdir(this.resolve(path));
    }
    
    isDirectory(path: string): Promise<boolean> {
        return fs.stat(this.resolve(path))
            .then(stat => stat.isDirectory())
            .catch(() => false);
    }

    updatePermissions(path: string, permissions: number): Promise<void> {
        return fs.chmod(this.resolve(path), permissions);
    }

    fetchPermissions(path: string): Promise<number> {
        return fs.stat(this.resolve(path))
            .then(stat => stat.mode);
    }

    getRoot() {
        return this.root;
    }

    private resolve(path: string): string {
        return join(this.root, path);
    }

    private ensureDirectoryExistsForFile(full: string): Promise<string|undefined> {
        const pathWithoutFile = full.substring(0, full.lastIndexOf('/'));

        return this.ensureDirectoryExists(pathWithoutFile);
    }

    private ensureDirectoryExists(path: string): Promise<string|undefined> {
        return this.exists(path)
            .then(exists => {
                if (!exists) {
                    return fs.mkdir(path, { recursive: true });
                }
            });
    }

    private async readDirectoryRecursively(path: string): Promise<string[]> {
        const items = await fs.readdir(this.resolve(path));
        let files: string[] = [];

        for (const item of items) {
            if ((await fs.lstat(this.resolve(`${path}/${item}`))).isDirectory()) {
                files = [...files, ...(await this.readDirectoryRecursively(`${path}/${item}`))];
            } else {
                files.push(`${path}/${item}`);
            }
        }

        return files;
    }
}