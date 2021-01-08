import * as ts from 'typescript';
import { createCssSelectorForTs } from './css-selector-for-ts';

function createSourceFile(content: string, name = '') {
  return ts.createSourceFile(name, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}
function mockSourceFile() {
  return createSourceFile('');
}
describe('用于ts node的css选择器', () => {
  it('初始化', () => {
    let sourceFile = mockSourceFile();
    let cssSelector = createCssSelectorForTs(sourceFile);
    expect(cssSelector).toBeTruthy();
  });
  it('默认', () => {
    let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
    let result = cssSelctor.query('VariableDeclaration Identifier');
    expect(result.length).toBe(1);
  });
  it('~', () => {
    let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
    let result = cssSelctor.query('Identifier~NumericLiteral');

    expect(result.length).toBe(1);
    expect(result[0].kind === ts.SyntaxKind.NumericLiteral).toBeTrue();
  });
  it('>', () => {
    let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
    let result = cssSelctor.query('VariableDeclaration>Identifier');

    expect(result.length).toBe(1);
    expect(result[0].kind === ts.SyntaxKind.Identifier).toBeTrue();
  });
  it(',', () => {
    let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
    let result = cssSelctor.query('VariableDeclaration,Identifier');

    expect(result.length).toBe(2);
  });
  it('attribute equal', () => {
    let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
    let result = cssSelctor.query('VariableDeclaration[name=a]');

    expect(result.length).toBe(1);
    expect(result[0].kind).toBe(ts.SyntaxKind.VariableDeclaration);
  });
  it('attribute exist', () => {
    let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
    let result = cssSelctor.query('VariableDeclaration[name]');

    expect(result.length).toBe(1);
    expect(result[0].kind).toBe(ts.SyntaxKind.VariableDeclaration);
  });
  it('attribute any', () => {
    let cssSelctor = createCssSelectorForTs(createSourceFile('let a=689'));
    let result = cssSelctor.query('VariableDeclaration[initializer*=8]');

    expect(result.length).toBe(1);
    expect(result[0].kind).toBe(ts.SyntaxKind.VariableDeclaration);
  });

});
