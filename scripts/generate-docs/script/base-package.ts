import { Package } from 'dgeni';
import { HANDING_DOCS_DATA, AFTER_HANDLE } from './const/run-time';
export const BasePackage = new Package('base-package', [
  require('dgeni-packages/jsdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/typescript'),
])
  .processor({ name: HANDING_DOCS_DATA, $runBefore: ['docs-processed'], $process: function () {} })
  .processor({
    name: AFTER_HANDLE,
    $runBefore: ['docs-processed'],
    $runAfter: [HANDING_DOCS_DATA],
    $process: function () {},
  });
