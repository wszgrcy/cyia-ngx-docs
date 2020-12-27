import MarkdownIt from 'markdown-it';
import StateBlock from 'markdown-it/lib/rules_block/state_block';

const isSpace = MarkdownIt().utils.isSpace;

export function heading(state: StateBlock, startLine: number, endLine: number, silent: boolean) {
  let ch,
    tmp,
    pos = state.bMarks[startLine] + state.tShift[startLine],
    max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }

  ch = state.src.charCodeAt(pos);

  if (ch !== 0x23 /* # */ || pos >= max) {
    return false;
  }

  // count heading level
  let level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 0x23 /* # */ && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || (pos < max && !isSpace(ch))) {
    return false;
  }

  if (silent) {
    return true;
  }

  // Let's cut tails like '    ###  ' from the end of string

  max = state.skipSpacesBack(max, pos);
  tmp = state.skipCharsBack(max, 0x23, pos); // #
  if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
    max = tmp;
  }

  state.line = startLine + 1;

  let token = state.push('heading_open', `doc-anchor`, 1);
  token.markup = '########'.slice(0, level);
  token.map = [startLine, state.line];
  token.attrPush(['tag', `h${level}`]);
  token.attrPush(['content', `${state.src.slice(pos, max).trim()}`]);

  token.children = [];
  token = state.push('heading_close', `doc-anchor`, -1);
  token.markup = '########'.slice(0, level);
  return true;
}
export const HeadingExtend = (md: MarkdownIt, o) => {
  md.block.ruler.at('heading', heading);
};
