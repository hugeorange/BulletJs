
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
  style.innerHTML = animateString + bulletContainer;
  document.head.appendChild(style);
};


/**
 * 获取弹幕item
 * @param {*} opts 
 */
export const getContainer = opts => {
  const {
    currScreen,
    pauseOnHover,
    pauseOnClick,
    animate,
    duration,
  } = opts;
  // 创建单条弹幕的容器
  const bulletContainer = document.createElement('div');
  bulletContainer.classList.add("bullet-item-style")
  bulletContainer.style.animationDuration = duration;


  // 隐藏
  // if (currScreen.allHide) {
  //   bulletContainer.style.opacity = 0;
  // }

  // // pause on hover
  // if (pauseOnHover) {
  //   bulletContainer.addEventListener('mouseenter', () => {
  //     bulletContainer.style.animationPlayState = 'paused';
  //   }, false);

  //   bulletContainer.addEventListener('mouseleave', () => {
  //     if (!currScreen.allPaused && !bulletContainer.dataset.clicked) {
  //       bulletContainer.style.animationPlayState = 'running';
  //     }
  //   }, false);
  // }

  // // pauseonClick
  // if (pauseOnClick) {
  //   bulletContainer.addEventListener('click', e => {
  //     let currStatus = bulletContainer.style.animationPlayState;
  //     if (currStatus == 'paused' && bulletContainer.dataset.clicked) {
  //       bulletContainer.dataset.clicked = '';
  //       bulletContainer.style.animationPlayState = 'running';
  //     } else {
  //       bulletContainer.dataset.clicked = 'true';
  //       bulletContainer.style.animationPlayState = 'paused';
  //     }
  //   }, false);
  // }
  return bulletContainer;
};



/**
 * 获取 [min, max] 的随机数
 * @param {*} min 
 * @param {*} max 
 */
export const getRandom = (min, max) => parseInt(Math.random() * (max - min + 1)) + min
