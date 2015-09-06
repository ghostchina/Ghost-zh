# 隐私

此份中文文档列出了 Ghost 以及 Ghost 中文版中可能影响到你的隐私的组件。请注意，此文档将不会涉及也有可能影响到你的隐私的第三方主题或 App 。

本文档中列出的每项服务都可以通过修改 Ghost 的 `config.js` 配置文件来禁用。请查看 [配置指南](http://support.ghost.org/config/) 了解详情。

## 官方服务

Ghost 官方提供的某些服务是默认开启的。这些服务需要连接到 Ghost.org 并且由 Ghost 基金会（Ghost Foundation -- 实际运作 Ghost 项目的非盈利组织）管控。

Ghost 中文版只修改了自动检查更新服务，需要连接到 ghostchina.com。


### 自动更新检查

每次登录后台时，Ghost 都会向 Ghost.org 发起一次请求用于检查当前运行的是不是最新的 Ghost 版本。如果有新版本可以更新，Ghost 会在后台页面展示一个提示框通知你升级新版本。Ghost.org 通过每次的更新检查来收集基本的匿名使用信息。

此项服务可以被随时禁止。所有关于此项服务的信息和代码都可以在 [update-check.js](https://github.com/TryGhost/Ghost/blob/master/core/server/update-check.js) 文件中找到。

由于 Ghost 官方还没有完成国际化版本的开发工作，因此，Ghost 中文网所发布的中文版 Ghost 目前还不能纳入 Ghost 官方的版本发布列表中，因此，我们（Ghost 中文网）将 Ghost 自动检查更新服务的目标地主修改为 `updates.ghostchina.com` 网址，以便使用中文版的用户能够及时收到中文版的更新通知。如果你希望禁止检查更新，请参考 [隐私设置](http://support.ghost.org/config/#privacy) 文档关闭更新检查。所有关于此项服务的信息和代码都可以在 [update-check.js](https://github.com/ghostchina/Ghost-zh/blob/master/core/server/update-check.js) 文件中找到。


## 第三方服务

Ghost 使用了一些第三方服务来提供某些特定功能。


### Google 字体服务

Ghost 使用了 Open Sans [Google Font](https://www.google.com/fonts) 字体，并在 Ghost 后台页面中加载此字体用于更好的排版。

由于 Google Font 总是被墙，所以并且这些英文字体对于中文来说没有丝毫用处，因此在 Ghost 中文版中我们将这些字体删除了。

### Gravatar

为了自动为新用户设置头像图片，Ghost 向 [Gravatar](http://gravatar.com) 查询是否用户的邮箱地址有关联的头像可用。如果有，我们就用 Gravatar 上的头像图片，如果没有，就设置为默认图片。

### RPC Pings

每当你发布了一篇新博文，Ghost 都会发送一个 RPC ping 向第三方服务通知此新博文诞生了。这将帮助搜索引擎和其他索引服务能够快速索引你的博客上的内容。目前，Ghost 只向如下列出的服务发送 RPC ping：

- http://blogsearch.google.com
- http://rpc.pingomatic.com

RPC ping 只在 Ghost 运行在 `production` 环境时才会开启。


Ghost 会输出一些基本的元数据标签以便被流行的社交网络识别博客上的内容。目前 `{{ghost_head}}` 助手函数所输出的元数据符合以下三个数据协议标准：

- Schema.org - http://schema.org/docs/documents.html
- Open Graph - http://ogp.me/
- Twitter cards - https://dev.twitter.com/cards/overview

### 默认主题

Ghost 自带的默认主题引入了 jQuery 文件，此文件位于 [BootCDN](http://www.bootcdn.cn/jquery/) 上。默认主题还包含了三个分享按钮，分别是：[Twitter](http://twitter.com)、[Facebook](http://facebook.com) 和 [Google Plus](http://plus.google.com)，没有引入任何额外资源。
