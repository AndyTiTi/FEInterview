---
title: 第一章
---

## SSR？

## 一个网站 SEO 怎么优化

## 用不了 Lighthouse 怎么办？

可以下载 npm 包
还有 WebPageTest

## 用户活跃度几千万的网站如何优化

## 性能优优化方法都有哪些？

怎么测量的，怎么优化的，优化前后的对比

## 前端加载优化你都做过哪些？

1. 首屏优化
2. 首次可交互时间

页面性能检测 lighthouse、pagespeed
polyfill（高版本的语法进行低版本实现，语法多、体积大）https://polyfill.io/v3/polyfill.min.js

1. 只请求当前需要的资源
   异步加载、懒加载、polyfill - 不需要 webpack 打包便可以分析浏览器版本，进行动态引入所需内容
2. 缩减资源体积
   打包压缩
   gzip 1.2M - 300k
   图片格式的优化，手机端相比 pc 减小分辨率（tinypng），根据屏幕分辨率展示不同分辨率的图片，webp 格式
   尽量控制 cookie 大小 request header js-cookie 头请求耗费请求资源
3. 时序优化
   js promise.all 对于不关联的文件一并请求
   ssr 服务端渲染，千人千面(根据不同特征进行缓存)，seo
   prefetch,prerender,preload

```javascript
<link rel="dns-prefetch" href="xxx1.com"/>
<link rel="dns-prefetch" href="xxx2.com"/>
<link rel="preconnect" href="xxx1.com"/>
<link rel="preload" as="image" href="xxx1.com/p.png"/> // 高优先级banner图
```

4. 合理利用缓存
   cdn cdn 预热（穿透服务） cdn 刷新（强制回源）
5. 装饰器模式计算函数执行耗时

## webp 是否被支持？

```javascript
function checkWebp() {
	try {
		return (
			document
				.createElement('canvas')
				.toDataURL('image/webp')
				.indexOf('data:image/webp') === 0
		)
	} catch (e) {
		return false
	}
}
export function getWebImageUrl(url) {
	if (!url) {
		throw Error('url 不能为空')
	}
	if (url.startwWith('data:')) {
		return url
	}

	if (!checkWebp()) {
		return url
	}
	return url + '?x-oss-pong.png'
}
```

## 实现前端监控系统

**实现一个系统，统计前端页面性能、页面 JS 报错、用户操作行为、PV/UV、用户设备等消息，并进行必要的监控报警。方案如何设计，用什么技术点，什么样的系统架构，难点会在哪里？**

### 一、需求背景

#### 1.1 为什么要做

-   更快的发现问题
-   做产品决策依据
-   提升前端开发的技术深度和广度
-   为业务扩展提供更多可能性

为了实现收集功能，我们需要一个前端监控平台，它能够收集数据、处理数据、存储数据、查询数据。其实就有很多现成的平台或者开源项目我们可以直接使用。

#### 1.2 行内通用方案

前端技术发展至今，相信大家已经对前端监控的这件事情非常熟悉，或多或少都会在我们的项目中用上它。比如搭建使用开源项目 sentry、付费平台阿里的 ARMS、甚至小程序配套的前端监控服务。

1. sentry，sentry 主要提供的功能是收集错误。支持大多流行语言的客户端和服务端，不支持小程序，但是目前有大公司根据 sentry 的上报数据结构，自己实现了小程序 SDK 并开源，目前关注度和流行度都偏低。除开错误，它的其它类型的前端监控能力相对来说很弱。
1. 阿里 ARMS，ARMS 提供的功能与支持的客户端比较齐全，小程序也支持。只是需要付费。总体来说提供的功能还是比较全面、符合国内的环境。
1. 小程序自带监控 微信小程序不断的在完善内部的监控，各方面的功能也慢慢丰富了起来，但是只能支持小程序本身。

在使用这些开源或者平台前端监控服务的时候，始终有一些不足。比如：

-   系统分散
-   很难满足增加一些自定义数据和查询的需求
-   特性一直不更新、Bug 解决周期长
-   二次开发难度大

#### 1.3 定制化

如果完全从 0 到 1 来打造一套前端监控系统，成本也是很高的。甚至在早期，都可能没人愿意用，系统是否能立项或者持续发展下去也是一个问题。于是从一些开源项目中去寻找，去找一个方便改造也有一定功能模块的项目。可以基于它的代码，进行长期的改造和迭代。慢慢的改造成为一个更适合公司内部环境的一个前端监控系统。

### 二、系统架构

#### 2.1 基本构成

-   客户端 SDK
    -   web
-   服务端 node + EggJs
-   数据库 Redis Mongo+mongooseJs(orm)
-   管理台 Vue + ElementUI

为了实现前端监控，第一要素是要收集客户端数据，为了方便客户端集成监控系统、我们需要首先开发封装一个统一的 SDK、去帮助我们收集数据。

SDK 收集了数据，我们还需要通过服务端接口来接收，在服务端，使用 node+EggJs，node 适合 i/o 密集型场景，符合前端技术栈。eggjs 简单易用、文档友好，大部分使用 node 的前端程序员都应该能很快上手。

服务端收集到数据并进行一些处理之后，我们需要存储到我们的数据库之中。在数据库方面，使用 mongo 做持久化存储，mongo 文档模型数据库，数据扩展方便，类 json 结构方便和 node 配合使用，天生适合日志系统。使用 redis 做数据缓存，redis 简单易用的高性能 key-value 数据库，市场上占据主流，被大部分人都熟知。

最后，还需要一个管理台，做数据查询与管理。管理台使用 Vue+ElementUI，简单快速。

客户端 SDK 收集数据上报，node 服务端获取到数据后，先存在 redis 中，node 服务会根据消费能力去拉取 redis 数据处理分析后存储到 mongo 之中，最后我们通过管理后台展示处理好的应用数据。

#### 2.2 技术的可能的一些难点

可能整个系统比较复杂的就是如何高效合理的进行监控数据上传。除了异常报错信息本身，还需要记录用户操作日志，如果任何日志都立即上报，这无异于自造的 DDOS 攻击。那就需要考虑前端日志的存储，日志如何上传，上传前如何整理日志等问题。

对于日志的处理上报有这样的处理方案

-   前端存储日志

    我们并不单单采集异常本身日志，而且还会采集与异常相关的用户行为日志。单纯一条异常日志并不能帮助我们快速定位问题根源，找到解决方案。但如果要收集用户的行为日志，又要采取一定的技巧，而不能用户每一个操作后，就立即将该行为日志传到服务器，对于具有大量用户同时在线的应用，如果用户一操作就立即上传日志，无异于对日志服务器进行 DDOS 攻击。因此，我们先将这些日志存储在用户客户端本地，达到一定条件之后，再同时打包上传一组日志。

    那么，如何进行前端日志存储呢？我们不可能直接将这些日志用一个变量保存起来，这样会挤爆内存，而且一旦用户进行刷新操作，这些日志就丢失了，因此，我们自然而然想到前端数据持久化方案。

    目前，可用的持久化方案可选项也比较多了，主要有：Cookie、localStorage、sessionStorage、IndexedDB、webSQL 、FileSystem 等等。那么该如何选择呢？我们通过一个表来进行对比：

    | 存储方式 | cookie | localStorage | sessionStorage | IndexedDB  | webSQL | FileSystem |
    | -------- | ------ | ------------ | -------------- | ---------- | ------ | ---------- |
    | 类型     |        | key-value    | key-value      | NoSQL      | SQL    |            |
    | 数据格式 | string | string       | string         | object     |        |            |
    | 容量     | 4k     | 5M           | 5M             | 500M       | 60M    |            |
    | 进程     | 同步   | 同步         | 同步           | 异步       | 异步   |            |
    | 检索     |        | key          | key            | key, index | field  |            |
    | 性能     |        | 读快写慢     |                | 读慢写快   |        |            |

    综合之后，IndexedDB 是最好的选择，它具有容量大、异步的优势，异步的特性保证它不会对界面的渲染产生阻塞。而且 IndexedDB 是分库的，每个库又分 store，还能按照索引进行查询，具有完整的数据库管理思维，比 localStorage 更适合做结构化数据管理。但是它有一个缺点，就是 api 非常复杂，不像 localStorage 那么简单直接。针对这一点，我们可以使用 hello-indexeddb 这个工具，它用 Promise 对复杂 api 进行来封装，简化操作，使 IndexedDB 的使用也能做到 localStorage 一样便捷。另外，IndexedDB 是被广泛支持的 HTML5 标准，兼容大部分浏览器，因此不用担心它的发展前景。

-   日志上报

    按照上报的频率（重要紧急度）可将上报分为四类

    -   即时上报

        收集到日志后，立即触发上报函数。仅用于 A 类异常。而且由于受到网络不确定因素影响，A 类日志上报需要有一个确认机制，只有确认服务端已经成功接收到该上报信息之后，才算完成。否则需要有一个循环机制，确保上报成功。

    -   批量上报

        将收集到的日志存储在本地，当收集到一定数量之后再打包一次性上报，或者按照一定的频率（时间间隔）打包上传。这相当于把多次合并为一次上报，以降低对服务器的压力。

    -   区块上报

        将一次异常的场景打包为一个区块后进行上报。它和批量上报不同，批量上报保证了日志的完整性，全面性，但会有无用信息。而区块上报则是针对异常本身的，确保单个异常相关的日志被全部上报。

    -   用户主动提交

        在界面上提供一个按钮，用户主动反馈 bug。这有利于加强与用户的互动。

    或者当异常发生时，虽然对用户没有任何影响，但是应用监控到了，弹出一个提示框，让用户选择是否愿意上传日志。这种方案适合涉及用户隐私数据时。

    |      | 即时上报     | 批量上报    | 区块上报         | 用户反馈  |
    | ---- | ------------ | ----------- | ---------------- | --------- |
    | 时效 | 立即         | 定时        | 稍延时           | 延时      |
    | 条数 | 一次全部上报 | 一次 100 条 | 单次上报相关条目 | 一次 1 条 |
    | 容量 | 小           | 中          | –                | –         |
    | 紧急 | 紧急重要     | 不紧急      | 不紧急但重要     | 不紧急    |

    即时上报虽然叫即时，但是其实也是通过类似队列的循环任务去完成的，它主要是尽快把一些重要的异常提交给监控系统，好让运维人员发现问题，因此，它对应的紧急程度比较高。

    批量上报和区块上报的区别：批量上报是一次上报一定条数，比如每 2 分钟上报 1000 条，直到上报完成。而区块上报是在异常发生之后，马上收集和异常相关的所有日志，查询出哪些日志已经由批量上报上报过了，剔除掉，把其他相关日志上传，和异常相关的这些日志相对而言更重要一些，它们可以帮助尽快复原异常现场，找出发生异常的根源。

    用户提交的反馈信息，则可以慢悠悠上报上去。

### 阶段性指标

| 字段      | 描述                                   | 计算方式                                              | 备注                                                           |
| --------- | -------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| unload    | 前一个页面卸载耗时                     | unloadEventEnd-unloadEventStart                       | 前一个页面卸载时可能监听了 unload 做些数据收集，会影响页面跳转 |
| redirect  | 重定向耗时                             | redirectEnd - redirectStart                           | 过多重定向影响性能                                             |
| appCache  | 缓存耗时                               | domainLookupStart - fetchStart                        |                                                                |
| tcp       | TCP 连接耗时                           | connectEnd - connectStart                             |                                                                |
| DNS       | 解析耗时                               | domainLookupEnd - domainLookupStart                   |                                                                |
| ssl       | SSL 安全连接耗时                       | connectEnd - secureConnectionStart                    | 只在 HTTPS 下有效                                              |
| ttfb      | Time to First Byte(TTFB)，网络请求耗时 | responseStart - requestStart                          |                                                                |
| response  | 数据传输耗时                           | responseEnd - responseStart                           |                                                                |
| dom       | 可交互 DOM 解析耗时                    | domInteractive - responseEnd                          | Interactive content                                            |
| dom2      | 剩余 DOM 解析耗时                      | domContentLoadedEventStart - domInteractive           | DOMContentLoaded 所有 DOM 元素都加载完毕(除了 async script)    |
| DCL       | DOMContentLoaded 事件耗时              | domContentLoadedEventEnd - domContentLoadedEventStart | document.addEventListener('DOMContentLoaded', cb)              |
| resources | 资源加载耗时                           | loadEventStart - domContentLoadedEventEnd             | 完整 DOM(DOMContentLoaded)到资源加载完毕(window.onLoad)时间    |
| onLoad    | onLoad 事件耗时                        | loadEventEnd - loadEventStart                         |                                                                |

### 关键性指标

| 字段      | 描述                                      | 计算方式                                                                                        | 备注                                                              |
| --------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| firstbyte | 首包时间                                  | responseStart - domainLookupStart                                                               |                                                                   |
| fpt       | First Paint Time, 首次渲染时间 / 白屏时间 | responseEnd - fetchStart                                                                        | 从请求开始到浏览器开始解析第一批 HTML 文档字节的时间差            |
| tti       | Time to Interact，首次可交互时间          | domInteractive - fetchStart                                                                     | 浏览器完成所有 HTML 解析并且完成 DOM 构建，此时浏览器开始加载资源 |
| ready     | HTML 加载完成时间， 即 DOM Ready 时间     | domContentLoadedEventEnd - fetchStart 如果页面有同步执行的 JS，则同步 JS 执行时间 = ready - tti |                                                                   |
| load      | 页面完全加载时间                          | loadEventStart - fetchStart                                                                     | load = 首次渲染时间 + DOM 解析耗时 + 同步 JS 执行 + 资源加载耗时  |

### 小程序

| 字段 | 描述                           | 计算方式                             | 备注                                             |
| ---- | ------------------------------ | ------------------------------------ | ------------------------------------------------ |
| fpt  | First Paint Time, 首次渲染时间 | onShow (first page) - onLaunch (app) | 小程序从 onLaunch 到第一个页面 onShow 之间的时间 |

### 常规用法

```js
const t = performance.timing

const pageloadtime = t.loadEventStart - t.navigationStart,
	dns = t.domainLookupEnd - t.domainLookupStart,
	tcp = t.connectEnd - t.connectStart,
	ttfb = t.responseStart - t.navigationStart
```

```js
const r0 = performance.getEntriesByType('resource')[0]

const loadtime = r0.duration,
	dns = r0.domainLookupEnd - r0.domainLookupStart,
	tcp = r0.connectEnd - r0.connectStart,
	ttfb = r0.responseStart - r0.startTime
```

### 注意事项

1. 计算 HTML 文档请求使用 Nav Timing

    获取主页 html 数据，应该使用 performance.timing，而不是 performance.getEntriesByType('resource')[0]。

    performance.getEntriesByType('resource') 表示当前 HTML 文档中引用的所有静态资源信息，不包括本身 HTML 信息。

    如果当前不包含任何静态资源那么 performance.getEntriesByType('resource') === [] 使用 [0].xx 会报错。

2. 计算静态资源使用 getEntriesByType('resource') 代替 getEntries()

    getEntries() 包含以下六种类型

    - navigation
    - resource
    - mark
    - measure
    - paint
    - frame

    在比较老的浏览器中，getEntries() 通常情况下一般只有 resource 类型等同于 getEntriesByType('resource')。因为 navigation 是 Navigation Timing 2 规范，老的浏览器不支持。而 mark 和 measure 是 User Timing 用户自定义类型。

    最后两个对于目前（2020 年) 来说实现的浏览器就更少了。

    所有使用 getEntries() 来检索静态资源都需要过滤其他几种类型，getEntriesByType('resource') 就很明确。

3. secureConnectionStart 问题

    secureConnectionStart 用来测量 SSL 协商 所花费的时间，可能有三种值

    - undefined，浏览器不支持该属性；
    - 0，未使用 HTTPS；
    - timestamp 时间戳，使用了 HTTPS

    chrome 很老的版本有一个 bug，当获取资源复用了已建立的 HTTPS 信道时，secureConnectionStart 设置为 0 了，按标准应该设置为时间戳。

    取值时应该避免不支持和未使用的情况

    ```js
    const r0 = performance.getEntriesByType('resource')[0]
    if (r0.secureConnectionStart) {
    	const ssl = r0.connectEnd - r0.secureConnectionStart
    }
    ```

4. 跨域资源设置响应头 Timing-Allow-Origin
   获取页面资源时间详情时，有跨域的限制。默认情况下，跨域资源以下属性会被设置为 0

    ```js
    redirectStart
    redirectEnd
    domainLookupStart
    domainLookupEnd
    connectStart
    connectEnd
    secureConnectionStart
    requestStart
    responseStart
    ```

    - 对于可控跨域资源例如自家 CDN，Timing-Allow-Origin 的响应头 origins 至少得设置了主页面的域名，允许获取资源时间。
    - 一般对外公共资源设置为 Timing-Allow-Origin: \*。
    - 对于第三方不可控资源且未设置 Timing-Allow-Origin 头，应该过滤掉这些无效数据。

    如果未正确设置 Timing-Allow-Origin 的话

    - 未做过滤，那么上报的数据会极大优于用户实际使用情况；
    - 做了过滤，那么上了跨域 CDN 的资源也无法上报数据，导致分析不出上了 CDN 的优势。

    ```js
    // Resource Timing
    const r0 = performance.getEntriesByType('resource')[0],
    	loadtime = r0.duration

    // 只要选取上述一个属性(除了secureConnectionStart)进行判断即可
    if (r0.requestStart) {
    	const dns = r0.domainLookupEnd - r0.domainLookupStart,
    		tcp = r0.connectEnd - r0.connectStart,
    		ttfb = r0.responseStart - r0.startTime
    }

    let ssl = 0 // 默认为 0，当然也可以在数据库层面去做
    // 使用了 HTTPS 在计算
    if (r0.secureConnectionStart) {
    	ssl = r0.connectEnd - r0.secureConnectionStart
    }
    ```

5. 注意属性值为 0 的含义
   上面我们知道了

    1. 未使用 HTTPS 时，secureConnectionStart === 0
    2. 跨域且未设置正确的 Timing-Allow-Origin 时，有若干属性值为 0

    - DNS 解析时间 domainLookupEnd - domainLookupStart === 0

    1. 和 HTML 同域名下的资源，DNS 时间可能均为 0，因为浏览器会缓存当前解析域名的 IP；
    2. 浏览器预解析了 DNS 并缓存，<link rel="dns-prefetch" href="//cross-domain.com" />。

    - TCP 建立连接时间 connectEnd – connectStart === 0

        1. 例如浏览器与每台主机大概能同时建立 6 个独立的 TCP 连接，那么头 6 个资源的 TCP 非零，剩余的 keep-alive 信道复用 TCP 时间为 0

    - SSL connectEnd – secureConnectionStart === 0

        1. 与 TCP 相同
        2. 未使用 HTTPS

    总之，为零有很多场景，注意区分。

    1. 不支持
    2. 未使用
    3. 复用
    4. 缓存
    5. 安全原因不予显示
    6. ...

6. 304
   很老的 chrome 版本有个 bug，在 200 有 Timing-Allow-Origin 未在 304 时设置，
   导致上述很多属性未能设置为时间戳类型而是 0。

那么问题来了

你在 布局边界 Layout Boundaries #4 中过滤了 304 的情况，只统计了 200 的情况，众所周知 304 缓存技术明细优于非缓存的 200。
这会拉低的你平均统计性能。
如果不过滤，那又会获得比 304 还优的性能统计。
碰到这种情况暂时就没办法区分了，幸运的是 chrome 在 version 37 时修复了。

PS：iframe 与文档环境是相互隔离的，你可以获取 iframe 的 contentWindow.performance 来获取。

FP 白屏（First Paint Time ）： 从页面开始加载到浏览器中检测到渲染（任何渲染）时被触发（例如背景改变，样式应用等）

> 白屏时间过长，会让用户认为我们的页面不能用或者可用性差

FCP 首屏（first contentful paint ）：从页面开始加载到页面内容的任何部分呈现在屏幕上的时间。

> 关注的焦点是内容，这个度量可以知道用户什么时候收到有用的信息（文本，图像等），通常情况下，FP 和 FCP 值是一样的

FMP 首次有效绘制（First Meaningful Paint ）： 表示页面的“主要内容” 开始出现在屏幕上的时间点，这项指标因页面逻辑而异，因此上不存在任何规范。

LCP （Largest Contentful Paint ）：LCP 指标代表的是视窗最大可见图片或者文本块的渲染时间。

长任务（Long Task）：当一个任务执行时间超过 50ms 时消耗到的任务

> 50ms 阈值是从 RAIL 模型总结出来的结论，这个是 google 研究用户感知得出的结论，类似永华的感知/耐心的阈值，超过这个阈值的任务，用户会感知到页面的卡顿

TTI （Time To Internative）：从页面开始到它的主要子资源加载到能够快速地响应用户输入的时间。（没有耗时长任务）

首次输入延时 FID （first Input Delay）：从用户第一次与页面交互到浏览器实际能够开始处理事件的时间。（点击，输入，按键）

// DNS 解析时间
dnst: domainLookupEnd - domainLookupStart

//TCP 建立时间
tcpt: connectEnd - connectStart

// 白屏时间
wit: responseStart - navigationStart

//dom 渲染完成时间
domt: domContentLoadedEventEnd - navigationStart

//页面 onload 时间
lodt: loadEventEnd - navigationStart

// 页面准备时间
radt: fetchStart - navigationStart

// 页面重定向时间
rdit: redirectEnd - redirectStart

// unload 时间
uodt: unloadEventEnd - unloadEventStart

//request 请求耗时
reqt: responseEnd - requestStart

//页面解析 dom 耗时
andt: domComplete - domInteractive
