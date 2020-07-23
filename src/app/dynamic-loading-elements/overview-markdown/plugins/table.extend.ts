/**
 * 基于markdown-it table解析
 * 修改相关源码实现
 */
// GFM table, non-standard
import StateBlock from 'markdown-it/lib/rules_block/state_block';
import MarkdownIt from 'markdown-it';
/**判断是不是空格 */
const isSpace = MarkdownIt().utils.isSpace;

function getLine(state: StateBlock, line: number) {
  const pos = state.bMarks[line] + state.blkIndent,
    max = state.eMarks[line];

  return state.src.substr(pos, max - pos);
}
/**分割头 */
function escapedSplit(str: string) {
  const result = [];
  let pos = 0;
  const max = str.length;
  let ch,
    escapes = 0,
    lastPos = 0,
    backTicked = false,
    lastBackTick = 0;

  ch = str.charCodeAt(pos);

  while (pos < max) {
    if (ch === 0x60 /* ` */) {
      if (backTicked) {
        // make \` close code sequence, but not open it;
        // the reason is: `\` is correct code block
        backTicked = false;
        lastBackTick = pos;
      } else if (escapes % 2 === 0) {
        backTicked = true;
        lastBackTick = pos;
      }
    } else if (ch === 0x7c /* | */ && escapes % 2 === 0 && !backTicked) {
      result.push(str.substring(lastPos, pos));
      lastPos = pos + 1;
    }

    if (ch === 0x5c /* \ */) {
      escapes++;
    } else {
      escapes = 0;
    }

    pos++;

    // If there was an un-closed backtick, go back to just after
    // the last backtick, but as if it was a normal character
    if (pos === max && backTicked) {
      backTicked = false;
      pos = lastBackTick + 1;
    }

    ch = str.charCodeAt(pos);
  }

  result.push(str.substring(lastPos));

  return result;
}

function matTable(state: StateBlock, startLine: number, endLine: number, silent: boolean) {
  // console.log(state, startLine, endLine, silent);
  //   debugger;

  let ch, pos, nextLine, columnCount;

  // doc 表格至少2行(最后会硬插一行)
  if (startLine + 2 > endLine) {
    return false;
  }

  nextLine = startLine + 1;
  if (state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  // doc 行的缩进超过4不会处理
  if (state.sCount[nextLine] - state.blkIndent >= 4) {
    return false;
  }

  // first character of the second line should be '|', '-', ':',
  // and no other characters are allowed but spaces;
  // basically, this is the equivalent of /^[-:|][-:|\s]*$/ regexp
  // doc 下一行第一个有字符的位置
  pos = state.bMarks[nextLine] + state.tShift[nextLine];
  // doc 如果[下一行的有字符位置]超过[下一行的行末尾],不处理
  if (pos >= state.eMarks[nextLine]) {
    return false;
  }

  ch = state.src.charCodeAt(pos++);
  // doc 下一行首字符必须是|-:之一
  if (ch !== 0x7c /* | */ && ch !== 0x2d /* - */ && ch !== 0x3a /* : */) {
    return false;
  }
  // doc 下一行遍历,匹配是对齐
  while (pos < state.eMarks[nextLine]) {
    ch = state.src.charCodeAt(pos);
    // doc 如果这行的下一行中没有
    if (ch !== 0x7c /* | */ && ch !== 0x2d /* - */ && ch !== 0x3a /* : */ && !isSpace(ch)) {
      return false;
    }

    pos++;
  }
  // doc 下一行文本
  /**行文本 */
  let lineText = getLine(state, startLine + 1);
  /**列数组 */
  let columns = lineText.split('|');
  const aligns: string[] = [];
  // doc 判断列声明是否合法
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i].trim();
    if (!column) {
      // allow empty columns before and after table, but not in between columns;
      // e.g. allow ` |---| `, disallow ` ---||--- `
      // doc 允许首末为空
      if (i === 0 || i === columns.length - 1) {
        continue;
      } else {
        return false;
      }
    }
    // doc 如果不是比如:-----:这种匹配
    if (!/^:?-+:?$/.test(column)) {
      return false;
    }
    if (column.charCodeAt(column.length - 1) === 0x3a /* : */) {
      aligns.push(column.charCodeAt(0) === 0x3a /* : */ ? 'center' : 'right');
    } else if (column.charCodeAt(0) === 0x3a /* : */) {
      aligns.push('left');
    } else {
      aligns.push('');
    }
  }
  // console.log('对齐', aligns);

  // doc 当前行
  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf('|') === -1) {
    return false;
  }
  // doc 当前行缩进超过4不处理
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  // doc 去除收尾|的当前行数组
  columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));
  // header row will define an amount of columns in the entire table,
  // and align row shouldn't be smaller than that (the rest of the rows can)
  // doc 如果行数大于对齐数不处理
  columnCount = columns.length;
  if (columnCount > aligns.length) {
    return false;
  }

  if (silent) {
    return true;
  }

  let token = state.push('table_open', 'base-table', 1);
  token.map = [startLine, 0];
  token.attrPush(['headers', JSON.stringify(columns, undefined, 0)]);
  token.attrPush(['aligns', JSON.stringify(aligns)]);
  // console.log('头行', columns);
  const data = [];
  // doc 当前行的下2行,也就是内容行
  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    // doc 判断每行的空格是不是比缩进小
    if (state.sCount[nextLine] < state.blkIndent) {
      break;
    }

    lineText = getLine(state, nextLine).trim();
    if (lineText.indexOf('|') === -1) {
      break;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      break;
    }
    columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));
    // console.log('数据行', columns);
    data.push(columns.map((item) => item.trim()));
  }
  // console.log('所有数据', data);
  token.attrPush(['data', JSON.stringify(data)]);
  token = state.push('table_close', 'base-table', -1);

  state.line = nextLine;
  // console.log(state);
  return true;
}
export const TableExtend = (md: MarkdownIt, o) => {
  md.block.ruler.at('table', matTable);
};
