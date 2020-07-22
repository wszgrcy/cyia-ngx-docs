# CyiaNgxDocs
- 以下内容均为开发时的实现思路,如果与各位开发者的想法有出入,请及时联系供我改进
## 说明
- 这是一个供`ng library`开发的依赖包生成文档的项目
- 文档以`模块`为目录(`@NgModel`),分为`简介`及`接口`两部分
## 原理
- 首先,通过文档生成模块,生成显示文档所需的数据
> 使用ng官网生成文档使用的`dgeni`
- 然后,项目构建后,即可想数据渲染为网页
### 文档标记
- `docs-overview` 后跟md文件用来提供文件简介
- `docs-module` 标记是一个模块文档
- `docs-service` 标记是一个服务文档
- `docs-decorator` 标记是一个装饰器文档
## 使用
- 添加文档标记,及设置项目路径`scripts\generate-docs\script\const\path.ts`及相关需要生成文档的文件
- 运行`npm run docs`
- 运行`npm run build`
## 未实现部分
- 对于开发实例显示的支持
- 搜索的实现
- 页脚数据展示
- ~~生成数据部分代码迁移(目前展示部分在cyia-ngx-common中有相关例子)~~