import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { componentRegistry } from '../data/components.ts';
import { canonicalizePropType } from './prop-type-format.ts';

export type PropDoc = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
  source: 'var-ui' | 'react-aria' | 'dom';
};

export type ComponentPropsDoc = {
  typeName: string;
  props: PropDoc[];
};

const REACT_SRC = path.resolve(import.meta.dirname, '../../../packages/react/src');

function getMemberName(name: ts.PropertyName): string {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return name.getText();
}

function getJsDocDescription(symbol: ts.Symbol, checker: ts.TypeChecker): string | undefined {
  const comments = symbol.getDocumentationComment(checker);
  if (comments.length === 0) {
    return undefined;
  }

  return ts.displayPartsToString(comments).trim() || undefined;
}

function getJsDocTag(symbol: ts.Symbol, tagName: string): string | undefined {
  for (const tag of symbol.getJsDocTags()) {
    if (tag.name !== tagName) {
      continue;
    }

    if (tag.text) {
      return tag.text
        .map((part) => part.text)
        .join('')
        .trim();
    }
  }

  return undefined;
}

function isPropertyRequired(prop: ts.Symbol, propType: ts.Type, _checker: ts.TypeChecker): boolean {
  if (prop.flags & ts.SymbolFlags.Optional) {
    return false;
  }

  return !propType.isUnion() || !propType.types.some((type) => type.flags & ts.TypeFlags.Undefined);
}

function isReactAriaSourceFile(sourceFile: string): boolean {
  return (
    sourceFile.includes('react-aria-components') ||
    sourceFile.includes('/react-aria/') ||
    sourceFile.includes('@react-types/')
  );
}

function getPropSource(
  propName: string,
  declaration: ts.Declaration,
  checker: ts.TypeChecker,
  declaredNames: Set<string>,
): PropDoc['source'] {
  if (isVarUiDeclaration(declaration, checker) || declaredNames.has(propName)) {
    return 'var-ui';
  }

  const sourceFile = declaration.getSourceFile().fileName;

  if (isReactAriaSourceFile(sourceFile)) {
    return 'react-aria';
  }

  return 'dom';
}

function isVarUiDeclaration(
  declaration: ts.Declaration | undefined,
  checker: ts.TypeChecker,
): boolean {
  if (!declaration) {
    return false;
  }

  const sourceFile = declaration.getSourceFile().fileName;

  if (!sourceFile.startsWith(REACT_SRC)) {
    return false;
  }

  if (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) {
    return true;
  }

  if (ts.isParameter(declaration)) {
    return true;
  }

  const symbol = checker.getSymbolAtLocation(declaration);

  if (!symbol) {
    return false;
  }

  return (
    symbol.declarations?.some((decl) => decl.getSourceFile().fileName.startsWith(REACT_SRC)) ??
    false
  );
}

function collectDeclaredNames(typeNode: ts.TypeNode, names: Set<string>): void {
  if (ts.isTypeLiteralNode(typeNode)) {
    for (const member of typeNode.members) {
      if (ts.isPropertySignature(member) && member.name) {
        names.add(getMemberName(member.name));
      }
    }

    return;
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    for (const intersectionMember of typeNode.types) {
      collectDeclaredNames(intersectionMember, names);
    }
  }
}

function findTypeAlias(program: ts.Program, typeName: string): ts.TypeAliasDeclaration | undefined {
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) {
      continue;
    }

    let found: ts.TypeAliasDeclaration | undefined;

    ts.forEachChild(sourceFile, function visit(node) {
      if (found) {
        return;
      }

      if (ts.isTypeAliasDeclaration(node) && node.name.text === typeName) {
        found = node;
        return;
      }

      ts.forEachChild(node, visit);
    });

    if (found) {
      return found;
    }
  }

  return undefined;
}

function extractPropsForType(program: ts.Program, typeName: string): ComponentPropsDoc | undefined {
  const checker = program.getTypeChecker();
  const alias = findTypeAlias(program, typeName);

  if (!alias) {
    return undefined;
  }

  const declaredNames = new Set<string>();
  collectDeclaredNames(alias.type, declaredNames);

  const propsType = checker.getTypeAtLocation(alias);
  const props: PropDoc[] = [];

  for (const prop of propsType.getProperties()) {
    if (prop.name.startsWith('__')) {
      continue;
    }

    const declarations = prop.getDeclarations();

    if (!declarations || declarations.length === 0) {
      continue;
    }

    const declaration = declarations[0];
    const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
    const source = getPropSource(prop.name, declaration, checker, declaredNames);

    props.push({
      name: prop.name,
      // `NoTruncation` keeps the full member list so canonicalisation can sort it; the
      // checker otherwise renders long unions as `… | ... 8 more ... | …`, which would
      // both hide members and sort unpredictably.
      type: canonicalizePropType(
        checker.typeToString(propType, undefined, ts.TypeFormatFlags.NoTruncation),
      ),
      required: isPropertyRequired(prop, propType, checker),
      default: getJsDocTag(prop, 'default'),
      description: getJsDocDescription(prop, checker),
      source,
    });
  }

  props.sort((left, right) => {
    const sourceOrder = { 'var-ui': 0, 'react-aria': 1, dom: 2 } as const;

    if (left.source !== right.source) {
      return sourceOrder[left.source] - sourceOrder[right.source];
    }

    if (left.required !== right.required) {
      return left.required ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });

  return {
    typeName,
    props,
  };
}

function createReactProgram(): ts.Program {
  const configPath = ts.findConfigFile(
    REACT_SRC,
    (file) => ts.sys.fileExists(file),
    'tsconfig.json',
  );

  if (!configPath) {
    throw new Error(`Could not find tsconfig.json for ${REACT_SRC}`);
  }

  const configFile = ts.readConfigFile(configPath, (file) => ts.sys.readFile(file));
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));

  return ts.createProgram({
    rootNames: parsed.fileNames,
    options: {
      ...parsed.options,
      noEmit: true,
    },
  });
}

export function extractAllComponentProps(): Record<string, ComponentPropsDoc> {
  const program = createReactProgram();
  const output: Record<string, ComponentPropsDoc> = {};

  for (const entry of componentRegistry) {
    const typeName = `${entry.name}Props`;
    const doc = extractPropsForType(program, typeName);

    if (!doc) {
      console.warn(`[extract-props] Missing props type: ${typeName} (${entry.slug})`);
      continue;
    }

    output[entry.slug] = doc;
  }

  return output;
}

export function writeComponentProps(outputDir: string): void {
  fs.mkdirSync(outputDir, { recursive: true });

  const docs = extractAllComponentProps();

  for (const [slug, doc] of Object.entries(docs)) {
    writeJsonAtomic(path.join(outputDir, `${slug}.json`), doc);
  }
}

function writeJsonAtomic(filePath: string, data: unknown): void {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`);
  fs.renameSync(tempPath, filePath);
}
