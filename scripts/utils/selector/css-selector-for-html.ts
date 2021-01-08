import { HtmlParser, ParseTreeResult, Element, Attribute, Text } from '@angular/compiler';
import { AttributeSelector, parse, Selector } from 'css-what';

export function createCssSelectorForHtml(htmlContent: string) {
  return new CssSelectorForHtml(htmlContent);
}
function findTag(name: string, node: Element): boolean {
  return name === node.name;
}
function findAttribute(selector: AttributeSelector, node: Element): boolean {
  // todo 取值
  let attribute: Attribute = node.attrs.find((item) => item.name === selector.name);
  if (attribute) {
    let str: string;
    try {
      str = attribute.value;
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
          return !!attribute;
        default:
          return str === selector.value;
      }
    } catch (error) {}
  }
  return false;
}
/** 查包括自身的节点 */
function findAllWithEachNode(node: NodeContext, fn: (node: Element) => boolean, multiLevel?: boolean): NodeContext[] {
  let list: NodeContext[] = [node];
  let result = [];
  while (list.length) {
    let node = list.pop();
    if (fn(node.node)) {
      result.push(node);
    }
    if (multiLevel) {
      list.push(...getChildren(node.node).map((childNode, i) => new NodeContext(childNode, node, i)));
    }
  }
  return result;
}

function getChildren(node: Element): Element[] {
  return node.children.filter((node) => node instanceof Element) as any[];
}
export class CssSelectorForHtml {
  private parseTreeResult: ParseTreeResult;
  private currentNodeList: NodeContext[];
  private multi = true;

  constructor(private htmlString: string) {
    let parser = new HtmlParser();
    this.parseTreeResult = parser.parse(htmlString, '');
    if (this.parseTreeResult.errors && this.parseTreeResult.errors.length) {
      throw this.parseTreeResult.errors;
    }
  }
  query(element: Element, selector: string): Element[];
  query(selector: string): Element[];
  query(arg1: any, arg2?) {
    let selector: string;
    let queryElement: Element;
    if (typeof arg1 === 'string') {
      selector = arg1;
      let rootNodes = this.parseTreeResult.rootNodes;
      queryElement = new Element('__root', [], rootNodes, undefined, undefined, undefined, undefined);
    } else {
      selector = arg2;
      queryElement = arg1;
    }
    let selectedList: Element[] = [];

    let result = parse(selector, { lowerCaseAttributeNames: false, lowerCaseTags: false });
    /** 使用一个虚拟节点支持搜索 */
    for (let i = 0; i < result.length; i++) {
      this.currentNodeList = [new NodeContext(queryElement, undefined, undefined)];
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
  /**
   * 和之前的ts不同,html的selector不查自身,是查子级的
   * @param selector
   */
  private parse(selector: Selector): boolean {
    let list: NodeContext[] = [];
    switch (selector.type) {
      // 匹配标签
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
          ...this.currentNodeList.map((node) => getChildren(node.node).map((child, i) => new NodeContext(child, node, i)))
        );
        break;
      //+
      case 'adjacent':
        this.currentNodeList = [].concat(
          this.currentNodeList
            .map(
              (nodeContext) =>
                new NodeContext(getChildren(nodeContext.parent.node)[nodeContext.index + 1], nodeContext.parent, nodeContext.index + 1)
            )
            .filter((node) => node.node)
        );

        this.multi = false;
        break;
      // >
      case 'child':
        this.currentNodeList = [].concat(
          ...this.currentNodeList.map((node) => getChildren(node.node).map((child, i) => new NodeContext(child, node, i)))
        );
        this.multi = false;
        break;
      // ~
      case 'sibling':
        this.currentNodeList = [].concat(
          ...this.currentNodeList.map((nodeContent) =>
            getChildren(nodeContent.parent.node)
              .filter((node, i) => i > nodeContent.index)
              .map((node, i) => new NodeContext(node, nodeContent.parent, i))
          )
        );

        this.multi = false;
        break;
      //[] .xxx
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
  constructor(public node: Element, public parent: NodeContext, public index: number) {}
}
