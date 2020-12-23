import * as monaco from 'monaco-editor';

export const environment = {
  production: false,
};
export async function getMonaco() {
  return monaco;
}
