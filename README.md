# danmujs
> 😀一个原生js弹幕库，基于 CSS3 Animation
- [项目地址](https://github.com/hugeorange/danmujs) - [核心代码](https://github.com/hugeorange/danmujs/blob/master/src/comps/src/Danmu.js)
- 本项目基于 [rc-bullets](https://github.com/zerosoul/rc-bullets)，项目约70%的代码基于`rc-bullets`，首先要感谢这个项目的作者，如需学习请深入阅读 `rc-bullets`

- 项目产生原因：
  - 因为`rc-bullets` 是基于 `React`，可能很多使用其他框架的同学没法使用
  - 新增了 `speed` 参数，让所有弹幕以相同速度运动（自己项目的需要）
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
| loopCount      | 循环次数           | number/string | 1           | animation-loop |
| duration       | 滚动时长           | number/string | 10          | `传入speed该参数无效`|
| speed          | 滚动速度           | number        | 100          | 100px/s     |
| isCustomeQueue | 是否需要自动消费queues | boolean    | false        |见下面注意事项 |
| delay          | 延迟               | number/string | 0           | animation-delay |
| direction      | 动画方向           | string        | normal      | animation-direction |
| animateTimeFun | 动画函数           | string        | linear:匀速 | animation-timing-function |


- 暂停弹幕：`screen.pause([<bulletId>])`，无参则暂停全部
- 弹幕继续：`screen.resume([<bulletId>])`，无参则继续全部


## 使用
- [示例代码](https://github.com/hugeorange/danmujs/blob/master/src/App.jsx)
- 使用方式：直接将 `./src/comps/src` copy 到你的项目内即可使用
    ```js

    const screen = new Danmujs('#screen', {
        trackHeight: 35,
        speed: 80,
        pauseOnClick: true,
    })
    console.log(screen.queues) // 缓冲队列里的内容

    // 发送弹幕
    handleSend = () => {
        const danmu = `<div style="border: 1px solid; padding: 5px;">我是一条弹幕哈哈哈😝</div>`
        screen.push(danmu)
    }

    ```

## 注意事项
- 弹幕原理：利用 `css3 animation 关键帧动画`, 从左移动到右，`duration` 控制速度
    ```css
    @keyframe name {
        from { transform: translateX(width px) }
        to { transform: translateX(-100%) }
    }
    ```
- 说注意事项之前先说一下该项目的弹幕防重叠原理
  ![原理图](https://raw.githubusercontent.com/hugeorange/danmujs/master/src/image/screen.png)
  ```js
  每条轨道三种状态：idle/feed/running 分别如上图所示

  轨道初始状态为：idle

  当一条弹幕 push 到弹幕对列了，该条轨道变为 running

  利用 IntersectionObserver 当一条弹幕较短时并完全出现在舞台中，该条轨道变为 feed

  当弹幕运动完毕时触发 animationEnd 事件，将该条弹幕移除对列
    此时检查该轨道是否还有其他弹幕
    如没有：该条轨道置位 idle

    // 下面的这个判断好像没必要了
    // 如有：检查该轨道内最后一条弹幕是否已经完全出现在屏幕中
    // 如完全出现该轨道置位 feed
    // 否则 仍为 running
  ```

- `!!!注意：` 代码中有个名为 `queues` 对列是个实例属性，当短时间弹幕过多，没有轨道可以分配时，会把多余的弹幕放进该队列，对该队列里的内容提供三种处理方案：`isCustomeQueue` 取值为 true 时，按第一种处理，false 为二、三两种
  - 其一：当下次出现空闲对列时优先使用 `queues` 里面的内容（`可能会出现重叠现象，我也没想到好的处理办法，如果您有好办法，请告诉我一下`）
  - 其二：`queues` 里的弹幕交给宿主环境来安排执行（因为宿主是触发弹幕的执行者，自然知道何时处理该弹幕较为合适；比如：我的场景，弹幕列表是从一个分页接口读出来的，当页执行完再去请求下一页的数据，在请求下一页数据的这个空档时间可以检查下 `queues` 是否有东西，有则执行没有就算了）
  - 其三：直接丢弃 `queues` 里的弹幕（最不妥的方式）

- 另外一点需要注意的：我在项目里从接口里读出来数据每页20条，每隔 1s 去发一条弹幕（用 setTimeout），这时有个问题，当页面休眠休眠时，会出现setTimeout堆积的情况，解决办法：用 [requestAnimationFrame](https://zhuanlan.zhihu.com/p/34868095)替代 setTimeout