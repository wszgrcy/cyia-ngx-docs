import { createCssSelectorForHtml } from './css-selector-for-html';

const mockHtml = `<div class="test" id="mock">
<p>123<code></code>  </p>
</div><span></span>`;
describe('用于ts node的css选择器', () => {
  it('初始化', () => {
    let cssSelector = createCssSelectorForHtml(mockHtml);
    expect(cssSelector).toBeTruthy();
  });
  it('标签查询', () => {
    let cssSelector = createCssSelectorForHtml(mockHtml);

    let result = cssSelector.query('div');
    // console.log(result)
    expect(result.length).toBe(1);
  });
  it('~', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div~span');

    expect(result.length).toBe(1);
    expect(result[0].name === 'span').toBeTrue();
  });
  it('>', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div>p');

    expect(result.length).toBe(1);
    expect(result[0].name === 'p').toBeTrue();
  });
  it(',', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div,span');

    expect(result.length).toBe(2);
  });
  it('attribute equal', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div[id=mock]');

    expect(result.length).toBe(1);
    expect(result[0].name === 'div').toBeTruthy();
    expect(result[0].attrs.find((item) => item.name == 'id' && item.value == 'mock')).toBeTruthy();
  });
  it('attribute exist', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div[id]');

    expect(result.length).toBe(1);
    expect(result[0].name === 'div').toBeTruthy();
    expect(result[0].attrs.find((item) => item.name == 'id')).toBeTruthy();
  });
  it('attribute any', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div[id*=mo]');

    expect(result.length).toBe(1);
    expect(result[0].name === 'div').toBeTruthy();
    expect(result[0].attrs.find((item) => item.name == 'id' && item.value == 'mock')).toBeTruthy();
  });
  it('.class', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div.test');
    expect(result.length).toBe(1);
    expect(result[0].name === 'div').toBeTruthy();
    expect(result[0].attrs.find((item) => item.value == 'test')).toBeTruthy();
  });
  it('#id', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('#mock');
    expect(result.length).toBe(1);
    expect(result[0].name === 'div').toBeTruthy();
    expect(result[0].attrs.find((item) => item.value == 'test')).toBeTruthy();
  });
  it('通过返回的element进行查询', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div.test');
    expect(result.length).toBe(1);
    result = cssSelctor.query(result[0], 'p');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('p');
  });
  it('a b c', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div  p code');
    expect(result.length).toBe(1);
    expect(result[0].name === 'code').toBeTruthy();
  });
  it('复杂选择', () => {
    let cssSelctor = createCssSelectorForHtml(mockHtml);
    let result = cssSelctor.query('div#mock.test[class=test][id=mock] p');
    expect(result.length).toBe(1);
    expect(result[0].name === 'p').toBeTruthy();
  });
});
