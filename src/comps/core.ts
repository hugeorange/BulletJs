import {
  initBulletAnimate,
  getContainer,
  getRandom,
  eventEntrust,
  IoptsType,
  BULLETCLASS,
  BULLETTEMPCLASS,
} from './helper'

// 基础配置
const defaultOptions = {
  trackHeight: 50, // 跑道高度
  pauseOnHover: false,
  pauseOnClick: false,
  onStart: null,
  onEnd: null,
  duration: '10s',
  trackArr: [{ speed: 150 }, { speed: 130 }],
  speed: 100, // 100px/s
}

type ItrackStatus = 'running' | 'idle'

export default class BulletJs {
  ele: string | HTMLElement
  options: IoptsType
  targetPos: DOMRect

  target: HTMLElement = null
  tempContanier: HTMLElement = null // 临时弹幕容器
  bulletInfo: Record<string, any> = {} // 当前push的弹幕对象信息
  bullets: any[] = [] // 弹幕存储器 ==> 各跑道内所对应的弹幕
  tracks: ItrackStatus[] = [] // 轨道列表
  queues: any = [] // 用户自己发送的的弹幕存储列表
  targetW: number = 0 // 舞台宽度
  pauseArrs: any[] = [] // 暂停队列
  isAllPaused: boolean = false // 是否全部暂停
  constructor(ele: string | HTMLElement, opts: IoptsType = {}) {
    this.options = Object.assign(defaultOptions, opts)
    this.ele = ele
    this.initScreen()
    this.initOpt()
    this.initTempContainer()
    this._addExtraEvent()
  }

  // 设置弹幕目标
  private initScreen() {
    if (typeof this.ele === 'string') {
      this.target = document.querySelector(this.ele)
      if (!this.target) throw new Error('The display target does not exist')
    } else if (this.ele instanceof HTMLElement) {
      this.target = this.ele
    } else {
      throw new Error('The display target of the barrage must be set')
    }
  }

  // 初始化配置
  private initOpt() {
    const { trackHeight } = this.options
    this.targetPos = this.target.getBoundingClientRect()
    const trackNum = Math.floor(this.targetPos.height / trackHeight)
    this.tracks = new Array(trackNum).fill('idle')
    this.bullets = new Array(trackNum).fill([])
    this.targetW = this.targetPos.width

    // 屏幕目标必须具备的CSS样式
    const { position } = getComputedStyle(this.target)
    if (position === 'static') {
      this.target.style.position = 'relative'
      this.target.style.overflow = 'hidden'
    }
    // 插入css animation
    initBulletAnimate(this.targetW)
  }

  // 初始化一个弹幕临时容器，为后期获取高度
  private initTempContainer() {
    this.tempContanier = document.createElement('div')
    this.tempContanier.classList.add(BULLETTEMPCLASS)
    document.body.appendChild(this.tempContanier)
  }

  // push 可针对具体一条弹幕设置特殊配置
  public push(item: string, opts = {}, isSelf = false): number | string {
    if (this.isAllPaused) return // 如果是全部暂停状态，停止push，停止render
    const options = Object.assign({}, this.options, opts)

    const canIndex = this._getTrackIndex()
    if (canIndex === -1) {
      if (isSelf) {
        // 没有多余轨道的情况，自己发的弹幕先保存起来
        this.queues.push({ item, opts })
      }
      // 其他用户发的，直接丢弃
    } else {
      const bulletContainer = this._getBulletItem(item, options, canIndex)
      // 塞入弹幕存储器
      if (this.bullets[canIndex].length) {
        this.bullets[canIndex].push(bulletContainer)
      } else {
        this.bullets[canIndex] = [bulletContainer]
      }
      this._render(bulletContainer, canIndex)
      this._addEvent(bulletContainer, canIndex, options)
      return bulletContainer.id
    }
  }
  // 获取下一个弹幕实体
  private _getBulletItem(item: string, options: IoptsType, canIndex: number) {
    const bulletContainer = getContainer({ ...options })
    // 此处有极大风险会出现 xss漏洞，注意切忌一定要对用户输入进行过滤，采用 innerHTML 主要是为了方便开发者可以自定义样式
    // 故开发者一定要对用户输入内容进行转义过滤
    bulletContainer.innerHTML = item
    // 为了获取当前弹幕的宽度，故必须要将其先插入到document中
    this.tempContanier.replaceChildren(bulletContainer)
    this.bulletInfo = { width: bulletContainer.offsetWidth }

    let duration = 0
    const speed = options.trackArr?.[canIndex]?.speed || options.speed
    if (speed) {
      duration = (this.targetW + this.bulletInfo.width) / speed
    } else {
      duration = +options.duration.slice(0, -1)
    }
    // 控制速度
    bulletContainer.style.animationDuration = duration * 1000 + 'ms'

    // 将duration作为弹幕固有属性存储
    bulletContainer.dataset.duration = duration + ''
    // 删除临时存储弹幕容器里的弹幕
    bulletContainer.remove()
    return bulletContainer
  }

  // 获取空闲跑道
  private _getTrackIndex() {
    let readyIdxs = []
    let index = -1
    // 优先去 idle 状态
    this.tracks.forEach((v, idx) => v === 'idle' && readyIdxs.push(idx))
    if (readyIdxs.length) {
      const random = getRandom(0, readyIdxs.length - 1)
      index = readyIdxs[random]
      this.tracks[index] = 'running'
      return index
    }
    // 没有轨道空闲，丛上到下巡检各轨道，选出可执行弹幕轨道
    for (let i = 0; i < this.bullets.length; i++) {
      const len = this.bullets[i].length
      if (len) {
        // 取出该轨道最后一条弹幕
        const item = this.bullets[i][len - 1]
        if (item && this._checkTrack(item)) {
          return i
        }
      }
    }
    return index
  }

  // 判断该条轨道是否可执行弹幕
  private _checkTrack(item: HTMLElement): boolean {
    // 思路来源 https://www.zhihu.com/question/370464345
    const itemPos = item.getBoundingClientRect()
    // 轨道中最后一个元素尚未完全进入展示区域，直接跳出
    if (itemPos.right > this.targetPos.right) {
      return false
    }

    // 轨道中最后一个元素已完全进去展示区域

    // 速度相同，只要初始条件满足即可，不用去关系追及问题
    if (this.options.speed || this.options.trackArr?.length) {
      if (itemPos.right < this.targetPos.right) return true
    } else {
      // 不设速度，纯靠 duration 控制，弹幕越长速度越快
      const duration = +item.dataset.duration
      // 原弹幕速度
      const v1 = (this.targetW + itemPos.width) / duration
      /**
       * 新弹幕
       * s2：全程距离
       * t2：全程时间
       * v2：速度
       */
      const s2 = this.targetW + this.bulletInfo.width
      const t2 = duration
      const v2 = s2 / t2

      if (v2 <= v1) {
        return true
      } else {
        // 小学时代的追及问题：t = s / v  比较时间：t1, t2

        // 原弹幕跑完剩余全程所需要的时间
        const t1 = (itemPos.right - this.targetPos.left) / v1
        // 新弹幕头部跑完全程所需要的时间
        const t2 = this.targetW / v2
        // console.log('前面的--->', t1, t2, '后面的时间', v1)
        if (t2 < t1) {
          return false
        }
      }
    }
    return true
  }

  // 绑定事件
  private _addEvent(
    bulletContainer: HTMLElement,
    canIndex: number,
    options: IoptsType,
  ) {
    const { onStart, onEnd } = options
    // 监听弹幕开始的事件
    bulletContainer.addEventListener('animationstart', () => {
      if (onStart) onStart.call(window, bulletContainer.id, this)
    })

    // 监听弹幕完成的事件
    bulletContainer.addEventListener('animationend', () => {
      if (onEnd) onEnd.call(window, bulletContainer.id, this)
      // 从集合中剔除已经结束的动画
      this.bullets[canIndex] = this.bullets[canIndex].filter(
        v => v.id !== bulletContainer.id,
      )

      if (!this.bullets[canIndex].length) {
        this.tracks[canIndex] = 'idle'
      }
      bulletContainer.remove()
    })
  }

  // 监听点击或hover事件做一些额外的处理
  private _addExtraEvent() {
    if (this.options.pauseOnClick) {
      eventEntrust(this.target, 'click', BULLETCLASS, el => {
        let currStatus = el.style.animationPlayState
        if (currStatus == 'paused' && el.dataset.clicked) {
          el.dataset.clicked = ''
          this._toggleAnimateStatus(el, 'running')
        } else {
          el.dataset.clicked = 'true'
          this._toggleAnimateStatus(el, 'paused')
        }
      })
    }

    if (this.options.pauseOnHover) {
      eventEntrust(this.target, 'mouseover', BULLETCLASS, el => {
        this._toggleAnimateStatus(el, 'paused')
      })

      eventEntrust(this.target, 'mouseout', BULLETCLASS, el => {
        this._toggleAnimateStatus(el, 'running')
      })
    }
  }

  private _render = (container: HTMLElement, track: number) => {
    /**
     * container：弹幕容器
     * track：跑道索引
     */
    if (this.isAllPaused) return // 如果是全部暂停状态，停止push，停止render
    container.dataset.track = track + ''
    container.style.top = track * this.options.trackHeight + 'px'
    this.target.appendChild(container)

    // 检测 queues
    if (this.queues.length) {
      const obj = this.queues.shift()
      // 重试
      this.push(obj.item, obj.opts, true)
    }
  }

  /**
   *
   * 额外操作 api ========================================================
   * */

  //  获取弹幕列表
  public getBulletsList() {
    return this.bullets.reduce((acc, cur) => [...cur, ...acc], [])
  }
  // 切换状态
  private _toggleAnimateStatus = (el, status = 'paused') => {
    if (el) {
      if (status === 'running') {
        el.style.animationPlayState = 'running'
        el.style.zIndex = 0
        el.classList.remove('bullet-item-paused')
      } else {
        el.style.animationPlayState = 'paused'
        el.style.zIndex = 99999
        el.classList.add('bullet-item-paused')
      }
      return
    }

    if (this.pauseArrs.length && status == 'paused') return
    this.pauseArrs = this.getBulletsList()
    this.pauseArrs.forEach(item => {
      item.style.animationPlayState = status
    })
    this.pauseArrs = []
  }

  // 暂停
  public pause(el = null) {
    this._toggleAnimateStatus(el, 'paused')
    if (el === null) {
      this.isAllPaused = true
    }
  }
  // 重新开始
  public resume(el = null) {
    this._toggleAnimateStatus(el, 'running')
    this.isAllPaused = false
  }
}
