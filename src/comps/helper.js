
/**
 * 插入样式
 * @param {*} width 
 */
export const initBulletAnimate = (width) => {
	let style = document.createElement('style');
	const animateClass = 'BULLET_ANIMATE';
	style.classList.add(animateClass);

	let from = `from { visibility: visible; transform: translateX(${width}px); }`;
	let to = `to { visibility: visible; transform: translateX(-100%); }`;

	const animateString = `@keyframes RightToLeft { ${from} ${to} }`

	const bulletContainer = `
    .bullet-item-style {
		cursor: pointer;
		position: absolute;
		left: 0;
		animation-name: RightToLeft;
		animation-timing-function: linear;
		will-change: transform;
	}
	`
	const bulletTempContainer = `
	.bullet-temp-container {
		position: absolute;
		right: 9999px;
		visibility: hidden;
	}
	`
	style.innerHTML = animateString + bulletContainer + bulletTempContainer;
	document.head.appendChild(style);
};


/**
 * 获取弹幕item
 * @param {*} opts 
 */
export const getContainer = opts => {
	const { duration } = opts;
	// 创建单条弹幕的容器
	const bulletContainer = document.createElement('div');
	bulletContainer.id = Math.random().toString(36).substring(2);
	bulletContainer.classList.add("bullet-item-style")
	bulletContainer.style.animationDuration = duration;

	return bulletContainer;
};



/**
 * 获取 [min, max] 的随机数
 * @param {*} min 
 * @param {*} max 
 */
export const getRandom = (min, max) => parseInt(Math.random() * (max - min + 1)) + min;


/**
 * 事件委托
 * @param {*} target 绑定事件的元素
 * @param {*} className 需要执行绑定事件的元素的 class
 * @param {*} cb 执行的回调
 */
export function eventEntrust(target, event, className, cb) {
	target.addEventListener(event, e => {
		var el = e.target
		//判断当前点击的元素是否为指定的classname，如果不是，执行以下的while循环
		while (!el.className.includes(className)) {
			//如果点击的元素为target，直接跳出循环（代表未找到目标元素）
			if (el === target) {
				el = null
				break;
			}
			//否则，将当前元素父元素赋给el
			// console.log('whild循环中...')
			el = el.parentNode
		}
		if (el) {
			// console.log('找到目标元素')
			cb(el)
		} else {
			// console.log('你触发的不是目标元素')
		}
	})
}
