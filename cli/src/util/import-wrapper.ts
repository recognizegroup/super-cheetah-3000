export const importScript = (path: string): Promise<any> => {
  return import(path)
}
