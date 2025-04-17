"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viteImportPlugin = viteImportPlugin;
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const t = __importStar(require("@babel/types"));
function viteImportPlugin(options) {
    const { libraryName, libraryDirectory = 'lib', style = false } = options;
    return {
        name: 'vite-import-plugin',
        transform(code, id) {
            if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.tsx')) {
                return null;
            }
            const ast = (0, parser_1.parse)(code, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx'],
            });
            let transformed = false;
            (0, traverse_1.default)(ast, {
                ImportDeclaration(path) {
                    const source = path.node.source.value;
                    if (source === libraryName) {
                        const specifiers = path.node.specifiers;
                        const newImports = [];
                        specifiers.forEach((specifier) => {
                            if (t.isImportSpecifier(specifier)) {
                                const importedName = t.isIdentifier(specifier.imported)
                                    ? specifier.imported.name
                                    : specifier.imported.value;
                                const localName = specifier.local.name;
                                // 构造按需加载的路径
                                const importPath = `${libraryName}/${libraryDirectory}/${importedName}`;
                                newImports.push(t.importDeclaration([t.importDefaultSpecifier(t.identifier(localName))], t.stringLiteral(importPath)));
                                // 如果需要引入样式
                                if (style) {
                                    const stylePath = typeof style === 'string'
                                        ? `${libraryName}/${libraryDirectory}/${importedName}/style/index.${style}`
                                        : `${libraryName}/${libraryDirectory}/${importedName}/style`;
                                    newImports.push(t.importDeclaration([], t.stringLiteral(stylePath)));
                                }
                            }
                        });
                        // 替换原始导入
                        path.replaceWithMultiple(newImports);
                        transformed = true;
                    }
                },
            });
            if (transformed) {
                const output = (0, generator_1.default)(ast, {}, code);
                return {
                    code: output.code,
                    map: null,
                };
            }
            return null;
        },
    };
}
