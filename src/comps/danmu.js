import { initBulletAnimate, getContainer } from './helper';

// 基础配置
const defaultOptions = {
  isCustomeQueue: false, // 是否自动消费 queues，true：可能会出现重叠
  trackHeight: 50, // 跑道高度
  gap: '0px', // 弹幕之间的间距
  animate: 'RightToLeft',
  pauseOnHover: false,
  pauseOnClick: false,
  onStart: null,
  onEnd: null,
  loopCount: 1,
  duration: 10,
  speed: 100, // 100px/s 
  delay: 0,
  direction: 'normal',
  animateTimeFun: 'linear'
};


export default class Danmujs {
  target = null;
  bullets = {}; // 弹幕存储器 ==> 各跑道内所对应的弹幕
  tracks = []; // 轨道列表
  queues = []; // 来不及消费的弹幕存储列表
  targetW = 0; // 舞台宽度
  pauseArrs = []; // 暂停队列
  constructor(ele, opts = {}) {
    this.options = Object.assign(defaultOptions, opts);
    this.options.observeOpt = {
      root: this.target,
      rootMargin: `0px ${this.options.gap} 0px 0px`,
      threshold: [1],
    }

    this.ele = ele;
    this.initScreen()
    this.initOpt()
  }

  // 设置弹幕目标
  initScreen() {
    if (typeof this.ele === 'string') {
      this.target = document.querySelector(this.ele);
      if (!this.target) throw new Error('The display target does not exist');
    } else if (this.ele instanceof HTMLElement) {
      this.target = this.ele;
    } else {
      throw new Error('The display target of the barrage must be set');
    }
  }

  // 初始化配置
  initOpt() {
    const { trackHeight } = this.options;
    const { width, height } = this.target.getBoundingClientRect();
    this.tracks = new Array(Math.floor(height / trackHeight)).fill('idle');
    this.targetW = width

    // 屏幕目标必须具备的CSS样式
    const { position } = getComputedStyle(this.target);
    if (position === 'static') {
      this.target.style.position = 'relative';
      // this.target.style.overflow = 'hidden';
    }
    initBulletAnimate(this.target, this.targetW); // 插入css animation
  }

  // 获取空闲跑道
  _getTrack() {
    let readyIdxs = [];
    let idx = -1;
    // 优先去 idle 状态
    this.tracks.forEach((v, idx) => v === 'idle' && readyIdxs.push(idx))
    if (readyIdxs.length) {
      idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
    }

    // 其次取 feed 状态的
    if (idx !== -1) {
      this.tracks.forEach((v, idx) => v === 'feed' && readyIdxs.push(idx))
      if (readyIdxs.length) {
        idx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
      }
    }

    if (idx !== -1) {
      this.tracks[idx] = 'running'
    }

    return idx;
  }

  // push 可针对具体一条弹幕设置特殊配置
  push(item, opts = {}) {
    const options = Object.assign({}, this.options, opts);

    const bulletContainer = getContainer({...options, currScreen: this });

    const currIdletrack = this._getTrack();

    if (currIdletrack === -1) {
      this.queues.push([item, bulletContainer]);
    } else {
      // 塞入弹幕存储器
      if (this.bullets[currIdletrack]) {
        this.bullets[currIdletrack].push(bulletContainer)
      } else {
        this.bullets[currIdletrack] = [bulletContainer]
      }
      this._render(item, bulletContainer, currIdletrack);
      this.addEvent(bulletContainer, currIdletrack);
    }

    return bulletContainer.id;
  }

  addEvent(bulletContainer, currIdletrack) {
    const { onStart, onEnd } = this.options;
    // 创建一个监听弹幕动画开始的事件
    bulletContainer.addEventListener('animationstart', () => {
      if (onStart) onStart.call(null, bulletContainer.id, this);
    });

    // 创建一个监听弹幕动画完成的事件
    bulletContainer.addEventListener('animationend', () => {
      // console.log(currIdletrack,' --->运动结束...', this.tracks)
      if (onEnd) onEnd.call(null, bulletContainer.id, this);

      // 从集合中剔除
      this.bullets[currIdletrack] = this.bullets[currIdletrack].filter(v => v.id !== bulletContainer.id)

      const len = this.bullets[currIdletrack].length
      if (!len) {
        this.tracks[currIdletrack] = 'idle'
      } else {
        // 似乎不需要了 IntersectionObserver 的情况可以覆盖此场景
        // const ele = this.bullets[currIdletrack][len-1]
        // const obj = ele.getBoundingClientRect();
        // if (obj.left + obj.width < this.targetW) {
        //   this.tracks[currIdletrack] = 'feed';
        // }
      }
      bulletContainer.remove();
    });
  }

  _render = (item, container, track) => {
    console.log('this.queues--->', this.queues, this.tracks, this.bullets)
    /**
     * item：弹幕内容
     * container：弹幕容器
     * track：跑道索引
     */

    
    const { trackHeight, speed } = this.options;

    
    container.dataset.track = track;
    container.style.top = track * trackHeight + 'px';
    container.innerHTML = item;

    this.target.appendChild(container);
    if (speed) {
      const duration = (this.targetW + container.offsetWidth) / speed;
      container.style.animationDuration = duration + 's';
    }
    

    // 监测该条弹幕的运动情况，是否可腾出空间
    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const { intersectionRatio, target } = entry;
        let trackIdx = target.dataset.track;
        if (intersectionRatio >= 1) {
          // console.log('---->我执行了...', intersectionRatio)
          if (this.options.isCustomeQueue && this.queues.length) {
            this.checkQueue(trackIdx)
          } else {
            this.tracks[trackIdx] = 'feed';
          }
        }
      });
    }, this.options.observeOpt);
    observer.observe(container);
  };


  checkQueue(trackIdx) {
    if (this.queues.length) {
      const [item, container] = this.queues.shift();
      this._render(item, container, trackIdx);
    }
  }


  // 额外操作 api ========================================================
  //  获取弹幕列表
  getBulletsArr() {
    return Object.values(this.bullets).reduce((acc, cur) => [...acc, ...cur], [])
  }
  // 切换状态
  _toggleAnimateStatus = (id, status = 'paused') => {
    if (this.pauseArrs.length && status == 'paused') return;

    this.pauseArrs = this.getBulletsArr()

    const currItem = this.pauseArrs.find(item => item.id == id);
    if (currItem) {
      currItem.style.animationPlayState = status;
      return;
    }

    this.pauseArrs.forEach(item => item.style.animationPlayState = status);
    this.pauseArrs = []
  };

  // 暂停
  pause(id = null) {
    this._toggleAnimateStatus(id, 'paused');
  }
  // 重新开始
  resume(id = null) {
    this._toggleAnimateStatus(id, 'running');
  }
}
