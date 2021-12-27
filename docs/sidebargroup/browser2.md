---
title: 第二章
---

## 第一题：浏览器文件缓存位置？

浏览器可以在内存、硬盘中开辟一个空间用于保存请求资源副本。我们经常调试时在DevTools Network里看到Memory Cache（內存缓存）和Disk Cache（硬盘缓存），指的就是缓存所在的位置。请求一个资源时，会按照优先级（Service Worker -> Memory Cache -> Disk Cache -> Push Cache）依次查找缓存，如果命中则使用缓存，否则发起请求。这里先介绍 Memory Cache 和 Disk Cache。

- 200 from memory cache
表示不访问服务器，直接从内存中读取缓存。因为缓存的资源保存在内存中，所以读取速度较快，但是关闭进程后，缓存资源也会随之销毁，一般来说，系统不会给内存分配较大的容量，因此内存缓存一般用于存储较小文件。同时内存缓存在有时效性要求的场景下也很有用（比如浏览器的隐私模式）。

- 200 from disk cache
表示不访问服务器，直接从硬盘中读取缓存。与内存相比，硬盘的读取速度相对较慢，但硬盘缓存持续的时间更长，关闭进程之后，缓存的资源仍然存在。由于硬盘的容量较大，因此一般用于存储大文件。

- 200 from prefetch cache
在preload或prefetch的资源加载时，两者也是均存储在http cache，当资源加载完成后，如果资源是可以被缓存的，那么其被存储在http cache中等待后续使用；如果资源不可被缓存，那么其在被使用前均存储在memory cache;

![Image from alias](/hm5o6ugws2.png)