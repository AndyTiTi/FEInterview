---
title: 第二章
---

## 第一题：Github Actions 自动构建前端项目并部署到服务器？

在你需要部署到 Github Page 的项目下，建立一个 yml 文件，放在 .github/workflow 目录下。你可以命名为 ci.yml，它类似于 Jenkins 的 Jenkinsfile 文件，里面包含的是要自动执行的脚本代码。
这个 yml 文件的内容如下：
```yml
name: Build and Deploy
on: # 监听 master 分支上的 push 事件
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest # 构建环境使用 ubuntu
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.1  
        with:
          persist-credentials: false

      - name: Install and Build # 下载依赖 打包项目
        run: |
          npm install
          npm run build

      - name: Deploy # 将打包内容发布到 github page
        uses: JamesIves/github-pages-deploy-action@3.5.9 # 使用别人写好的 actions
        with:  # 自定义环境变量
          # ACCESS_TOKEN: ${{ secrets.VUE_ADMIN_TEMPLATE }} # VUE_ADMIN_TEMPLATE 是我的 secret 名称，需要替换成你的
          BRANCH: master
          FOLDER: dist
          REPOSITORY_NAME: woai3c/woai3c.github.io # 这是我的 github page 仓库
          TARGET_FOLDER: github-actions-demo # 打包的文件将放到静态服务器 github-actions-demo 目录下

```
上面有一个 **ACCESS_TOKEN** 变量需要自己配置。

1. 打开 Github 网站，点击你右上角的头像，选择 settings。
2. 点击左下角的 developer settings。
3. 在左侧边栏中，单击 Personal access tokens（个人访问令牌）。
4. 单击 Generate new token（生成新令牌）。
5. 输入名称并勾选 repo。

![image](/image-20211229163104624.png)

6. 拉到最下面，点击 `Generate token`，并将生成的 token 保存起来。
7. 打开你的 Github 项目，点击 `settings`。
8. 创建一个密钥，名称随便填（中间用下划线隔开），内容填入刚才创建的 token。

![image](/image-20211229163410327.png)

9.  
```javascript
将上文代码中的 `ACCESS_TOKEN: ${{ secrets.VUE_ADMIN_TEMPLATE }}` 
替换成刚才创建的 secret 名字，
替换后代码如下 `ACCESS_TOKEN: ${{ secrets.TEST_A_B }}`。
保存后，提交到 Github。
```

10. 以后你的项目只要执行 `git push`，Github Actions 就会自动构建项目并发布到你的 Github Page 上。

    Github Actions 的执行详情点击仓库中的 `Actions` 选项查看。

## 第二题：Github Actions 部署到阿里云

1. 创建一个静态服务器

```
mkdir node-server // 创建 node-server 文件夹
cd node-server // 进入 node-server 文件夹
npm init -y // 初始化项目
npm i express
touch server.js // 创建 server.js 文件
vim server.js // 编辑 server.js 文件
```

将以下代码输入进去（用 vim 进入文件后按 i 进行编辑，保存时按 esc 然后输入 :wq，再按 enter），更多使用方法请自行搜索。

```javascript
const express = require('express')
const app = express()
const port = 3388 // 填入自己的阿里云映射端口，在网络安全组配置。

app.use(express.static('dist'))

app.listen(port, '0.0.0.0', () => {
    console.log(`listening`)
})
```

执行 `node server.js` 开始监听，由于暂时没有 `dist` 目录，先不要着急。

注意，监听 IP 必须为 `0.0.0.0` ，详情请看[部署Node.js项目注意事项](https://www.alibabacloud.com/help/zh/doc-detail/50775.htm)。

阿里云入端口要在网络安全组中查看与配置。

2. 创建阿里云密钥对

请参考[创建SSH密钥对](https://www.alibabacloud.com/help/zh/doc-detail/51793.htm)和[绑定SSH密钥对](https://www.alibabacloud.com/help/zh/doc-detail/51796.htm?spm=a2c63.p38356.879954.9.cf992580IYf2O7#concept-zzt-nl1-ydb) ，将你的 ECS 服务器实例和密钥绑定，然后将私钥保存到你的电脑（例如保存在 ecs.pem 文件）。

3. 打开你要部署到阿里云的 Github 项目，点击 setting->secrets。secret 名称为 `SERVER_SSH_KEY`，并将刚才的阿里云密钥填入内容。点击 add secret 完成。
4. 在你项目下建立 `.github\workflows\ci.yml` 文件，填入以下内容：

```
name: Build app and deploy to aliyun
on:
  #监听push操作
  push:
    branches:
      # master分支，你也可以改成其他分支
      - master
jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - name: Install Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '12.16.2'
    - name: Install npm dependencies
      run: npm install
    - name: Run build task
      run: npm run build
    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@v2.1.5
      env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: '-rltgoDzvO --delete'
          SOURCE: dist # 这是要复制到阿里云静态服务器的文件夹名称
          REMOTE_HOST: '118.190.217.8' # 你的阿里云公网地址
          REMOTE_USER: root # 阿里云登录后默认为 root 用户，并且所在文件夹为 root
          TARGET: /root/node-server # 打包后的 dist 文件夹将放在 /root/node-server
```

保存，推送到 Github 上。

以后只要你的项目执行 `git push` 操作，就会自动执行 `ci.yml` 定义的脚本，将打包文件放到你的阿里云静态服务器上。

这个 Actions 主要做了两件事：

1. 克隆你的项目，下载依赖，打包。
2. 用你的阿里云私钥以 SSH 的方式登录到阿里云，把打包的文件上传（使用 rsync）到阿里云指定的文件夹中。

如果还是不懂，建议看一下我的 [demo](https://github.com/woai3c/github-actions-aliyun-demo)。

### `ci.yml` 配置文件讲解

1. `name`，表示这个工作流程（workflow）的名称。
2. `on`，表示监听的意思，后面可以加上各种事件，例如 `push` 事件。

下面这段代码表示要监听 `master` 分支的 `push` 事件。当 Github Actions 监听到 `push` 事件发生时，它就会执行下面 `jobs` 定义的一系列操作。

```
name: Build app and deploy to aliyun
on:
  #监听push操作
  push:
    branches:
      # master分支，你也可以改成其他分支
      - master
jobs:
...
```

3. `jobs`，看字面意思就是一系列的作业，你可以在 `jobs` 字段下面定义很多作业，例如 `job1`、`job2` 等等，并且它们是并行执行的。

```
jobs:
  job1:
  	...
  job2:
  	...
  job3:
  	...
```

回头看一下 `ci.yml` 文件，它只有一个作业，即 `build`，作业的名称是自己定义的，你叫 `good` 也可以。

4. `runs-on`，表示你这个工作流程要运行在什么操作系统上，`ci.yml` 文件定义的是最新稳定版的 `ubuntu`。除了 ubuntu，它还可以选择 Mac 或 Windows。

```
    steps:
    - uses: actions/checkout@v1
    - name: Install Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '12.16.2'
    - name: Install npm dependencies
      run: npm install
    - name: Run build task
      run: npm run build
    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@v2.1.5
      env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: '-rltgoDzvO --delete'
          SOURCE: dist # 这是要复制到阿里云静态服务器的文件夹名称
          REMOTE_HOST: '118.190.217.8' # 你的阿里云公网地址
          REMOTE_USER: root # 阿里云登录后默认为 root 用户，并且所在文件夹为 root
          TARGET: /root/node-server # 打包后的 dist 文件夹将放在 /root/node-server
```



1. 使用 `actions/checkout@v1` 库克隆代码到 `ubuntu` 上。
2. 使用 `actions/setup-node@v1` 库安装 nodejs，`with` 提供了一个参数 `node-version` 表示要安装的 nodejs 版本。
3. 在 `ubuntu` 的 `shell` 上执行 `npm install` 下载依赖。
4. 执行 `npm run build` 打包项目。
5. 使用 `easingthemes/ssh-deploy@v2.1.5` 库，这个库的作用就是用 `SSH` 的方式远程登录到阿里云服务器，将打包好的文件夹复制到阿里云指定的目录上。

从 `env` 上可以看到，这个 actions 库要求我们提供几个环境变量：

1. `SSH_PRIVATE_KEY`: 阿里云密钥对中的私钥（需要你提前写在 github secrets 上），
2. `ARGS: '-rltgoDzvO --delete'`，没仔细研究，我猜是复制完文件就删除掉。
3. `SOURCE`：打包后的文件夹名称
4. `REMOTE_HOST`: 阿里云公网 IP 地址
5. `REMOTE_USER`: 阿里云服务器的用户名
6. `TARGET`: 你要拷贝到阿里云服务器指定目录的名称

## 第三题：怎么配置单页应用？怎么配置多页应用？

单页应用可以理解为 webpack 的标准模式，直接在 entry 中指定单页应用的入口即可，这里不再赘述
多页应用的话，可以使用 webpack 的 AutoWebPlugin 来完成简单自动化的构建，但是前提是项目的目录结构必须遵守他预设的规范。 多页应用中要注意的是：
每个页面都有公共的代码，可以将这些代码抽离出来，避免重复的加载。比如，每个页面都引用了同一套 css 样式表
随着业务的不断扩展，页面可能会不断的追加，所以一定要让入口的配置足够灵活，避免每次添加新页面还需要修改构建配置