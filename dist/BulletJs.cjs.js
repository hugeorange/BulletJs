'use strict';

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

/**
 * 插入样式
 * @param {*} width 
 */
var initBulletAnimate = function initBulletAnimate(width) {
  var style = document.createElement('style');
  var animateClass = 'BULLET_ANIMATE';
  style.classList.add(animateClass);
  var from = "from { visibility: visible; transform: translateX(".concat(width, "px); }");
  var to = "to { visibility: visible; transform: translateX(-100%); }";
  var animateString = "@keyframes RightToLeft { ".concat(from, " ").concat(to, " }");
  var bulletContainer = "\n    .bullet-item-style {\n\t\tcursor: pointer;\n\t\tposition: absolute;\n\t\tleft: 0;\n\t\tanimation-name: RightToLeft;\n\t\tanimation-timing-function: linear;\n\t\twill-change: transform;\n\t}\n\t";
  var bulletTempContainer = "\n\t.bullet-temp-container {\n\t\tposition: absolute;\n\t\tright: 9999px;\n\t\tvisibility: hidden;\n\t}\n\t";
  style.innerHTML = animateString + bulletContainer + bulletTempContainer;
  document.head.appendChild(style);
};
/**
 * 获取弹幕item
 * @param {*} opts 
 */

var getContainer = function getContainer(opts) {
  var duration = opts.duration; // 创建单条弹幕的容器

  var bulletContainer = document.createElement('div');
  bulletContainer.id = Math.random().toString(36).substring(2);
  bulletContainer.classList.add("bullet-item-style");
  bulletContainer.style.animationDuration = duration;
  return bulletContainer;
};
/**
 * 获取 [min, max] 的随机数
 * @param {*} min 
 * @param {*} max 
 */

var getRandom = function getRandom(min, max) {
  return parseInt(Math.random() * (max - min + 1)) + min;
};
/**
 * 事件委托
 * @param {*} target 绑定事件的元素
 * @param {*} className 需要执行绑定事件的元素的 class
 * @param {*} cb 执行的回调
 */

function eventEntrust(target, event, className, cb) {
  target.addEventListener(event, function (e) {
    var el = e.target; //判断当前点击的元素是否为指定的classname，如果不是，执行以下的while循环

    while (!el.className.includes(className)) {
      //如果点击的元素为target，直接跳出循环（代表未找到目标元素）
      if (el === target) {
        el = null;
        break;
      } //否则，将当前元素父元素赋给el
      // console.log('whild循环中...')


      el = el.parentNode;
    }

    if (el) {
      // console.log('找到目标元素')
      cb(el);
    }
  });
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultOptions = {
  trackHeight: 50,
  // 跑道高度
  pauseOnHover: false,
  pauseOnClick: false,
  onStart: null,
  onEnd: null,
  duration: "10s",
  speed: 100 // 100px/s 

};

var BulletJs = /*#__PURE__*/function () {
  // 临时弹幕容器
  // 当前push的弹幕对象信息
  // 弹幕存储器 ==> 各跑道内所对应的弹幕
  // 轨道列表
  // 用户自己发送的的弹幕存储列表
  // 舞台宽度
  // 暂停队列
  function BulletJs(ele) {
    var _this = this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    classCallCheck(this, BulletJs);

    defineProperty(this, "target", null);

    defineProperty(this, "tempContanier", null);

    defineProperty(this, "bulletInfo", {});

    defineProperty(this, "bullets", []);

    defineProperty(this, "tracks", []);

    defineProperty(this, "queues", []);

    defineProperty(this, "targetW", 0);

    defineProperty(this, "pauseArrs", []);

    defineProperty(this, "_render", function (container, track) {
      /**
       * container：弹幕容器
       * track：跑道索引
       */
      container.dataset.track = track;
      container.style.top = track * _this.options.trackHeight + 'px';

      _this.target.appendChild(container); // 检测 queues


      if (_this.queues.length) {
        var obj = _this.queues.shift(); // 重试


        _this.push(obj.item, obj.opts, true);
      }
    });

    defineProperty(this, "_toggleAnimateStatus", function (el) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'paused';

      if (el) {
        if (status === "running") {
          el.style.animationPlayState = 'running';
          el.style.zIndex = 0;
          el.classList.remove('bullet-item-paused');
        } else {
          el.style.animationPlayState = 'paused';
          el.style.zIndex = 99999;
          el.classList.add('bullet-item-paused');
        }

        return;
      }

      if (_this.pauseArrs.length && status == 'paused') return;
      _this.pauseArrs = _this.getBulletsList();

      _this.pauseArrs.forEach(function (item) {
        item.style.animationPlayState = status;
      });

      _this.pauseArrs = [];
    });

    this.options = Object.assign(defaultOptions, opts);
    this.ele = ele;
    this.initScreen();
    this.initOpt();
    this.initTempContainer();

    this._addExtraEvent();
  } // 设置弹幕目标


  createClass(BulletJs, [{
    key: "initScreen",
    value: function initScreen() {
      if (typeof this.ele === 'string') {
        this.target = document.querySelector(this.ele);
        if (!this.target) throw new Error('The display target does not exist');
      } else if (this.ele instanceof HTMLElement) {
        this.target = this.ele;
      } else {
        throw new Error('The display target of the barrage must be set');
      }
    } // 初始化配置

  }, {
    key: "initOpt",
    value: function initOpt() {
      var trackHeight = this.options.trackHeight;
      this.targetPos = this.target.getBoundingClientRect();
      var trackNum = Math.floor(this.targetPos.height / trackHeight);
      this.tracks = new Array(trackNum).fill('idle');
      this.bullets = new Array(trackNum).fill([]);
      this.targetW = this.targetPos.width; // 屏幕目标必须具备的CSS样式

      var _getComputedStyle = getComputedStyle(this.target),
          position = _getComputedStyle.position;

      if (position === 'static') {
        this.target.style.position = 'relative';
        this.target.style.overflow = 'hidden';
      } // 插入css animation


      initBulletAnimate(this.targetW);
    } // 初始化一个弹幕临时容器，为后期获取高度

  }, {
    key: "initTempContainer",
    value: function initTempContainer() {
      this.tempContanier = document.createElement('div');
      this.tempContanier.classList.add('bullet-temp-container');
      document.body.appendChild(this.tempContanier);
    } // push 可针对具体一条弹幕设置特殊配置

  }, {
    key: "push",
    value: function push(item) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var isSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var options = Object.assign({}, this.options, opts);
      var bulletContainer = getContainer(_objectSpread(_objectSpread({}, options), {}, {
        currScreen: this
      }));
      bulletContainer.innerHTML = item; // 为了获取当前弹幕的宽度，故必须要将其先插入到document中

      this.tempContanier.appendChild(bulletContainer);
      this.bulletInfo = {
        width: bulletContainer.offsetWidth
      };
      var duration = 0; // 假如传入速度参数

      if (options.speed) {
        duration = (this.targetW + this.bulletInfo.width) / options.speed; // 根据speed给弹幕对象设置 duration 属性

        bulletContainer.style.animationDuration = duration + 's';
      } else {
        duration = +options.duration.slice(0, -1);
      } // 将duration作为弹幕固有属性存储


      bulletContainer.dataset.duration = duration;
      this.bulletInfo.duration = duration; // 删除临时存储弹幕容器里的弹幕

      bulletContainer.remove();

      var canIndex = this._getTrackIndex();

      if (canIndex === -1) {
        if (isSelf) {
          // 没有多余轨道的情况，自己发的弹幕先保存起来
          this.queues.push({
            item: item,
            opts: opts
          });
        } // console.log('没有多余轨道，直接丢弃弹幕')

      } else {
        // 塞入弹幕存储器
        if (this.bullets[canIndex].length) {
          this.bullets[canIndex].push(bulletContainer);
        } else {
          this.bullets[canIndex] = [bulletContainer];
        }

        this._render(bulletContainer, canIndex);

        this._addEvent(bulletContainer, canIndex, options);
      }

      return bulletContainer.id;
    } // 获取空闲跑道

  }, {
    key: "_getTrackIndex",
    value: function _getTrackIndex() {
      var readyIdxs = [];
      var index = -1; // 优先去 idle 状态

      this.tracks.forEach(function (v, idx) {
        return v === 'idle' && readyIdxs.push(idx);
      });

      if (readyIdxs.length) {
        var random = getRandom(0, readyIdxs.length - 1);
        index = readyIdxs[random];
        this.tracks[index] = 'running';
        return index;
      } // 没有轨道空闲，丛上到下巡检各轨道，选出可执行弹幕轨道


      for (var i = 0; i < this.bullets.length; i++) {
        var len = this.bullets[i].length;

        if (len) {
          var item = this.bullets[i][len - 1];

          if (item && this._checkTrack(item)) {
            return i;
          }
        }
      }

      return index;
    } // 判断该条轨道是否可执行弹幕

  }, {
    key: "_checkTrack",
    value: function _checkTrack(item) {
      // 思路来源 https://www.zhihu.com/question/370464345
      var itemPos = item.getBoundingClientRect(); // 轨道中最后一个元素尚未完全进入展示区域，直接跳出

      if (itemPos.right > this.targetPos.right) {
        return false;
      } // 轨道中最后一个元素已完全进去展示区域
      // 速度相同，只要初始条件满足即可，不用去关系追及问题


      if (this.options.speed) {
        if (itemPos.right < this.targetPos.right) return true;
      } else {
        // 原弹幕速度
        var v1 = (this.targetW + itemPos.width) / item.dataset.duration;
        /**
         * 新弹幕
         * s2：全程距离
         * t2：全程时间
         * v2：速度
         */

        var s2 = this.targetW + this.bulletInfo.width;
        var t2 = this.bulletInfo.duration;
        var v2 = s2 / t2;

        if (v2 <= v1) {
          return true;
        } else {
          // 小学时代的追及问题：t = s / v  比较时间：t1, t2
          // 原弹幕跑完剩余全程所需要的时间
          var t1 = (itemPos.right - this.targetPos.left) / v1; // 新弹幕头部跑完全程所需要的时间

          var _t = this.targetW / v2; // console.log('前面的--->', t1, t2, '后面的时间', v1)


          if (_t < t1) {
            return false;
          }
        }
      }

      return true;
    } // 绑定事件

  }, {
    key: "_addEvent",
    value: function _addEvent(bulletContainer, canIndex, options) {
      var _this2 = this;

      var onStart = options.onStart,
          onEnd = options.onEnd; // 监听弹幕开始的事件

      bulletContainer.addEventListener('animationstart', function () {
        if (onStart) onStart.call(window, bulletContainer.id, _this2);
      }); // 监听弹幕完成的事件

      bulletContainer.addEventListener('animationend', function () {
        if (onEnd) onEnd.call(window, bulletContainer.id, _this2); // 从集合中剔除已经结束的动画

        _this2.bullets[canIndex] = _this2.bullets[canIndex].filter(function (v) {
          return v.id !== bulletContainer.id;
        });

        if (!_this2.bullets[canIndex].length) {
          _this2.tracks[canIndex] = 'idle';
        }

        bulletContainer.remove();
      });
    } // 监听点击或hover事件做一些额外的处理

  }, {
    key: "_addExtraEvent",
    value: function _addExtraEvent() {
      var _this3 = this;

      if (this.options.pauseOnClick) {
        eventEntrust(this.target, 'click', 'bullet-item-style', function (el) {
          console.log('el-click---->', el);
          var currStatus = el.style.animationPlayState;

          if (currStatus == 'paused' && el.dataset.clicked) {
            el.dataset.clicked = '';

            _this3._toggleAnimateStatus(el, 'running');
          } else {
            el.dataset.clicked = 'true';

            _this3._toggleAnimateStatus(el, 'paused');
          }
        });
      }

      if (this.options.pauseOnHover) {
        eventEntrust(this.target, 'mouseover', 'bullet-item-style', function (el) {
          _this3._toggleAnimateStatus(el, 'paused');
        });
        eventEntrust(this.target, 'mouseout', 'bullet-item-style', function (el) {
          _this3._toggleAnimateStatus(el, 'running');
        });
      }
    }
  }, {
    key: "getBulletsList",

    /**
     *
     * 额外操作 api ========================================================  
     * */
    //  获取弹幕列表
    value: function getBulletsList() {
      return this.bullets.reduce(function (acc, cur) {
        return [].concat(toConsumableArray(cur), toConsumableArray(acc));
      }, []);
    } // 切换状态

  }, {
    key: "pause",
    // 暂停
    value: function pause() {
      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this._toggleAnimateStatus(el, 'paused');
    } // 重新开始

  }, {
    key: "resume",
    value: function resume() {
      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this._toggleAnimateStatus(el, 'running');
    }
  }]);

  return BulletJs;
}();

module.exports = BulletJs;
//# sourceMappingURL=BulletJs.cjs.js.map
