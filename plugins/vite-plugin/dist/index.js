"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceLessImportPlugin = replaceLessImportPlugin;
function replaceLessImportPlugin(options) {
    const { theme } = options;
    return {
        name: 'vite-plugin-replace-less-import',
        enforce: 'pre', // 确保在其他插件之前运行
        transform(code, id) {
            // 仅处理 .less 文件
            if (!id.endsWith('.less')) {
                return null;
            }
            // 替换 @import 路径
            const transformedCode = code.replace(new RegExp(`@import\\s+['"]@horadrim/theme`, 'g'), `@import '${theme}`);
            return {
                code: transformedCode,
                map: null, // 不需要 source map
            };
        },
    };
}
