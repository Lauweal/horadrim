import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

function isFunction(value: any): value is Function {
  return typeof value === "function";
}

export function viteImportPlugin(options: {
  libraryName: string;
  libraryDirectory?: string;
  style?: boolean | "css" | "less" | ((name: string) => string);
}) {
  const { libraryName, libraryDirectory = "lib", style = false } = options;
 
  return {
    name: "vite-import-plugin",
    transform(code: string, id: string) {
      if (!id.endsWith(".js") && !id.endsWith(".ts") && !id.endsWith(".tsx")) {
        return null;
      }

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });

      let transformed = false;

      traverse(ast, {
        ImportDeclaration(path: any) {
          const source = path.node.source.value;
          if (source === libraryName) {
            const specifiers = path.node.specifiers;
            const newImports: t.ImportDeclaration[] = [];

            specifiers.forEach((specifier: any) => {
              if (t.isImportSpecifier(specifier)) {
                const importedName = t.isIdentifier(specifier.imported)
                  ? specifier.imported.name
                  : specifier.imported.value;
                const localName = specifier.local.name;

                // 构造按需加载的路径
                const importPath = `${libraryName}/${libraryDirectory}/${importedName}`;
                newImports.push(
                  t.importDeclaration(
                    [t.importDefaultSpecifier(t.identifier(localName))],
                    t.stringLiteral(importPath)
                  )
                );
                // 如果需要引入样式
                if (style) {
                  if (isFunction(style)) {
                    const stylePath = style(importedName);
                    if (stylePath) {
                      newImports.push(
                        t.importDeclaration([], t.stringLiteral(stylePath))
                      );
                    }
                  } else {
                    const stylePath =
                      typeof style === "string"
                        ? `${libraryName}/${libraryDirectory}/${importedName}/style/index.${style}`
                        : `${libraryName}/${libraryDirectory}/${importedName}/style`;
                    newImports.push(
                      t.importDeclaration([], t.stringLiteral(stylePath))
                    );
                  }
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
        const output = generate(ast, {}, code);
        return {
          code: output.code,
          map: null,
        };
      }

      return null;
    },
  };
}
