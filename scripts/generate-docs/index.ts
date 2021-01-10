import { Dgeni } from 'dgeni';
import docsPackage from './script/main-package';
import { toDisplay } from './example-handle/to-display';
import { ExampleCodeHandle } from './example-handle/to-get-code';
const dgeni = new Dgeni([docsPackage]);

dgeni.generate().then(function (docs) {
  console.log('文档生成完成', docs.length);
});
toDisplay();
new ExampleCodeHandle().build();
