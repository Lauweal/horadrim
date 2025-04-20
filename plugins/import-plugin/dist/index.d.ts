export declare function viteImportPlugin(options: {
    libraryName: string;
    libraryDirectory?: string;
    style?: boolean | "css" | "less" | ((name: string) => string);
}): {
    name: string;
    transform(code: string, id: string): {
        code: string;
        map: null;
    } | null;
};
