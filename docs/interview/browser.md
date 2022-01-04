---
title: 第一章
---
## 如果什么缓存策略都没设置，那么浏览器会怎么处理？

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
