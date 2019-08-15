(function (global) {
  global.BVUtils = {};
  global = global.BVUtils;

  class LongtouchHandlers {
    touchStart(ev, target) {
      target = target || ev.target;
      if (this._touchTimer) {
        clearTimeout(this._touchTimer);
      }
      this._touchTimer = setTimeout(() => {
        this._touchTimer = null;
        if (this._longTouchListening) {
          ev.preventDefault();
          target.dispatchEvent(new CustomEvent('longtouch', {detail: {target}, composed: true}));
        }
      }, 500);
      this._lastTouchStartTime = Date.now();
      this._longTouchListening = true;
      this._lastTouchPosition = {
        x: ev.changedTouches[0].clientX,
        y: ev.changedTouches[0].clientY
      };
    }
    touchEnd(ev) {
      this._longTouchListening = false;
    }
    touchMove(ev) {
      if (!this._longTouchListening) return;
      let now = {
        x: ev.changedTouches[0].clientX,
        y: ev.changedTouches[0].clientY
      };
      let diffX = now.x - this._lastTouchPosition.x;
      let diffY = now.y - this._lastTouchPosition.y;
      if (diffX * diffX + diffY * diffY >= 100) {
        this._longTouchListening = false;
        return;
      }
    }
  }

  global.LongtouchHandlers = LongtouchHandlers;

  global.throttle = (fn, time, immediate = false) => {
    let throttling = false;
    let lastArgs;
    let lastContext;
    return function () {
      lastArgs = arguments;
      lastContext = this;

      if (!throttling) {
        throttling = true;
        if (immediate) {
          fn.apply(lastContext, lastArgs);
        }
        setTimeout(() => {
          if (!immediate) {
            fn.apply(lastContext, lastArgs);
          }
          throttling = false;
        }, time);
      }
    };
  };

  global.pSetTimeout = function (timeout, args) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(args);
      }, timeout);
    });
  };

  const USER_STORAGE_KEY = 'bv_user_storage';
  global.userStorage = {
    get(key) {
      const keys = key.split('.');
      let root = JSON.parse(localStorage.getItem(USER_STORAGE_KEY + '_' + keys[0]));
      if (!root) return root;
      if (keys.length === 1) return root;
      let obj = root;
      for (let i = 1, len = keys.length - 1; i < len; i++) {
        if (!obj[keys[i]]) return obj[keys[i]];
        obj = obj[keys[i]];
      }
      return obj[keys[keys.length - 1]];
    },
    set(key, value) {
      const keys = key.split('.');
      let root = JSON.parse(localStorage.getItem(USER_STORAGE_KEY + '_' + keys[0])) || {};
      if (keys.length === 1) root = value;
      else {
        let obj = root;
        for (let i = 1, len = keys.length - 1; i < len; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
      }
      localStorage.setItem(USER_STORAGE_KEY + '_' + keys[0], JSON.stringify(root));
    }
  };

  global.settings = {
    load(obj, namespace, initialValue) {
      const settings = global.userStorage.get(namespace) || initialValue;
      if (settings) {
        for (let key in settings) {
          if (Object.prototype.hasOwnProperty.call(settings, key)) {
            obj[key] = settings[key];
          }
        }
      }

      return obj;
    },
    save(obj, namespace, initialValue) {
      let toSave = {};
      for (let key in initialValue) {
        toSave[key] = key in obj ? obj[key] : initialValue[key];
      }

      global.userStorage.set(namespace, toSave);
    },
    getItem(namespace, path, initialValue) {
      const settings = global.userStorage.get(namespace) || initialValue;
      
      if (path) return settings[path];
      return settings;
    }
  };

  global.normalizeTopic = (t) => {
    let index = t.indexOf('#');
    if (~index) return t.substr(0, index);
    return t;
  };

  global.getReplyCount = (t) => {
    let index = t.indexOf('#reply');
    if (~index) return t.substr(index + 6);
    else return 0;
  };

})(this);
