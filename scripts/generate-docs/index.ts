import { Dgeni } from 'dgeni';
// const Dgeni = require('dgeni')
import docsPackage from './script/main-package';
const dgeni = new Dgeni([docsPackage]);

dgeni.generate().then(function (docs) {
  console.log('文档生成完成', docs.length);
});
