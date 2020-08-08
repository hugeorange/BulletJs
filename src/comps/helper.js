
const initBulletAnimate = (screen, width) => {
  if (!screen) return;
  const animateClass = 'BULLET_ANIMATE';

  let style = document.createElement('style');

  style.classList.add(animateClass);
  document.head.appendChild(style);

  let from = `from { visibility: visible; transform: translateX(${width}px); }`;
  let to = `to { visibility: visible; transform: translateX(-100%); }`;
  style.sheet.insertRule(`@keyframes RightToLeft { ${from} ${to} }`, 0);
};


const getContainer = opts => {
  const {
    currScreen,
    pauseOnHover,
    pauseOnClick,
    animate,
    loopCount,
    direction,
    delay,
    duration,
    animateTimeFun
  } = opts;
  // 创建单条弹幕的容器
  const bulletContainer = document.createElement('div');

  // 随机ID
  bulletContainer.id = Math.random().toString(36).substring(2);

  // 设置弹幕容器的初始样式
  bulletContainer.style.transitionProperty = 'opacity';
  bulletContainer.style.transitionDuration = '0.5s';
  bulletContainer.style.cursor = 'pointer';
  bulletContainer.style.position = 'absolute';
  bulletContainer.style.left = 0;
  bulletContainer.style.visibility = 'hidden';
  bulletContainer.style.animationName = animate;
  bulletContainer.style.animationIterationCount = loopCount;
  bulletContainer.style.animationDelay = isNaN(delay) ? delay : `${delay}s`;
  bulletContainer.style.animationDirection = direction;
  bulletContainer.style.animationDuration = isNaN(duration) ? duration : `${duration}s`;
  bulletContainer.style.animationTimingFunction = animateTimeFun;

  // 性能小优化
  bulletContainer.style.willChange = 'transform';

  // 隐藏
  if (currScreen.allHide) {
    bulletContainer.style.opacity = 0;
  }

  // pause on hover
  if (pauseOnHover) {
    bulletContainer.addEventListener('mouseenter', () => {
      bulletContainer.style.animationPlayState = 'paused';
    }, false);

    bulletContainer.addEventListener('mouseleave', () => {
      if (!currScreen.allPaused && !bulletContainer.dataset.clicked) {
        bulletContainer.style.animationPlayState = 'running';
      }
    }, false);
  }

  // pauseonClick
  if (pauseOnClick) {
    bulletContainer.addEventListener('click', e => {
      let currStatus = bulletContainer.style.animationPlayState;
      if (currStatus == 'paused' && bulletContainer.dataset.clicked) {
        bulletContainer.dataset.clicked = '';
        bulletContainer.style.animationPlayState = 'running';
      } else {
        bulletContainer.dataset.clicked = 'true';
        bulletContainer.style.animationPlayState = 'paused';
      }
    }, false);
  }
  return bulletContainer;
};


export { initBulletAnimate, getContainer };
