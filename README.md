# BulletJs
> 😀一个原生js弹幕库，基于 CSS3 Animation
- [segmentFault文章地址](https://segmentfault.com/a/1190000021719074) 
- [项目地址](https://github.com/hugeorange/BulletJs) 
- 本项目灵感来源于 [rc-bullets](https://github.com/zerosoul/rc-bullets)
- 演示图 ![danmuku.gif](https://pic2.zhimg.com/80/v2-bc6041f8b0e696767fac56fc48c91206_1440w.gif)
> 2020-08-24更新
- 源码采用ts书写，增加 `.d.ts` 文件
- 采用rollup打包并发布到npm，[rollup打包教程](https://chenshenhai.github.io/rollupjs-note/note/chapter03/01.html)，`rollup -c 之后不知道为啥不退出服务 ？？，还需要手动退出`
- 去除靠`IntersectionObserver`来对弹道进行调度，采用新的弹道选择算法，增加防重叠检测
- 支持同速/不同速弹幕
- 默认情况下直接丢弃排不上对的弹幕，不对其进行缓存，对于必定要上墙的弹幕在push时可以增加一个参数 `this.screen.push(danmu, {}, true)`(适用于用户自己发的弹幕)
- 变更名字，想想用拼音起名还是太low了😂😂😂
  
### 使用方式

1. 直接cdn引入
    ```
    // 示例代码: https://github.com/hugeorange/BulletJs/blob/master/src/index.html
    <script src="https://unpkg.com/js-bullets@0.0.1/dist/BulletJs.min.js"></script>
    <script>
    const screen = new BulletJs('.screen', { 
                      trackHeight: 35 
                    });
    </script>
    ```
2. ESModule 引入
    ```
    yarn install js-bullets

    // react
    import BulletJs from "js-bullets";

    componentDidMount() {
        this.screen = new BulletJs("#danmu-screen", {})

        setInterval(() => {
            this.screen.push('<span>12222222</span>')
        }, 1000)
    }
    ```

3. 简单粗暴的办法直接拷贝`comps`目录下的代码到你的项目中使用，vue、react项目均可

---

- 项目产生原因：
  - 因为`rc-bullets` 是基于 `React`，可能很多使用其他框架的同学没法使用
  - 新增了 `speed` 参数，让所有弹幕以相同速度运动（自己项目的需要）
  - 在`animationEnd`的时候增加了轨道置空处理
  - 对 `queues` 队列的处理方式不同
  - 弹幕格式 `dom 字符串`
  - 去掉了一些自己项目用不到的 api

## API

`option`：

| 选项           | 含义               | 值类型        | 默认值      | 备注 |
| -------------- | ------------------ | ------------- | ----------- | -------------------------- |
| trackHeight    | 轨道高度           | string        | 50px        | 均分轨道的高度  |
| onStart        | 自定义动画开始函数 | function      | null        | 开始开始回调 |
| onEnd          | 自定义动画结束函数 | function      | null        | 弹幕运动结束回调 |
| pauseOnClick   | 鼠标点击暂停       | boolean       | false       | 再次点击继续        |
| pauseOnHover   | 鼠标悬停暂停       | boolean       | true        | 鼠标进入暂停，离开继续    |
| duration       | 滚动时长           | string        | 10s          | `传入speed该参数无效`|
| speed          | 滚动速度           | number        | 100          | 100px/s | null    |


- 暂停弹幕：`screen.pause([<bulletId>])`，无参则暂停全部
- 弹幕继续：`screen.resume([<bulletId>])`，无参则继续全部


## 注意事项
- 弹幕原理：利用 `css3 animation 关键帧动画`, 从左移动到右，`duration` 控制速度
    ```css
    @keyframe name {
        from { transform: translateX(width px) }
        to { transform: translateX(-100%) }
    }
    ```
- [弹幕防重叠原理](https://www.zhihu.com/question/370464345)
  ![原理图](https://github.com/hugeorange/BulletJs/blob/master/src/image/screen.png)


- 另外一点需要注意的：我在项目里从接口里读出来数据每页20条，每隔 1s 去发一条弹幕（用 setTimeout），这时有个问题，当页面休眠休眠时，会出现setTimeout堆积的情况，解决办法：用 [requestAnimationFrame](https://zhuanlan.zhihu.com/p/34868095)替代 setTimeout
