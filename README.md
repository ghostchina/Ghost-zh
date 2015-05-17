<a href="https://github.com/TryGhost/Ghost"><img src="https://cloud.githubusercontent.com/assets/120485/6622822/c4c639fe-c8e7-11e4-9e64-5bec06c8b4c3.png" alt="Ghost" /></a>
<a href="https://travis-ci.org/TryGhost/Ghost"><img align="right" src="https://travis-ci.org/TryGhost/Ghost.svg?branch=master" alt="Build status" /></a>

![Ghost Screenshot](https://cloud.githubusercontent.com/assets/120485/6626466/6dae46b2-c8ff-11e4-8c7c-8dd63b215f7b.jpg)

![Ghost is a simple, powerful publishing platform that allows you to share your stories with the world.](https://cloud.githubusercontent.com/assets/120485/6626501/b2bb072c-c8ff-11e4-8e1a-2e78e68fd5c3.png)

The project is maintained by a non-profit organisation called the **Ghost Foundation**, along with an amazing group of independent [contributors](https://github.com/TryGhost/Ghost/contributors). We're trying to make publishing software that changes the shape of online journalism.

- [Ghost.org](https://ghost.org)
- [Latest Release](https://ghost.org/download/)
- [Support](http://support.ghost.org/)
- [Theme Docs](http://themes.ghost.org)
- [Contributing Guide](https://github.com/TryGhost/Ghost/blob/master/CONTRIBUTING.md)
- [Feature Requests](http://ideas.ghost.org/)
- [Dev Blog](http://dev.ghost.org)


# 快速安装

安装前请确保已经安装了 Node.js - 我们建议使用 **Node v0.10.x** 的最新版本。

Ghost 同时还支持 **Node v0.12** 和 **io.js v1.2**，但是这些版本可能会导致安装失败，请自行斟酌。获取帮助请到 [论坛](https://ghost.org/forum/installation/)。

1. 下载 [最新版本](https://ghost.org/download/) 的 Ghost
1. 解压文件至你所希望的安装位置
1. 启动一个命令行窗口
1. 执行 `npm install --production` 命令
1. 启动 Ghost
    - 本地环境：`npm start`
    - 生产环境：`npm start --production`
1. 启动浏览器，打开 `http://localhost:2368/ghost` 链接

还可以参考详细的 [安装指南](http://support.ghost.org/installation/) 。

<a name="getting-started"></a>
# 开发者(从 git 下载 Ghost)

安装 Node.js。

```bash
# Node v0.10.x - 完全支持
# Node v0.12.x and io.js v1.2 - 部分支持
#
# 自行斟酌吧
```

克隆 ghost:

```bash
git clone git://github.com/tryghost/ghost.git
cd ghost
```

安装 grunt。

```bash
npm install -g grunt-cli
```

安装 Ghost。 If you're running locally, use [master](https://github.com/TryGhost/Ghost/tree/master). For production, use [stable](https://github.com/TryGhost/Ghost/tree/stable). :no_entry_sign::rocket::microscope:

```bash
npm install
```

Build the things!

```bash
grunt init
```

Minify that shit for production?

```bash
grunt prod
```

Start your engines.

```bash
npm start

## running production? Add --production
```

Congrats! You made it. BTW you can also just `npm install ghost` if you're into that sort of thing. NPM afficionados can also read up on using [Ghost as an NPM module](https://github.com/TryGhost/Ghost/wiki/Using-Ghost-as-an-npm-module).

More general [install docs](http://support.ghost.org/installation/) here in case you got stuck.


# Deploying Ghost

The easiest way to deploy Ghost is on our official <strong><a href="https://ghost.org/pricing/">Ghost(Pro)</a></strong> hosted platform. This service funds the Ghost Foundation, which makes actively maintaining this project possible.

Also, you get to save yourself a lot of wasted time and headaches by deploying a new instance of Ghost to a managed server with a global content delivery network in just a few clicks.

[Other options](http://support.ghost.org/deploying-ghost/) are available if you prefer playing around with servers by yourself.


# Staying Up to Date

When a new version of Ghost comes out, you'll want to look over these [upgrade instructions](http://support.ghost.org/how-to-upgrade/) for what to do next.

You can talk to other Ghost users on [our forums](https://ghost.org/forum) or chat with Ghost developers in our [public Slack team](https://ghost.org/slack/) (it's pretty awesome). We have a public meeting every Tuesday at 5:30pm London time.

New releases are announced on the [dev blog](http://dev.ghost.org/tag/releases/). You can subscribe by email or follow [@TryGhost_Dev](https://twitter.com/tryghost_dev) on Twitter, if you prefer your updates bite-sized and facetious.

:saxophone::turtle:


# Copyright & License

Copyright (c) 2013-2015 Ghost Foundation - Released under the [MIT license](LICENSE).
