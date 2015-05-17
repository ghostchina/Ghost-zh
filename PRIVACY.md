# Privacy

This is a plain English summary of all of the components within Ghost which may affect your privacy in some way. Please keep in mind that if you use third party Themes or Apps with Ghost, there may be additional things not listed here.

本文档中列出的每项服务都可以通过修改 Ghost 的 `config.js` 配置文件来禁用。请查看 [配置指南](http://support.ghost.org/config/) 了解详情。
## 官方服务

Ghost 官方提供的某些服务是默认开启的。这些服务需要连接到 Ghost.org 并且由 Ghost 基金会（Ghost Foundation -- 实际运作 Ghost 项目的非盈利组织）管控。


### 自动更新检查

每次登录后台时，Ghost 都会向 Ghost.org 发起一次请求用于检查当前运行的是不是最新的 Ghost 版本。如果有新版本可以更新，Ghost 会在后台页面展示一个提示框通知你升级新版本。Ghost.org 通过每次的更新检查来收集基本的匿名使用信息。

此项服务可以被随时禁止。所有关于此项服务的信息和代码都可以在 [update-check.js](https://github.com/TryGhost/Ghost/blob/master/core/server/update-check.js) 文件中找到。


## 第三方服务

Ghost 使用了一些第三方服务来提供某些特定功能。


### Google 字体服务

Ghost 使用了 Open Sans [Google Font](https://www.google.com/fonts) 字体，并在 Ghost 后台页面中加载此字体用于更好的排版。

### Gravatar

To automatically populate your profile picture, Ghost pings [Gravatar](http://gravatar.com) to see if your email address is associated with a profile there. If it is, we pull in your profile picture. If not: nothing happens.

### RPC Pings

When you publish a new post, Ghost sends out an RPC ping to let third party services know that new content is available on your blog. This enables search engines and other services to discover and index content on your blog more quickly. At present Ghost sends an RPC ping to the following services when you publish a new post:

- http://blogsearch.google.com
- http://rpc.pingomatic.com

RPC pings only happen when Ghost is running in the `production` environment.

### Sharing Buttons

The default theme which comes with Ghost contains three sharing buttons to [Twitter](http://twitter.com), [Facebook](http://facebook.com), and [Google Plus](http://plus.google.com). No resources are loaded from any services, however the buttons do allow visitors to your blog to share your content publicly on these respective networks.

### 结构化数据

Ghost outputs basic meta tags to allow rich snippets of your content to be recognised by popular social networks. Currently there are 3 supported rich data protocols which are output in `{{ghost_head}}`:

- Schema.org - http://schema.org/docs/documents.html
- Open Graph - http://ogp.me/
- Twitter cards - https://dev.twitter.com/cards/overview