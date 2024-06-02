export const BULLETCLASS = '__bullet-item-style'
export const BULLETTEMPCLASS = '__bullet-temp-container'

/**
 * 插入样式
 * @param {*} width
 */
export const initBulletAnimate = (width: number): void => {
  let style = document.createElement('style')
  const animateClass = 'BULLET_ANIMATE'
  style.classList.add(animateClass)

  let from = `from { visibility: visible; transform: translateX(${width}px); }`
  let to = `to { visibility: visible; transform: translateX(-100%); }`

  const animateString = `@keyframes RightToLeft { ${from} ${to} }`

  const bulletContainer = `
  .${BULLETCLASS} {
		cursor: pointer;
		position: absolute;
		left: 0;
		animation-name: RightToLeft;
		animation-timing-function: linear;
		overflow: hidden;
		display: inline-block;
		word-break: keep-all;
		white-space: nowrap;
	}`

  const bulletTempContainer = `
	.${BULLETTEMPCLASS} {
		position: absolute;
		right: 9999px;
		visibility: hidden;
	}`

  style.innerHTML = animateString + bulletContainer + bulletTempContainer
  document.head.appendChild(style)
}

/**
 * 获取弹幕item
 * @param {*} opts
 */

export type ItrackObj = {
  speed: number
  // 后续可能还会增加其他属性，先以对象表示
}

export interface IoptsType {
  trackHeight?: number
  trackArr?: ItrackObj[]
  pauseOnHover?: boolean
  pauseOnClick?: boolean
  onStart?: Function | null
  onEnd?: Function | null
  duration?: string
  speed?: number
}

// 创建单条弹幕的容器
export const getContainer = (): HTMLElement => {
  const bulletContainer = document.createElement('div')
  bulletContainer.id = Math.random().toString(36).substring(2)
  bulletContainer.classList.add(BULLETCLASS)
  return bulletContainer
}

/**
 * 获取 [min, max] 的随机数
 * @param {*} min
 * @param {*} max
 */
export const getRandom = (min: number, max: number): number =>
  parseInt((Math.random() * (max - min + 1)) as any) + min

/**
 * 事件委托
 * @param {*} target 绑定事件的元素
 * @param {*} className 需要执行绑定事件的元素的 class
 * @param {*} cb 执行的回调
 */
export function eventEntrust(
  target: HTMLElement,
  event: 'click' | 'mouseover' | 'mouseout' | 'mousemove',
  className: string,
  cb: (el: HTMLElement) => void,
) {
  target.addEventListener(event, e => {
    let el = e.target as HTMLElement

    // 判断当前点击的元素是否为指定的classname，如果不是，执行以下的while循环
    while (!el.className.includes(className)) {
      // 如果点击的元素为target，直接跳出循环（代表未找到目标元素）
      if (el === target) {
        el = null
        break
      }
      //否则，将当前元素父元素赋给el
      // console.log('whild循环中...')
      el = el.parentNode as HTMLElement
    }
    if (el) {
      // console.log('找到目标元素')
      cb(el)
    } else {
      // console.log('你触发的不是目标元素')
    }
  })
}
