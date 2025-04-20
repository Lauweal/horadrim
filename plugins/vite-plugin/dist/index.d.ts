export declare function replaceLessImportPlugin(options: {
    theme: string;
}): {
    name: string;
    enforce: string;
    transform(code: string, id: string): {
        code: string;
        map: null;
    } | null;
};
