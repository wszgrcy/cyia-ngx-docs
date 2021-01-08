import { SourceFile } from 'typescript';
import * as ts from 'typescript';
import { AttributeSelector, parse, Selector } from 'css-what';

export function createCssSelectorForTs(sourceFile: SourceFile) {
  return new CssSelectorForTs(sourceFile);
}
function findTag(name: string, node: ts.Node): boolean {
  return ts.SyntaxKind[name] === node.kind;
}
function findAttribute(selector: AttributeSelector, node: ts.Node): boolean {
  let attrValue: ts.Node = node[selector.name];
  if (attrValue && Number.isInteger(attrValue.kind)) {
    let str: string;
    try {
      str = attrValue.getText();
      switch (selector.action) {
        case 'equals':
          return str === selector.value;
        case 'any':
          return str.includes(selector.value);
        case 'start':
          return str.startsWith(selector.value);
        case 'end':
          return str.endsWith(selector.value);
        case 'element':
          return str.split(' ').includes(selector.value);
        case 'hyphen':
          return str.split(' ')[0].split('-')[0] === selector.value;
        case 'not':
          return str !== selector.value;
        case 'exists':
          return !!attrValue;
        default:
          return str === selector.value;
      }
    } catch (error) {}
  }
}
function findAllWithEachNode(node: NodeContext, fn: (node: ts.Node) => boolean, multiLevel?: boolean): NodeContext[] {
  let list: NodeContext[] = [node];
  let result = [];
  while (list.length) {
    let node = list.pop();
    if (fn(node.node)) {
      result.push(node);
    }
    if (multiLevel) {
      list.push(...node.node.getChildren().map((childNode, i) => new NodeContext(childNode, node, i)));
    }
  }
  return result;
}

class CssSelectorForTs {
  multi = true;
  currentNodeList: NodeContext[];
  constructor(private sourceFile: SourceFile) {}
  query(selector: string): ts.Node[] {
    let selectedList: ts.Node[] = [];
    let result = parse(selector, { lowerCaseAttributeNames: false, lowerCaseTags: false });
    for (let i = 0; i < result.length; i++) {
      this.currentNodeList = [new NodeContext(this.sourceFile, undefined, undefined)];
      const selectorList = result[i];
      for (let j = 0; j < selectorList.length; j++) {
        const selector = selectorList[j];
        if (!this.parse(selector)) {
          break;
        }
      }
      selectedList.push(...this.currentNodeList.map((node) => node.node));
    }
    return selectedList;
  }
  private parse(selector: Selector): boolean {
    let list: NodeContext[] = [];
    switch (selector.type) {
      case 'tag':
        this.currentNodeList.forEach((nodeContext: NodeContext) => {
          list = list.concat(findAllWithEachNode(nodeContext, (node) => findTag(selector.name, node), this.multi));
        });
        this.currentNodeList = list;
        this.multi = true;
        break;
      // 空格
      case 'descendant':
        this.currentNodeList = [].concat(
          ...this.currentNodeList.map((node) => node.node.getChildren().map((child, i) => new NodeContext(child, node, i)))
        );
        break;
      //+
      case 'adjacent':
        this.currentNodeList = [].concat(
          this.currentNodeList
            .map(
              (nodeContext) =>
                new NodeContext(nodeContext.parent.node.getChildren()[nodeContext.index + 1], nodeContext.parent, nodeContext.index + 1)
            )
            .filter((node) => node.node)
        );

        this.multi = false;
        break;
      // >
      case 'child':
        this.currentNodeList = [].concat(
          ...this.currentNodeList.map((node) => node.node.getChildren().map((child, i) => new NodeContext(child, node, i)))
        );
        this.multi = false;
        break;
      // ~
      case 'sibling':
        this.currentNodeList = [].concat(
          ...this.currentNodeList.map((nodeContent) =>
            nodeContent.parent.node
              .getChildren()
              .filter((node, i) => i > nodeContent.index)
              .map((node, i) => new NodeContext(node, nodeContent.parent, i))
          )
        );

        this.multi = false;
        break;
      case 'attribute':
        this.currentNodeList.forEach((nodeContext: NodeContext) => {
          list = list.concat(findAllWithEachNode(nodeContext, (node) => findAttribute(selector as AttributeSelector, node), this.multi));
        });
        this.currentNodeList = list;
        this.multi = true;
        break;
      default:
        break;
    }

    return !!this.currentNodeList.length;
  }
}

class NodeContext {
  constructor(public node: ts.Node, public parent: NodeContext, public index: number) {}
}
