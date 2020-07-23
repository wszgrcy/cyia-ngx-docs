# CyiaNgxDocs
- 启动项目默认跳转此页面,如果不需要可以在路由导航部分取消重定向
- 以下内容均为开发时的实现思路,如果与各位开发者的想法有出入,请及时联系供我改进

## 说明
- 这是一个供`ng library`开发的依赖包生成文档的项目
- 文档以`模块`为目录(`@NgModel`),分为`简介`及`接口`两部分

## 原理

- 首先,通过文档生成模块,生成显示文档所需的数据
> 使用ng官网生成文档使用的`dgeni`
- 然后,项目构建后,即可想数据渲染为网页
- `scripts\generate-docs`部分为构建生成文档的代码
- `scripts\generate-docs\script\build-package`部分为构建生成代码的生成`dgeni.Package`,可以修改此处代码实现自定义的生成文档逻辑,其余部分如果有问题建议提`issues`解决

### 可生成文档的自定义元素
|文档选择器|输入属性|描述
|-|-|-|
|doc-anchor|{tag,content}|将h1-h6标签(或者其他原生标签),生成一个带有锚点的元素供定位|
|method-table|服务文档的`methodList`|用于将服务方法生成为表格
|property-table|装饰器文档的`docParameters`属性|拥有将装饰器的一些输入参数生成为表格
|flex-layout|{flexList}|用于布局,目前用在内容和目录的布局使用
|doc-content|无|目前用于存放生成的文档,属于一个容器
|doc-catalog|{selector}|用于通过选择器找到h1-h6标签,生成目录|
|doc-tabs|[{title,url,selected}]|创建tabs通过url请求切换|

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
> 个人需求不大,简单的实现了下

- ~~生成数据部分代码迁移(目前展示部分在cyia-ngx-common中有相关例子)~~
- 路由导航多级