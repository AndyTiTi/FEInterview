---
title: 第一章
---

![image](/http-roadmap.png)
![image](/httptcpip.png)

## Web 是什么？

web 是一种基于超文本和 HTTP 的全球的动态交互的跨平台的分布式图形信息系统，建立在 Internet 上的一种网络服务，为浏览者提供易于访问的直观界面。

## UDP

首先 UDP 协议是面向无连接的，也就是说不需要在正式传递数据之前进行三次握手建立连接。然后 UDP 协议只是数据报文的搬运工，不保证有序且不丢失的传递到对端，并且 UDP 协议也没有任何控制流量的算法，总的来说 UDP 相较于 TCP 更加的轻便。

-   网络环境时好时坏，但是 UDP 因为没有拥塞控制，一直会以恒定的速度发送数据。在某些实时性要求高的场景（比如电话会议）就需要使用 UDP 而不是 TCP。
-   因此 UDP 的头部开销小，只有八字节，相比 TCP 的至少二十字节要少得多，在传输数据报文时是很高效的。
-   UDP 不止支持一对一的传输方式，同样支持一对多，多对多，多对一的方式，也就是说 UDP 提供了单播，多播，广播的功能。

#### 适合使用的场景（用户肯定关注的是最新的画面，而不是老旧的画面）

-   直播
-   王者荣耀
    TCP 会严格控制传输的正确性，一旦有某一个数据对端没有收到，就会停止下来直到对端收到这个数据。这种问题在网络条件不错的情况下可能并不会发生什么事情，但是在网络情况差的时候就会变成画面卡住，然后再继续播放下一帧的情况。

## TCP

TCP 基本是和 UDP 反着来，建立连接断开连接都需要先需要进行握手。在传输数据的过程中，通过各种算法保证数据的可靠性，当然带来的问题就是相比 UDP 来说不那么的高效。TCP 连接建立完后都能发送和接收数据，所以 TCP 是一个全双工的协议。
对于 TCP 头部来说，以下几个字段是很重要的

-   Sequence number，这个序号保证了 TCP 传输的报文都是有序的，对端可以通过序号顺序的拼接报文
-   Acknowledgement Number，这个序号表示数据接收端期望接收的下一个字节的编号是多少，同时也表示上一个序号的数据已经收到
-   Window Size，窗口大小，表示还能接收多少字节的数据，用于流量控制
-   标识符
    -   URG=1：该字段为一表示本数据报的数据部分包含紧急信息，是一个高优先级数据报文，此时紧急指针有效。紧急数据一定位于当前数据包数据部分的最前面，紧急指针标明了紧急数据的尾部。
    -   ACK=1：该字段为一表示确认号字段有效。此外，TCP 还规定在连接建立后传送的所有报文段都必须把 ACK 置为一。
    -   PSH=1：该字段为一表示接收端应该立即将数据 push 给应用层，而不是等到缓冲区满后再提交。
    -   RST=1：该字段为一表示当前 TCP 连接出现严重问题，可能需要重新建立 TCP 连接，也可以用于拒绝非法的报文段和拒绝连接请求。
    -   SYN=1：当 SYN=1，ACK=0 时，表示当前报文段是一个连接请求报文。当 SYN=1，ACK=1 时，表示当前报文段是一个同意建立连接的应答报文。
    -   FIN=1：该字段为一表示此报文段是一个释放连接的请求报文。

#### TCP 可靠传输的基本原理

-   即超时重传机制，通过确认和超时机制保证了数据的正确送达，ARQ 协议包含停止等待 ARQ 和连续 ARQ 两种协议。

-   `停止等待 ARQ`：只要发送一段报文，都要停止发送并启动一个定时器，等待对端回应，在定时器时间内接收到对端应答就取消定时器并发送下一段报文。若出现丢包超时或输过程中报文出错，就会再次发送数据直到对端响应，所以需要每次都备份发送的数据。

-   `连续 ARQ`：在连续 ARQ 中，发送端拥有一个发送窗口，可以在没有收到应答的情况下持续发送窗口内的数据，通过累计确认，可以在收到多个报文以后统一回复一个应答报文，告诉发送端这个序号之前的数据已经全部接收到了，相比停止等待 ARQ 协议来说减少了等待时间，提高了效率，弊端在于可能造成重复发送数据的情况（7 号已经正确接收而 6 号丢失）

为了实现可靠性传输，需要考虑很多事情，例如数据的破坏、丢包、重复以及分片顺序混乱等问题。如不能解决这些问题，也就无从谈起可靠传输。

那么，TCP 是通过序列号、确认应答、重发控制、连接管理以及窗口控制等机制实现可靠性传输的。

#### TCP 针对数据包丢失的情况，会用重传机制解决

-   超时重传

    重传机制的其中一个方式，就是在发送数据时，设定一个定时器，当超过指定的时间后，没有收到对方的 ACK 确认应答报文，就会重发该数据，也就是我们常说的超时重传。

    TCP 会在以下两种情况发生超时重传：

    -   数据包丢失

    -   确认应答丢失

    超时时间应该设置为多少呢？

    如果超时重发的数据，再次超时的时候，又需要重传的时候，TCP 的策略是超时间隔加倍。

    也就是每当遇到一次超时重传的时候，都会将下一次超时时间间隔设为先前值的两倍。两次超时，就说明网络环境差，不宜频繁反复发送。

    超时触发重传存在的问题是，超时周期可能相对较长。那是不是可以有更快的方式呢？

    于是就可以用「快速重传」机制来解决超时重发的时间等待。

-   快速重传

-   SACK

-   D-SACK

![TCP协议的可靠传输](/tcp9.png)

#### TCP 流量控制

-   在 TCP 中，两端其实都维护着窗口：分别为发送端窗口和接收端窗口。
-   发送端窗口包含已发送但未收到应答的数据和可以发送但是未发送的数据
-   发送端窗口是由接收窗口剩余大小决定的。接收方会把当前接收窗口的剩余大小写入应答报文，发送端收到应答后根据该值和当前网络拥塞情况设置发送窗口的大小，所以发送窗口的大小是不断变化的。
-   实现了流量控制的功能
-   出现零窗口情况时，发送端会停止发送数据，并定时发送请求给对端，让对端告知窗口大小。在重试次数超过一定次数后，可能会中断 TCP 链接

![TCP协议的流量控制](/rwnd2.png)

#### TCP 拥塞控制

-   慢启动：连接开始时，最初 cwnd（拥塞窗口）=1 MSS（最大报文长度），每过一个 RTT，发送速率翻倍，起始慢，慢启动阶段指数增长，直到：
    -   出现超时指示的丢包事件，将 cwnd 设为 1 并重新开始慢启动，将 ssthresh（慢启动阈值）设为 ssthresh/2
    -   cwnd 等于 ssthresh 时结束慢启动转移至拥塞避免模式
    -   检测到三个冗余 ACK 进行快速重传并进入快速恢复状态
-   拥塞避免：每个 RTT 只增加 1 个 MSS
    -   出现超时，cwnd 设为 1 个 MSS，ssthresh 更新为 cwnd/2
    -   出现三个冗余 ACK 时，cwnd 减半，ssthresh 更新为 cwnd/2，进入快速恢复状态
-   快速恢复
    -   对引起进入快速恢复的缺失报文段，对收到的每个冗余 ACK，cwnd 增加 1 个 MSS，最终当对丢失报文段的一个 ACK 到达时，降低 cwnd 后进入拥塞避免状态
    -   如果出现超时，cwnd 设为 1 并 ssthresh 更新为 cwnd 的一半，迁移到慢启动状态

![image](/db_tplv.jpg)

流量控制考虑点对点的通信量的控制
拥塞控制考虑整个网络，是全局性的考虑

> 拥塞控制是一种用来调整传输控制协议（TCP）连接单次发送的分组数量的算法。它通过增减单次发送量逐步调整，使之逼近当前网络的承载量。

简单易懂的话来说，所谓的拥塞控制，从字面的意思来讲，网络通信就像是一个水管里的水，如果水突然因为水管的赃物阻塞了，那么我们就应该采取一定的策略，让其在阻塞的时候如何处理。

其实我们也不知道接收端有没有接收，数据包到底在哪一步出现了问题呢？分为两种情况，如下：

1. 数据包真的在半路丢失了。
2. 网络通信处于拥挤状态，数据包还没有到达接收方。

> 我们的拥塞控制是主要针对于第二种情况的。如果网络信道中一直处于拥挤状态，那么发送端一直进行发送，就会变得更加的阻塞，而且同时白白浪费掉了网络的资源。

慢启动算法 1,2,4,8,16
拥塞避免算法 16,17,18,19

[你还在为 TCP 重传、滑动窗口、流量控制、拥塞控制发愁吗？](https://juejin.cn/post/6854573218683387917#heading-14)

#### 为什么进行拥塞控制？

如果发送端要给接收端发送数据，只有当接收端接收到数据时，才会给发送端返回应答信息。如果接收端没有发送应答信息，发送端则认为该数据已经丢失，则进行重新发送。

#### TCP 三次握手

-   第一次握手
    客户端向服务端发送带有 SYN 请求标志的连接请求报文段，该报文段中包含自身的数据通讯初始序号。请求发送后，客户端便进入 SYN-SENT 状态。
-   第二次握手
    服务端收到连接请求 SYN 报文段后，如果同意连接，则会发送一个 ACK 信息对这个 SYN 报文段进行应答确认，还要发送自己的 SYN 请求信息，并将上述信息放到一个报文段（SYN+ACK 报文段）中，一并发送给客户端，发送完成后便进入 SYN-RECEIVED 状态。
-   第三次握手
    当客户端收到服务端的 SYN+ACK 报文段后，还要向服务端发送一个 ACK 确认报文段。客户端发完这个报文段后便进入 ESTABLISHED 状态，服务端收到这个应答后也进入 ESTABLISHED 状态，此时连接建立成功，完成了 TCP 三次握手。

#### 为什么 TCP 建立连接需要三次握手

![image](/syn.png)

1. 双方都知道对方发送和接收能力都是正常的

2. 因为这是为了防止出现失效的连接请求报文段被服务端接收的情况，从而产生错误。

客户端发送了一个连接请求 A，但是因为网络原因造成了超时，这时 TCP 会启动超时重传的机制再次发送一个连接请求 B。

此时请求顺利到达服务端，服务端应答完就建立了请求，然后接收数据后释放了连接。

假设这时候连接请求 A 在两端关闭后终于抵达了服务端，那么此时服务端会认为客户端又需要建立 TCP 连接，从而应答了该请求并进入 ESTABLISHED 状态。但是客户端其实是 CLOSED 的状态，那么就会导致服务端一直等待，造成资源的浪费。

#### 断开连接四次握手

-   第一次握手

若客户端 A 认为数据发送完成，则它需要向服务端 B 发送连接释放请求。

-   第二次握手

B 收到连接释放请求后，会告诉应用层要释放 TCP 链接。然后会发送 ACK 包，并进入 CLOSE_WAIT 状态，此时表明 A 到 B 的连接已经释放，不再接收 A 发的数据了。但是因为 TCP 连接是双向的，所以 B 仍旧可以发送数据给 A。

-   第三次握手

B 如果此时还有没发完的数据会继续发送，完毕后会向 A 发送连接释放请求，然后 B 便进入 LAST-ACK 状态。

-   第四次握手

A 收到释放请求后，向 B 发送确认应答，此时 A 进入 TIME-WAIT 状态。该状态会持续 2MSL（即两倍的 MSL`Maximum Segment Life`最大段生存期，指报文段在网络中生存的时间，超时会被抛弃） 时间，若该时间段内没有 B 的重发请求的话，就进入 CLOSED 状态。当 B 收到确认应答后，也便进入 CLOSED 状态。

#### 为什么 A 要进入 TIME-WAIT 状态，等待 2MSL 时间后才进入 CLOSED 状态？

为了保证 B 能收到 A 的确认应答。若 A 发完确认应答后直接进入 CLOSED 状态，如果确认应答因为网络问题一直没有到达，那么会造成 B 不能正常关闭。

## HEAD 请求

跟 GET 方法相同，只不过服务器响应时不会返回消息体。一个 HEAD 请求的响应中，HTTP 头中包含的元信息应该和一个 GET 请求的响应消息相同。这种方法可以用来获取请求中隐含的元信息，而不用传输实体本身。也经常用来测试超链接的有效性、可用性和最近的修改

1. 只请求资源的首部；
2. 检查超链接的有效性；
3. 检查网页是否被修改；
4. 多用于自动搜索机器人获取网页的标志信息，获取 rss 种子信息，或者传递安全认证信息等

## HTTP 状态码

> 考点：201、206 了解吗？

1. 1xx：指示信息--表示请求已接收，继续处理。
2. 2xx：成功--表示请求已被成功接收、理解、接受。

    - 200 OK 正常返回信息
    - 201 Created 请求成功并且服务器创建了新的资源
    - 202 Accepted 服务器已接受请求，但尚未处理
    - 204 No Content 服务器接收的请求已成功处理，但返回的响应报文中不含实体的主体部分
    - 206 Partical Content 客户端进行了范围请求，服务器成功执行了这部分 GET 请求，响应报文中包含由 Content-Range 指定范围的实体内容

3. 3xx：重定向--要完成请求必须进行更进一步的操作。

    - 301 Moved Permanently 请求的网页已永久移动到新位置，以后应使用资源现在所指的 URI
    - 302 Found 临时性重定向，希望本次能使用新的 URI 访问
    - 303 See Other 临时性重定向，且总是使用 GET 请求新的 URI
    - 304 Not Modified 自从上次请求后，请求的网页未修改过
    - 307 Temporary Redirect 与 302 有相同含义，但不会从 POST 变成 GET

4. 4xx：客户端错误--请求有语法错误或请求无法实现。

    - 400 Bad Request 服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求
    - 401 Unauthorized 第一次返回表示需要认证，第二次返回表示认证失败
    - 403 Forbidden 禁止访问
    - 404 Not Found 找不到如何与 URI 相匹配的资源

5. 5xx：服务器端错误--服务器未能实现合法的请求。常见状态代码、状态描述的说明如下。
    - 500 Internal Server Error 服务器执行请求时发生错误
    - 503 Service Unavailable 服务器端暂时无法处理请求（可能是过载或维护）

## HTTP 报文结构

#### HTTP 请求报文结构

-   首行是 Request-Line 包括：请求方法，请求 URI，协议版本，CRLF
-   首行之后是若干行请求头，包括通用头部，请求头部，实体头部，每个一行以 CRLF 结束
-   请求头和消息实体之间有一个 CRLF 分隔
-   根据实际请求需要可能包含一个消息实体 一个请求报文例子如下

![image](/http-content.jpg)

#### HTTP 响应报文结构

-   首行是状态行包括：HTTP 版本，状态码，状态描述，后面跟一个 CRLF
-   首行之后是若干行响应头，包括：通用头部，响应头部，实体头部
-   响应头部和响应实体之间用一个 CRLF 分隔
-   最后是一个可能的消息实体 响应报文例子如下

![image](/http-content7.jpg)

## HTTP 协议的瓶颈

1. 一次只能发送一个请求（单路连接，请求低效）
2. 请求只能从客户端开始，不可以接受除了响应以外的指令
3. 请求、响应头部不经过压缩就发送
4. 每次互相发送相同的头部造成浪费（头部冗余）
5. 非强制压缩发送

#### HTTP1.0 与 HTTP1.1 区别

-   **长连接**

    HTTP/1.0 默认使用短连接，每次请求都要重新建立连接。开销会比较大。HTTP 1.1 起，默认使用长连接 ,默认开启 Connection：keep-alive。 可以用长连接来发多个请求。
    有非流水线和流水线方式。流水线方式是客户在收到 HTTP 的响应报文之前就能接着发送新的请求报文。与之相对应的非流水线方式是客户在收到前一个响应后才能发送下一个请求

-   **错误状态响应码**

    在 HTTP1.1 中新增了 24 个错误状态响应码，如 410（Gone）表示服务器上的某个资源被永久性的删除。

-   **缓存处理**

    HTTP1.0 主要使用 header 里的 If-Modified-Since,Expires 来做为缓存判断的标准
    HTTP1.1 则引入了更多的缓存控制策略例如 Entity tag，If-None-Match 等更多可供选择的缓存头来控制缓存策略。

-   **带宽优化**

    HTTP1.0 中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能
    HTTP1.1 允许只请求资源的某个部分，返回码是 206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接

#### 探索式的实践 SPDY

> 还未推广开就被 HTTP/2 替代

1. 多路复用 请求优化（一个 SPDY 连接内，可以有无限个并行请求，多个并发的 http 请求共用一个 tcp 会话）
2. 支持服务器推送技术（资源类推送，比如 style.css）
3. SPDY 压缩了 HTTP 头
4. 强制使用 SSL 传输协议

## HTTP/2

> **起因:** 在 HTTP/1 中，为了性能考虑，我们会引入雪碧图、将小图内联、使用多个域名等等的方式。这一切都是因为浏览器限制了同一个域名下的请求数量（Chrome 下一般是限制六个连接），当页面中需要请求很多资源的时候，队头阻塞（Head of line blocking）会导致在达到最大请求数量时，剩余的资源需要等待其他资源请求完成后才能发起请求。

> **※ 性能增强的核心点【二进制分帧】:** 在之前的 HTTP 版本中，我们是通过文本的方式传输数据。在 HTTP/2 中引入了新的编码机制，所有传输的数据都会被分割，并采用二进制格式编码。

> **优点：** HTTP/2 通过多路复用、二进制分帧、Header 压缩等等技术，极大地提高了性能，但是还是存在着问题的

> **缺点：**

1. HTTP/2 使用多路复用，同一域名下只需要使用一个 TCP 连接。当连接中出现了丢包的情况，整个 TCP 都要开始等待重传，也就导致了后面的所有数据都被阻塞，表现情况反倒不如 HTTP/1。对于 HTTP/1 来说，开启多个 TCP 连接，出现这种情况只会影响其中一个连接，剩余的还可以正常传输数据。
2. 这个问题是底层支撑的 TCP 协议的问题。那么就会有人考虑到去修改 TCP 协议，但这已经是一件不可能完成的任务了。因为 TCP 存在的时间太长，已经充斥在各种设备中，并且这个协议是由操作系统实现的，更新起来不大现实。
3. 基于这个原因，Google 就更起炉灶搞了一个基于 UDP 协议的 QUIC 协议，并且使用在了 HTTP/3 上，HTTP/3 最大的改造就是使用了 QUIC。

> **解决方案：** QUIC 基于 UDP 实现，是 HTTP/3 中的底层支撑协议，该协议基于 UDP，又取了 TCP 中的精华，实现了即快又可靠的协议

#### Header 压缩

-   在 HTTP/1 中，我们使用文本的形式传输 header，在 header 携带 cookie 的情况下，可能每次都需要重复传输几百到几千的字节。
-   在 HTTP/2 中，传输的 header 进行编码，减少了 header 的大小。并在两端维护了索引表，用于记录出现过的 header ，后面在传输过程中就可以传输已经记录过的 header 的键名，对端收到数据后就可以通过键名找到对应的值。

#### 多路复用

-   在 HTTP/1 中，为了性能考虑，我们会引入雪碧图、使用多个域名等等的方式。这一切都是因为浏览器限制了同一个域名下的请求数量，当页面中需要请求很多资源的时候，队头阻塞会导致在达到最大请求数量时，剩余的资源需要等待其他资源请求完成后才能发起请求
-   在 HTTP/2 中引入了多路复用技术，可以只通过一个 TCP 连接就可以传输所有的请求数据。解决了浏览器限制同一个域名下的请求数量的问题，也更容易实现全速传输，新开一个 TCP 连接需要慢慢提升传输速度
-   在 HTTP/2 中，有两个非常重要的概念，分别是帧（frame）和流（stream）
    帧代表着最小的数据单位，每个帧会标识出该帧属于哪个流，流也就是多个帧组成的数据流
-   多路复用，就是在一个 TCP 连接中可以存在多条流。也就是可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。通过这个技术，可以避免 HTTP 旧版本中的队头阻塞问题，极大的提高传输性能

#### 服务端 Push

在 HTTP/2 中，服务端可以在客户端某个请求后，主动推送其他资源。可以想象以下情况，某些资源客户端是一定会请求的，这时就可以采取服务端 push 的技术，提前给客户端推送必要的资源，这样就可以相对减少一点延迟时间。当然在浏览器兼容的情况下你也可以使用 prefetch 。

#### 升级 HTTP/2 的前提条件

由于现在所有支持 HTTP/2 的浏览器都强制只使用 TLS(https) 连接，所以：获取证书，并且让服务器支持 https 是必须的先决条件

## HTTP/3

#### HTTP/2 存在的问题

-   HTTP/2 使用多路复用，同一域名下只需要使用一个 TCP 连接。当连接中出现了丢包的情况，整个 TCP 都要开始等待重传，也就导致了后面的所有数据都被阻塞，表现情况反倒不如 HTTP/1。对于 HTTP/1 来说，开启多个 TCP 连接，出现这种情况只会影响其中一个连接，剩余的还可以正常传输数据。
-   这个问题是底层支撑的 TCP 协议的问题。那么就会有人考虑到去修改 TCP 协议，但这已经是一件不可能完成的任务了。因为 TCP 存在的时间太长，已经充斥在各种设备中，并且这个协议是由操作系统实现的，更新起来不大现实。
-   基于这个原因，Google 就更起炉灶搞了一个基于 UDP 协议的 QUIC 协议，并且使用在了 HTTP/3 上，HTTP/3 最大的改造就是使用了 QUIC。

#### QUIC

QUIC 基于 UDP，但是在原本的基础上新增了多路复用、0-RTT、使用 TLS1.3 加密、流量控制、有序交付、重传等等功能。

#### 多路复用

-   虽然 HTTP/2 支持了多路复用，但是 TCP 协议终究是没有这个功能的。QUIC 原生就实现了这个功能，并且传输的单个数据流可以保证有序交付且不会影响其他的数据流。
-   QUIC 在移动端的表现也会比 TCP 好。因为 TCP 是基于 IP 和端口去识别连接的，这种方式在多变的移动端网络环境下是很脆弱的。但是 QUIC 通过 ID 的方式去识别一个连接，不管网络环境如何变化，只要 ID 不变，就能迅速重连。

#### 0-RTT

-   对于 TCP 连接需要 1RTT，对于 HTTPS 这种应用而言，由于还需要额外的 TLS 握手，需要 3RTT。而 QUIC 可以做到 0RTT，即通信双方发起通信连接时，第一个数据包便可以携带有效的业务数据
-   如果一对使用 QUIC 进行加密通信的双方此前从来没有通信过，那么 0RTT 是不可能的，如果客户机与服务器彼此之间曾经建立 TLS 连接，则可以使用从该会话缓存的信息来建立新的 TLS 连接，而不必从头协商，即第一次连接断开后，缓存当前会话的上下文，在下次恢复会话的时候，只需要将之前的缓存传递给服务端验证通过就可以进行传输了。

#### 纠错机制

假如说这次我要发送三个包，那么协议会算出这三个包的异或值并单独发出一个校验包，也就是总共发出四个包。当出现其中的非校验包丢包的情况时，可以通过另外三个包计算出丢失的数据包的内容。当然这种技术只能使用在丢失一个包的情况下，如果出现丢失多个包就不能使用纠错机制了，只能使用重传的方式。

## HTTPS

#### HTTPS 使用成本

1. 证书费用以及更新维护
2. 降低用户访问速度
3. 消耗 CPU 资源，需要增加大量机器

#### HTTP 的不足

-   通信使用明文（不加密），内容可能会被窃听；
-   不验证通信方的身份，有可能遭遇伪装；
-   无法证明报文的完整性，有可能已遭篡改；

#### HTTP +加密+认证+完整性保护=HTTPS

HTTPS 是安全版的 HTTP，不是一个新的协议，而是 HTTP 加上加密处理、认证以及完整性保护。通信接口部分先和 SSL 通信，再由 SSL 和 TCP 通信。所谓 HTTPS，其实就是身披 SSL 协议这层外壳的 HTTP。

#### HTTPS 如何保证通信安全？

**TLS(transport layer security)安全传输层协议**

**SSL (Secure Sockets Layer)安全套接字协议**

HTTPS（securely transferring web pages）服务器，默认端口号为 443/tcp 443/udp

1. 内容加密
2. 身份认证
3. 数据完整性

![image](/https.jpg)
![image](/accw.jpg)

1. 服务端将公钥发给证书颁发机构，向证书颁发机构申请证书。
2. 证书颁发机构有自己的密钥对，机构用自己的私钥加密服务端传来的 key1，并通过服务端网址等信息生成一个数字签名证书，证书同样经过机构的私钥加密。机构把证书发送给服务端。
3. 浏览器向服务端请求通信，服务端返回证书。【非对称密钥加密 start】
4. 客户端收到证书以后，要做的第一件事情是验证证书的真伪。需要说明的是，各大浏览器和操作系统已经维护了所有权威证书机构的名称和公钥。所以客户端只需要知道是哪个机构颁布的证书，就可以从本地找到对应的机构公钥，解密出证书签名。浏览器按照同样的签名规则，自己也生成一个证书签名，如果两个签名一致，说明证书是有效的。
5. 验证成功后，浏览器再次利用机构公钥，解密出服务端的公钥 Key1。【非对称密钥加密 end】
6. 浏览器生成自己的对称内容加密密钥 Key2，并且用服务端公钥 Key1 加密 Key2，发送给服务端
7. 服务端用自己的私钥解开加密，得到对称内容加密密钥 Key2。于是两人开始用 Key2 进行对称内容加密的通信。

:::tip 加密方式

1. 握手期间密钥非对称加密算法（RSA）
2. 握手后传输数据对称加密（AES/DES）
3. 证书信息摘要算法（SHA1/SHA256/MD5）
   :::

#### HTTPS 对性能的影响

1. 协议交互所增加的网络 RTT(Round-Trip Time)往返时延
2. 加解密需要的网络耗时
   ![image](/https-ack2.png)

## 输入 URL 到页面渲染的整个流程

当你在浏览器中想访问 www.google.com 时，会进行一下操作：

-   操作系统会首先在本地缓存中查询 IP
-   没有的话会去系统配置的 DNS 服务器中查询
-   如果这时候还没得话，会直接去 DNS 根服务器查询，这一步查询会找出负责 com 这个一级域名的服务器
-   然后去该服务器查询 google 这个二级域名
-   接下来三级域名的查询其实是我们配置的，你可以给 www 这个域名配置一个 IP，然后还可以给别的三级域名配置一个 IP
    接下来是 TCP 握手，应用层会下发数据给传输层，这里 TCP 协议会指明两端的端口号，然后下发给网络层。网络层中的 IP 协议会确定 IP 地址，并且指示了数据传输中如何跳转路由器。然后包会再被封装到数据链路层的数据帧
    中，最后就是物理层面的传输了。

在这一部分中，可以详细说下 TCP 的握手情况以及 TCP 的一些特性。

当 TCP 握手结束后就会进行 TLS 握手，然后就开始正式的传输数据。

在这一部分中，可以详细说下 TLS 的握手情况以及两种加密方式的内容。

数据在进入服务端之前，可能还会先经过负责负载均衡的服务器，它的作用就是将请求合理的分发到多台服务器上，这时假设服务端会响应一个 HTML 文件。

首先浏览器会判断状态码是什么，如果是 200 那就继续解析，如果 400 或 500 的话就会报错，如果 300 的话会进行重定向，这里会有个重定向计数器，避免过多次的重定向，超过次数也会报错。

浏览器开始解析文件，如果是 gzip 格式的话会先解压一下，然后通过文件的编码格式知道该如何去解码文件。

文件解码成功后会正式开始渲染流程，先会根据 HTML 构建 DOM 树，有 CSS 的话会去构建 CSSOM 树。如果遇到 script 标签的话，会判断是否存在 async 或者 defer ，前者会并行进行下载并执行 JS，后者会先下载文件，然后等待 HTML 解析完成后顺序执行。

如果以上都没有，就会阻塞住渲染流程直到 JS 执行完毕。遇到文件下载的会去下载文件，这里如果使用 HTTP/2 协议的话会极大的提高多图的下载效率。

CSSOM 树和 DOM 树构建完成后会开始生成 Render 树，这一步就是确定页面元素的布局、样式等等诸多方面的东西

在生成 Render 树的过程中，浏览器就开始调用 GPU 绘制，合成图层，将内容显示在屏幕上了。

这一部分就是渲染原理中讲解到的内容，可以详细的说明下这一过程。并且在下载文件时，也可以说下通过 HTTP/2 协议可以解决队头阻塞的问题。

## CSS 会阻塞 DOM 树渲染吗？

css 加载不会阻塞 DOM 树解析(异步加载时 DOM 照常构建)

但会阻塞 render 树渲染(渲染时需等 css 加载完毕，因为 render 树需要 css 信息)

如果 css 加载不阻塞 render 树渲染的话，那么当 css 加载完之后，

render 树可能又得重新重绘或者回流了，这就造成了一些没有必要的损耗。

这可能也就是浏览器的一种优化机制

## 什么是时间分片（Time Slicing）？

> 引言 根据 W3C 性能小组的介绍，超过 50ms 的任务就是长任务。

![browser-delay](/browser-delay.jpg)
根据上图我们可以知道，当延迟超过 100ms，用户就会察觉到轻微的延迟。

所以为了避免这种情况，我们可以使用两种方案，一种是 Web Worker，另一种是时间分片（Time Slicing）。

**Web Worker**

```js
const testWorker = new Worker('./worker.js')
setTimeout((_) => {
	testWorker.postMessage({})
	testWorker.onmessage = function (ev) {
		console.log(ev.data)
	}
}, 5000)

// worker.js
self.onmessage = function () {
	const start = performance.now()
	while (performance.now() - start < 1000) {}
	postMessage('done!')
}
```

我们可以看看使用了 Web Worker 之后的优化效果：
![browser-service-worker](/browser-service-worker.jpg)

**时间分片（Time Slicing）**

时间分片是一项使用得比较广的技术方案，它的本质就是将长任务分割为一个个执行时间很短的任务，然后再一个个地执行。

这个概念在我们日常的性能优化上是非常有用的。

例如当我们需要在页面中一次性插入一个长列表时（当然，通常这种情况，我们会使用分页去做）。

如果利用时间分片的概念来实现这个功能，我们可以使用 requestAnimationFrame+DocumentFragment

关于这两个 API，我同样不会做详细的介绍，有兴趣的可以查看 MDN requestAnimationFrame 跟 MDN DocumentFragment。

这里有两个 DEMO，大家可以对比下流畅程度：

**未使用时间分片：**

```html
<style>
	* {
		margin: 0;
		padding: 0;
	}
	.list {
		width: 60vw;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
<ul class="list"></ul>
<script>
	'use strict'
	let list = document.querySelector('.list')
	let total = 100000
	for (let i = 0; i < total; ++i) {
		let item = document.createElement('li')
		item.innerText = `我是${i}`
		list.appendChild(item)
	}
</script>
```

**使用时间分片：**

```html
<style>
	* {
		margin: 0;
		padding: 0;
	}
	.list {
		width: 60vw;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
<ul class="list"></ul>
<script>
	'use strict'
	let list = document.querySelector('.list')
	let total = 100000
	let size = 20
	let index = 0
	const render = (total, index) => {
		if (total <= 0) {
			return
		}
		let curPage = Math.min(total, size)
		window.requestAnimationFrame(() => {
			let fragment = document.createDocumentFragment()
			for (let i = 0; i < curPage; ++i) {
				let item = document.createElement('li')
				item.innerText = `我是${index + i}`
				fragment.appendChild(item)
			}
			list.appendChild(fragment)
			render(total - curPage, index + curPage)
		})
	}
	render(total, index)
</script>
```

没有做太多的测评，但是从用户视觉上的感受来看就是，第一种方案，我就是想刷新都要打好几个转，往下滑的时候也有白屏的现象。

除了上述的生成 DOM 的方案，我们同样可以利用 Web Api requestIdleCallback 以及 ES6 API Generator]来实现。

同样不会做太多的介绍，详细规则可以看 MDN requestIdleCallback 以及 MDN Generator。

具体实现如下：

```html
<style>
	* {
		margin: 0;
		padding: 0;
	}
	.list {
		width: 60vw;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
<ul class="list"></ul>
<script>
	'use strict'
	function gen(task) {
		requestIdleCallback((deadline) => {
			let next = task.next()
			while (!next.done) {
				if (deadline.timeRemaining() <= 0) {
					gen(task)
					return
				}
				next = task.next()
			}
		})
	}
	let list = document.querySelector('.list')
	let total = 100000
	function* loop() {
		for (let i = 0; i < total; ++i) {
			let item = document.createElement('li')
			item.innerText = `我是${i}`
			list.appendChild(item)
			yield
		}
	}
	gen(loop())
</script>
```

## 浏览器刷新率

页面的内容都是一帧一帧绘制出来的，浏览器刷新率代表浏览器一秒绘制多少帧。目前浏览器大多是 60Hz（60 帧/s），每一帧耗时也就是在 16ms 左右。原则上说 1s 内绘制的帧数也多，画面表现就也细腻。那么在这一帧的（16ms） 过程中浏览器又干了啥呢？

![fresh](/fresh.webp.jpg)

通过上面这张图可以清楚的知道，浏览器一帧会经过下面这几个过程：

1. 接受输入事件
1. 执行事件回调
1. 开始一帧
1. 执行 RAF (RequestAnimationFrame)
1. 页面布局，样式计算
1. 渲染
1. 执行 RIC (RequestIdelCallback)

第七步的 RIC 事件不是每一帧结束都会执行，只有在一帧的 16ms 中做完了前面 6 件事儿且还有剩余时间，才会执行。这里提一下，如果一帧执行结束后还有时间执行 RIC 事件，那么下一帧需要在事件执行结束才能继续渲染，所以 RIC 执行不要超过 30ms，如果长时间不将控制权交还给浏览器，会影响下一帧的渲染，导致页面出现卡顿和事件响应不及时。

## 网络安全

### 同源策略

是用来防止利用用户的登录态发起恶意请求(CSRF 攻击)；跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了。

### 一、 XSS 攻击

> 涉及面试题：什么是 XSS 攻击？如何防范 XSS 攻击？什么是 CSP？

#### XSS 攻击是什么

Cross-Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。XSS 攻击通常指的是利用网页的漏洞，攻击者通过巧妙的方法注入 XSS 代码到网页，因为浏览器无法分辨哪些脚本是可信的，导致 XSS 脚本被执行。XSS 脚本通常能够窃取用户数据并发送到攻击者的网站，或者冒充用户，调用目标网站接口并执行攻击者指定的操作。

#### XSS 攻击类型

**反射型 XSS**

-   XSS 脚本来自当前 HTTP 请求
-   当服务器在 HTTP 请求中接收数据并将该数据拼接在 HTML 中返回时，例子：

```html
<!-- 某网站具有搜索功能，该功能通过 URL 参数接收用户提供的搜索词：https://xxx.com/search?query=123  -->
<!-- 服务器在对此 URL 的响应中回显提供的搜索词： -->
<p>您搜索的是: 123</p>
<!-- 如果服务器不对数据进行转义等处理，则攻击者可以构造如下链接进行攻击：
https://xxx.com/search?query=<img src="empty.png" onerror="alert('xss')" /> -->
<!-- 该 URL 将导致以下响应，并运行 alert('xss')： -->
<p>您搜索的是: <img src="empty.png" onerror="alert('xss')" /></p>
<!-- 如果有用户请求攻击者的 URL ，则攻击者提供的脚本将在用户的浏览器中执行。 -->
```

**存储型 XSS**

-   XSS 脚本来自服务器数据库中
-   攻击者将恶意代码提交到目标网站的数据库中，普通用户访问网站时服务器将恶意代码返回，浏览器默认执行，例子：

```html
<!-- 某个评论页，能查看用户评论。 -->
<!-- 攻击者将恶意代码当做评论提交，服务器没对数据进行转义等处理评论输入： -->
<textarea>
    <img src="empty.png" onerror ="alert('xss')">
</textarea>
<!-- 则攻击者提供的脚本将在所有访问该评论页的用户浏览器执行 -->
```

**DOM 型 XSS**

该漏洞存在于客户端代码，与服务器无关

-   类似反射型，区别在于 DOM 型 XSS 并不会和后台进行交互，前端直接将 URL 中的数据不做处理并动态插入到 HTML 中，是纯粹的前端安全问题，要做防御也只能在客户端上进行防御。

#### 对于 XSS 攻击来说，通常有两种方式可以用来防御

-   转义字符

通过转义可以将攻击代码 `<script>alert(1)</script>` 变成

```js
// -> &lt;script&gt;alert(1)&lt;&#x2F;script&gt;
escape('<script>alert(1)</script>')
```

但是对于显示富文本来说，显然不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。对于这种情况，通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。

```js
const xss = require('xss')
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html)
```

以上示例使用了 js-xss 来实现，可以看到在输出中保留了 h1 标签且过滤了 script 标签。

-   CSP

CSP 本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击。

通常可以通过两种方式来开启 CSP：

1. 设置 HTTP Header 中的 Content-Security-Policy
2. 设置 meta 标签的方式 <meta http-equiv="Content-Security-Policy">

#### React 如何防止 XSS 攻击

无论使用哪种攻击方式，其本质就是将恶意代码注入到应用中，浏览器去默认执行。React 官方中提到了 React DOM 在渲染所有输入内容之前，默认会进行转义。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。所有的内容在渲染之前都被转换成了字符串，因此恶意代码无法成功注入，从而有效地防止了 XSS 攻击。我们具体看下：

##### 自动转义

React 在渲染 HTML 内容和渲染 DOM 属性时都会将 "'&<> 这几个字符进行转义，转义部分源码如下：

```js
for (index = match.index; index < str.length; index++) {
	switch (str.charCodeAt(index)) {
		case 34: // "
			escape = '&quot;'
			break
		case 38: // &
			escape = '&amp;'
			break
		case 39: // '
			escape = '&#x27;'
			break
		case 60: // <
			escape = '&lt;'
			break
		case 62: // >
			escape = '&gt;'
			break
		default:
			continue
	}
}
```

这段代码是 React 在渲染到浏览器前进行的转义，可以看到对浏览器有特殊含义的字符都被转义了，恶意代码在渲染到 HTML 前都被转成了字符串，如下：

```html
<!-- 一段恶意代码 -->
<img src="empty.png" onerror="alert('xss')" />
<!-- 转义后输出到 html 中
&lt;img src=&quot;empty.png&quot; onerror=&quot;alert(&#x27;xss&#x27;)&quot;&gt; -->
```

这样就有效的防止了 XSS 攻击。

##### JSX 语法

JSX 实际上是一种语法糖，Babel 会把 JSX 编译成 React.createElement() 的函数调用，最终返回一个 ReactElement，以下为这几个步骤对应的代码：

```js
// JSX
const element = (
  <h1 className="greeting">
      Hello, world!
  </h1>
);
// 通过 babel 编译后的代码
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
// React.createElement() 方法返回的 ReactElement
const element = {
  $$typeof: Symbol('react.element'),
  type: 'h1',
  key: null,
  props: {
    children: 'Hello, world!',
        className: 'greeting'
  }
  ...
}
```

我们可以看到，最终渲染的内容是在 Children 属性中，那了解了 JSX 的原理后，我们来试试能否通过构造特殊的 Children 进行 XSS 注入，来看下面一段代码：

```js
const storedData = `{
    "ref":null,
    "type":"body",
    "props":{
        "dangerouslySetInnerHTML":{
            "__html":"<img src=\"empty.png\" onerror =\"alert('xss')\"/>"
        }
    }
}`;
// 转成 JSON
const parsedData = JSON.parse(storedData);
// 将数据渲染到页面
render () {
    return <span> {parsedData} </span>;
}
```

这段代码中， 运行后会报以下错误，提示不是有效的 ReactChild。

```js
Uncaught (in promise) Error: Objects are not valid as a React child (found: object with keys {ref, type, props}). If you meant to render a collection of children, use an array instead.
```

那究竟是哪里出问题了？我们看一下 ReactElement 的源码：

```js
const symbolFor = Symbol.for;
REACT_ELEMENT_TYPE = symbolFor('react.element');
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 这个 tag 唯一标识了此为 ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创建此元素的组件
    _owner: owner,
  };
  ...
  return element;
}
```

注意到其中有个属性是 $$typeof，它是用来标记此对象是一个 ReactElement，React 在进行渲染前会通过此属性进行校验，校验不通过将会抛出上面的错误。React 利用这个属性来防止通过构造特殊的 Children 来进行的 XSS 攻击，原因是 $$typeof 是个 Symbol 类型，进行 JSON 转换后会 Symbol 值会丢失，无法在前后端进行传输。如果用户提交了特殊的 Children，也无法进行渲染，利用此特性，可以防止存储型的 XSS 攻击。

**在 React 中可引起漏洞的一些写法**

##### 使用 dangerouslySetInnerHTML

dangerouslySetInnerHTML 是 React 为浏览器 DOM 提供 innerHTML 的替换方案。通常来讲，使用代码直接设置 HTML 存在风险，因为很容易使用户暴露在 XSS 攻击下，因为当使用 dangerouslySetInnerHTML 时，React 将不会对输入进行任何处理并直接渲染到 HTML 中，如果攻击者在 dangerouslySetInnerHTML 传入了恶意代码，那么浏览器将会运行恶意代码。看下源码：

```js
function getNonChildrenInnerMarkup(props) {
	const innerHTML = props.dangerouslySetInnerHTML // 有dangerouslySetInnerHTML属性，会不经转义就渲染__html的内容
	if (innerHTML != null) {
		if (innerHTML.__html != null) {
			return innerHTML.__html
		}
	} else {
		const content = props.children
		if (typeof content === 'string' || typeof content === 'number') {
			return escapeTextForBrowser(content)
		}
	}
	return null
}
```

所以平时开发时最好避免使用 dangerouslySetInnerHTML，如果不得不使用的话，前端或服务端必须对输入进行相关验证，例如对特殊输入进行过滤、转义等处理。前端这边处理的话，推荐使用白名单过滤，通过[白名单](https://jsxss.com/zh/index.html)控制允许的 HTML 标签及各标签的属性。

##### 通过用户提供的对象来创建 React 组件

```js
// 用户的输入
const userProvidePropsString = `{"dangerouslySetInnerHTML":{"__html":"<img onerror='alert(\"xss\");' src='empty.png' />"}}"`;
// 经过 JSON 转换
const userProvideProps = JSON.parse(userProvidePropsString);
// userProvideProps = {
//   dangerouslySetInnerHTML: {
//     "__html": `<img onerror='alert("xss");' src='empty.png' />`
//      }
// };
render() {
     // 出于某种原因解析用户提供的 JSON 并将对象作为 props 传递
    return <div {...userProvideProps} />
}
```

这段代码将用户提供的数据进行 JSON 转换后直接当做 div 的属性，当用户构造了类似例子中的特殊字符串时，页面就会被注入恶意代码，所以要注意平时在开发中不要直接使用用户的输入作为属性。

##### 使用用户输入的值来渲染 a 标签的 href 属性，或类似 img 标签的 src 属性等

```
const userWebsite = "javascript:alert('xss');"
<a href={userWebsite}></a>
```

如果没有对该 URL 进行过滤以防止通过 javascript: 或 data: 来执行 JavaScript，则攻击者可以构造 XSS 攻击，此处会有潜在的安全问题。 用户提供的 URL 需要在前端或者服务端在入库之前进行验证并过滤。

**服务端如何防止 XSS 攻击**

服务端作为最后一道防线，也需要做一些措施以防止 XSS 攻击，一般涉及以下几方面：

-   在接收到用户输入时，需要对输入进行尽可能严格的过滤，过滤或移除特殊的 HTML 标签、JS 事件的关键字等。
-   在输出时对数据进行转义，根据输出语境 (html/javascript/css/url)，进行对应的转义
-   对关键 Cookie 设置 http-only 属性，JS 脚本就不能访问到 http-only 的 Cookie 了
-   利用 CSP 来抵御或者削弱 XSS 攻击，一个 CSP 兼容的浏览器将会仅执行从白名单域获取到的脚本文件，忽略所有的其他脚本 (包括内联脚本和 HTML 的事件处理属性)

**总结**

出现 XSS 漏洞本质上是输入输出验证不充分，React 在设计上已经很安全了，但是一些反模式的写法还是会引起安全漏洞。Vue 也是类似，Vue 做的安全措施主要也是转义，HTML 的内容和动态绑定的属性都会进行转义。无论使用 React 或 Vue 等前端框架，都不能百分百的防止 XSS 攻击，所以服务端必须对前端参数做一些验证，包括但不限于特殊字符转义、标签、属性白名单过滤等。一旦出现安全问题一般都是挺严重的，不管是敏感数据被窃取或者用户资金被盗，损失往往无法挽回。我们平时开发中需要保持安全意识，保持代码的可靠性和安全性。

### 二、CSRF 攻击

> 涉及面试题：什么是 CSRF 攻击？如何防范 CSRF 攻击？

CSRF 中文名为跨站请求伪造。原理就是攻击者构造出一个后端请求地址，诱导用户点击或者通过某些途径自动发起请求。如果用户是在登录状态下的话，后端就以为是用户在操作，从而进行相应的逻辑。

举个例子，假设网站中有一个通过 GET 请求提交用户评论的接口，那么攻击者就可以在钓鱼网站中加入一个图片，图片的地址就是评论接口

```html
<img src="http://www.domain.com/xxx?comment='attack'" />
```

那么你是否会想到使用 POST 方式提交请求是不是就没有这个问题了呢？其实并不是，使用这种方式也不是百分百安全的，攻击者同样可以诱导用户进入某个页面，在页面中通过表单提交 POST 请求。

**如何防御**

防范 CSRF 攻击可以遵循以下几种规则：

1. Get 请求不对数据进行修改
1. 不让第三方网站访问到用户 Cookie
1. 阻止第三方网站请求接口
1. 请求时附带验证信息，比如验证码或者 Token

**SameSite**

可以对 Cookie 设置 SameSite 属性。该属性表示 Cookie 不随着跨域请求发送，可以很大程度减少 CSRF 的攻击，但是该属性目前并不是所有浏览器都兼容。

**验证 Referer**

对于需要防范 CSRF 的请求，我们可以通过验证 Referer 来判断该请求是否为第三方网站发起的。

**Token**

服务器下发一个随机 Token，每次发起请求时将 Token 携带上，服务器验证 Token 是否有效。

### 三、点击劫持

> 涉及面试题：什么是点击劫持？如何防范点击劫持？

点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击。

对于这种攻击方式，推荐防御的方法有两种。

**X-FRAME-OPTIONS**

是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头 就是为了防御用 iframe 嵌套的点击劫持攻击。

该响应头有三个值可选，分别是

-   DENY，表示页面不允许通过 iframe 的方式展示
-   SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示
-   ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示

#### DNS 劫持

#### 如果不通过 img 或者 script 标签，或者说用户不通过点击第三方连接怎么造成 CSRF 攻击吗？

可以通过 dns 劫持

### 四、中间人攻击

> 涉及面试题：什么是中间人攻击？如何防范中间人攻击？

中间人攻击（Man-in-the-Middle Attack, MITM）是一种由来已久的网络入侵手段，并且当今仍然有着广泛的发展空间，如 SMB 会话劫持、DNS 欺骗等攻击都是典型的 MITM 攻击。

中间人攻击是攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的，但是实际上整个通信过程都被攻击者控制了。攻击者不仅能获得双方的通信信息，还能修改通信信息。

通常来说不建议使用公共的 Wi-Fi，因为很可能就会发生中间人攻击的情况。如果你在通信的过程中涉及到了某些敏感信息，就完全暴露给攻击方了。

当然防御中间人攻击其实并不难，只需要增加一个安全通道来传输信息。HTTPS 就可以用来防御中间人攻击，但是并不是说使用了 HTTPS 就可以高枕无忧了，因为如果你没有完全关闭 HTTP 访问的话，攻击方可以通过某些方式将 HTTPS 降级为 HTTP 从而实现中间人攻击。

## noopener, noreferrer 及 nofollow

a 标签通常会配合着使用 noopener, noreferrer 及 nofollow 这些属性, 它们的作用及用法如下。

-   noopener

当给链接加上 target="\_blank" 后， 目标网页会在新的标签页中打开， 此时在新打开的页面中可通过 window.opener 获取到源页面的 window 对象， 这就埋下了安全隐患。

具体来说,

你自己的网页 A 有个链接是打开另外一个三方地址 B
B 网页通过 window.opener 获取到 A 网页的 window 对象， 进而可以使得 A 页面跳转到一个钓鱼页面 window.opener.location.href ="abc.com"， 用户没注意地址发生了跳转， 在该页面输入了用户名密码后则发生信息泄露
为了避免上述问题， 引入了 rel="noopener" 属性， 这样新打开的页面便获取不到来源页面的 window 对象了， 此时 window.opener 的值是 null。

所以， 如果要在新标签页中打开三方地址时， 最好配全着 rel="noopener"。

-   noreferrer

与 noopener 类似， 设置了 rel="noreferrer" 后新开页面也无法获取来源页面的 window 以进行攻击， 同时， 新开页面中还无法获取 document.referrer 信息， 该信息包含了来源页面的地址。

通常 noopener 和 noreferrer 会同时设置， rel="noopener noreferrer"。

既然后者同时拥有前者限制获取 window.opener 的功能， 为何还要同时设置两者呢。

考虑到兼容性， 因为一些老旧浏览器不支持 noopener。

-   nofollow

搜索引擎对页面的权重计算中包含一项页面引用数 (backlinks), 即如果页面被其他地方链接得多， 那本页面会被搜索引擎判定为优质页面， 在搜索结果中排名会上升。

当设置 rel="nofollow" 则表示告诉搜索引擎， 本次链接不为上述排名作贡献。

一般用于链接内部地址， 或一些不太优质的页面。

## 说下 CDN 缓存？

Content Delivery Network，即内容分发网络

各地部署多套静态存储服务，本质上是空间换时间

自动选择最近的节点内容，不存在再请求原始服务器

适合存储更新很少的静态内容，文件更新慢

**工作原理**

-   传统访问：用户在浏览器输入域名发送请求-解析域名获取服务器 IP 地址-根据 IP 地址找到对应的服务器-服务器响应并返回数据

-   使用 CDN 访问：用户发送请求-智能 DNS 的解析(根据 IP 判断地理位置、接入网类型、选择路由最短和负载最轻的服务器)-取得缓存服务器 IP-把内容返回给用户(如果缓存中有)-向源站发起请求-将结果返回给用户-将结果存入缓存服务器

**适用场景**

-   站点或者应用中大量静态资源的加速分发，例如：CSS,JS,图片和 HTML

-   大文件下载

-   直播网站等

## Service Worker

传输协议必须为 HTTPS，因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。

## Cookie Secure

#### 设置 secure 是否只能通过 https 来传递 cookie?

cookie 中的 Secure 值的作用 ：该属性的作用是是否允许以 https 协议的方式传递 cookie（开启与否通过观察前后端交互的响应头中是否包含此字段即可：set-cookie）

出现原因分析：
你的网站站点中使用到 https 协议，但是你的 node 服务器是通过 session 和 cookie 的方式跟踪服务端与客户端会话状态的，且没设置或设置了 cookie 的 secure 属性为值 false，那么就抛出了这个问题；

强行解决带来的问题：
把 session 中配置的 secure 属性值直接改成 true，不做其他处理，会出现会话错误的问题，导致系统无法登陆；

```js
// 我是通过我的node服务器解决的该问题：
var app = express()
var sess = {undefined
secret: ‘keyboard cat’,
cookie: {}
}

if (app.get(‘env’) === ‘production’) {undefined
app.set(‘trust proxy’, 1) // trust first proxy ！！！官方要求添加这个字段后才能设置.cookie.secure = true
sess.cookie.secure = true // serve secure cookies
}
```

[参考官方文档 express-session](https://www.npmjs.com/package/express-session)

## 跨域请求能携带 Cookie？

1. 在客户端将 withCredentials 设置为 true

```js
// 当发送跨域请求时，携带cookie信息
xhr.withCredentials = true
```

2. res.header('Access-Control-Allow-Credentials', true);

```js
// 拦截所有请求
app.use((req, res, next) => {
	// 1.允许哪些客户端访问我
	// * 代表允许所有的客户端访问我
	// 注意：如果跨域请求中涉及到cookie信息传递，值不可以为*号 比如是具体的域名信息
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
	// 2.允许客户端使用哪些请求方法访问我
	res.header('Access-Control-Allow-Methods', 'get,post')
	// 允许客户端发送跨域请求时携带cookie信息
	res.header('Access-Control-Allow-Credentials', true)
	next()
})
```

## Post 和 Get 的区别？

首先先引入副作用和幂等的概念。

副作用指对服务器上的资源做改变，搜索是无副作用的，注册是副作用的。

幂等指发送 M 和 N 次请求（两者不相同且都大于 1），服务器上资源的状态一致，比如注册 10 个和 11 个帐号是不幂等的，对文章进行更改 10 次和 11 次是幂等的。因为前者是多了一个账号（资源），后者只是更新同一个资源。

在规范的应用场景上说，Get 多用于无副作用，幂等的场景，例如搜索关键字。Post 多用于副作用，不幂等的场景，例如注册。

在技术上说：

-   Get 请求能缓存(catch-control)，Post 不能
-   Post 相对 Get 安全一点点，因为 Get 请求都包含在 URL 里（当然你想写到 body 里也是可以的），且会被浏览器保存历史纪录。Post 不会，但是在抓包的情况下都是一样的。
-   URL 有长度限制，会影响 Get 请求，但是这个长度限制是浏览器规定的，不是 RFC 规定的
-   Post 支持更多的编码类型且不对数据类型限制

## 浏览器默认缓存时间？

对于这种情况，浏览器会采用一个启发式的算法，通常会取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间。

## 浏览器文件缓存位置？

浏览器可以在内存、硬盘中开辟一个空间用于保存请求资源副本。我们经常调试时在 DevTools Network 里看到 Memory Cache（內存缓存）和 Disk Cache（硬盘缓存），指的就是缓存所在的位置。请求一个资源时，会按照优先级（Service Worker -> Memory Cache -> Disk Cache -> Push Cache）依次查找缓存，如果命中则使用缓存，否则发起请求。这里先介绍 Memory Cache 和 Disk Cache。

-   200 from memory cache
    表示不访问服务器，直接从内存中读取缓存。因为缓存的资源保存在内存中，所以读取速度较快，但是关闭进程后，缓存资源也会随之销毁，一般来说，系统不会给内存分配较大的容量，因此内存缓存一般用于存储较小文件。同时内存缓存在有时效性要求的场景下也很有用（比如浏览器的隐私模式）。

-   200 from disk cache
    表示不访问服务器，直接从硬盘中读取缓存。与内存相比，硬盘的读取速度相对较慢，但硬盘缓存持续的时间更长，关闭进程之后，缓存的资源仍然存在。由于硬盘的容量较大，因此一般用于存储大文件。

-   200 from prefetch cache
    在 preload 或 prefetch 的资源加载时，两者也是均存储在 http cache，当资源加载完成后，如果资源是可以被缓存的，那么其被存储在 http cache 中等待后续使用；如果资源不可被缓存，那么其在被使用前均存储在 memory cache;

![Image from alias](/hm5o6ugws2.png)

> Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效。

## 重绘和回流？

重绘：当 DOM 树中的某些元素的属性需要更新，而这些属性只是影响元素的外观和风格，并不进行几何操作影响布局，比如 background-color，我们将这样的操作称为重绘。
回流：当渲染树中的一部分或者全部元素的规模尺寸、布局、隐藏显示等需要重新构建布局的操作，我们称为回流。
常见因此回流属性的方法：

1. JS 更改 DOM 元素（插入，删除、更新、移动、添加动画等，更改 DOM 颜色除外）
2. 元素尺寸改变-边距、填充、边控、宽高
3. 改变样式属性（颜色，透明度等除外）
4. 浏览器窗口尺寸改变
5. offsetWidth、offsetHeigh 和 getComputedStyle 之类的元素进行测量
6. 设置 style 属性的值
7. 修改网页默认字体
8. 内容变化，input 框中输入文字

## requestAnimationFrame

解决`setTimeout/setInterval`无法精准定位时间间隔
`requestAnimationFrame`的时间间隔是由系统控制而非 JS 控制

```javascript
var timer = requestAnimationFrame(function{
  console.log(1)
})
cancelAnimationFrame(timer)

// 判断浏览器是否兼容requestAnimationFrame
if(!window.requestAnimationFrame){
  requestAnimationFrame = function(fn){
    setTimeout(fn,17)
  };
}

// 实例:
<div id="test" style="width:300px;font-size:12px;height:16px;background:#290;">0%</div>
<script>
  const test = document.getElementById('test')
  // setTimeout实现
  test.onclick = function () {
    var timer = setTimeout(function fn() {
      if (parseInt(test.style.width) < 300) {
        test.style.width = parseInt(test.style.width) + 3 + 'px'
        test.innerHTML = parseInt(test.style.width) / 3 + '%'
        timer = setTimeout(fn, 17)
      } else {
        clearTimeout(timer)
      }
    }, 17)
  }
  // setInterval实现
  test.onclick = function () {
    var timer = setInterval(function () {
      if (parseInt(test.style.width) < 300) {
        test.style.width = parseInt(test.style.width) + 3 + 'px'
        test.innerHTML = parseInt(test.style.width) / 3 + '%'
      } else {
        clearInterval(timer)
      }
    }, 17)
  }
  // requestAnimationFrame实现
  test.onclick = function () {
    var timer = requestAnimationFrame(function fn() {
      if (parseInt(test.style.width) < 300) {
        test.style.width = parseInt(test.style.width) + 3 + 'px'
        test.innerHTML = parseInt(test.style.width) / 3 + '%'
        requestAnimationFrame(fn)
      } else {
        cancelAnimationFrame(timer)
      }
    })
  }
</script>

// equestAnimationFrame 不管理回调函数队列，
// 而滚动、触摸这类高触发频率事件的回调可能会在同一帧内触发多次。
// 所以正确使用 requestAnimationFrame 的姿势是，
// 在同一帧内可能调用多次 requestAnimationFrame 时，要管理回调函数，防止重复绘制动画。
const onScroll = e => {
    if (scheduledAnimationFrame) { return }

    scheduledAnimationFrame = true
    window.requestAnimationFrame(timestamp => {
        scheduledAnimationFrame = false
        animation(timestamp)
    })
}
window.addEventListener('scroll', onScroll)
```

## 正则获取 url 中 query 参数

## 正则解析模版字符串

## Websocket

使得客户端和服务器端交互更加简单，允许服务器端主动向客户端推送数据；
浏览器服务器只需一次握手即可创建持久性的连接，并进行双向双工的通信。
HTTP 协议为了支持，兼容现有浏览器的握手规范，产生的交集。
特点：

1. 真正的全双工通信
2. 减少 head 通信量

> 应用场景：聊天室、社交网站、股票走势

![image](/websocket0.png)
