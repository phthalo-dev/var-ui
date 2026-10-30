/**
 * Guard for the public prop vocabulary (PR 2, rule 9): no exported component may expose
 * react-aria (RAC) leftovers such as `isDisabled`, `onPress`, `selectedKey` or
 * `onSelectionChange`. Uses the TypeScript compiler API over `src/index.ts`, so it also
 * catches names that leak through un-written-out types (`Omit<AriaXProps, ...>`).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vite-plus/test';

const root = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(root, '..');

const FORBIDDEN_PATTERN = /^(is[A-Z]|defaultIs[A-Z])/;
const FORBIDDEN_NAMES = new Set([
  'onPress',
  'onPressStart',
  'onPressEnd',
  'onPressChange',
  'onPressUp',
  'selectedKey',
  'selectedKeys',
  'defaultSelectedKey',
  'defaultSelectedKeys',
  'onSelectionChange',
]);

/**
 * Deliberate exceptions, keyed `Component.prop`. Each needs a reason; keep this list tiny.
 */
const ALLOWLIST: Record<string, string> = {
  // (none yet)
};

function loadProgram(): ts.Program {
  const configPath = path.join(packageDir, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, (file) => ts.sys.readFile(file));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, packageDir);
  return ts.createProgram({
    rootNames: [path.join(root, 'index.ts')],
    options: { ...parsed.options, noEmit: true, skipLibCheck: true },
  });
}

function propNamesOf(checker: ts.TypeChecker, type: ts.Type, seen = new Set<ts.Type>()): string[] {
  if (seen.has(type)) return [];
  seen.add(type);
  if (type.isUnion()) return type.types.flatMap((t) => propNamesOf(checker, t, seen));
  return checker.getPropertiesOfType(type).map((p) => p.getName());
}

function collectViolations(): { checked: number; violations: string[] } {
  const program = loadProgram();
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(path.join(root, 'index.ts'));
  if (!entry) throw new Error('src/index.ts not found in program');
  const moduleSymbol = checker.getSymbolAtLocation(entry);
  if (!moduleSymbol) throw new Error('src/index.ts has no module symbol');

  const violations: string[] = [];
  let checked = 0;
  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const name = exported.getName();
    // Components are PascalCase; hooks (`useX`), helpers and constants are not.
    if (!/^[A-Z]/.test(name)) continue;
    const resolved =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if (!(resolved.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) continue;
    const decl = resolved.valueDeclaration ?? resolved.declarations?.[0];
    if (!decl) continue;
    const type = checker.getTypeOfSymbolAtLocation(resolved, decl);
    // The component itself plus compound parts (`Dialog.Popup`, `Tabs.Tab`, ...), which are
    // function-valued properties of the exported value.
    const targets: Array<[string, ts.Type]> = [[name, type]];
    for (const member of checker.getPropertiesOfType(type)) {
      if (!/^[A-Z]/.test(member.getName())) continue;
      const memberType = checker.getTypeOfSymbolAtLocation(member, decl);
      if (memberType.getCallSignatures().length > 0) {
        targets.push([`${name}.${member.getName()}`, memberType]);
      }
    }
    for (const [targetName, targetType] of targets) {
      for (const signature of targetType.getCallSignatures()) {
        const param = signature.getParameters()[0];
        if (!param) continue;
        const propsType = checker.getTypeOfSymbolAtLocation(param, decl);
        checked++;
        for (const prop of new Set(propNamesOf(checker, propsType))) {
          if (!FORBIDDEN_PATTERN.test(prop) && !FORBIDDEN_NAMES.has(prop)) continue;
          if (`${targetName}.${prop}` in ALLOWLIST) continue;
          violations.push(`${targetName}.${prop}`);
        }
      }
    }
  }
  return { checked, violations: [...new Set(violations)].sort() };
}

describe('public component props', () => {
  it('expose no react-aria vocabulary (is*, onPress*, selectedKey(s), onSelectionChange)', () => {
    const { checked, violations } = collectViolations();
    // Sanity: make sure the walk actually found the component surface.
    expect(checked).toBeGreaterThan(50);
    expect(violations).toEqual([]);
  }, 60_000);
});
