import { importScript } from 'cyia-ngx-common/util';
export const environment = {
  production: true,
};
export async function getMonaco() {
  const monacoLoader = await importScript('https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.21.2/min/vs/loader.min.js');
  const require: any = window.require;
  require.config({ paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.21.2/min/vs' } });
  const monaco = await new Promise((res) => {
    require(['vs/editor/editor.main'], res);
  });
  return monaco;
}
