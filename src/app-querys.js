window.BVQuerys = (() => {
  const SERVER_ADDRESS = window.SERVER_ADDRESS || ('http://' + location.hostname + ':3001');
  const _oriFetch = window.fetch;
  const fetch = (url, options, noRetry) => {
    return _oriFetch(url, Object.assign({
      credentials: 'include'
    }, ...options))
      .catch(ex => {
        console.error('Failed to fetch', ex);
        if (noRetry) {
          window['global-error-toast'].text = 'Oops, network error!';
          window['global-error-toast'].open();
          throw ex;
        }
        else return new Promise((resolve) => {
          console.log('fetch retry in 1500ms: ', url, options);
          setTimeout(() => {
            resolve(fetch(url, options, true));
          }, 1500);
        });
      });
  };

  function handleAppValues(result, options = {}) {
    if (result.error) {
      if (result.error.type === 'NEED_CAPTCHA') {
        // TODO: Sign in expires, redirect to login page
        window.history.pushState(null, null, '/login/');
        window.dispatchEvent(new CustomEvent('location-changed'));
      } else if (result.error.type === 'NEED_LOGIN') {
        window.history.pushState(null, null, '/login/needCipher');
        window.dispatchEvent(new CustomEvent('location-changed'));
      }
      throw result.error;
    }
    if (result.userInfo) {
      window.dispatchEvent(new CustomEvent('userinfo-change', {detail: result.userInfo}));
    }
    if (result.csrf) {
      window.csrfToken = result.csrf;
    }
    if (result.userInfo && result.userInfo.csrf) {
      window.onceToken = result.userInfo.csrf;
    }
    // handle notification count
    try {
      if ('notificationCount' in result && !options.keepNotificationCount) {
        window.t.set('app.notificationCount', result.notificationCount);
      }
    } catch (ex) {
      console.error(ex);
    }

    return result;
  }
  function stringifyParams(obj) {
    let str = '';
    for (let key in obj) {
      if (obj[key] === undefined) continue;
      str += `${str ? '&' : ''}${key}=${obj[key]}`;
    }
    return str;
  }
  function normalizeTopic(t) {
    let index = t.indexOf('#');
    if (~index) t = t.substr(0, index);
    return t;
  }
  let sids = {};
  function getSID(name = 'default') {
    if (!sids[name]) sids[name] = 0;
    return sids[name]++;
  }
  return {
    SERVER_ADDRESS,
    async recent(page) {
      let result = await (await fetch(SERVER_ADDRESS + '/recent' + (page !== void 0 ? '?page=' + page : ''), {mode: 'cors'})).json();
      handleAppValues(result);
      return result;
    },
    async node(name, page) {
      let result = await (await fetch(SERVER_ADDRESS + '/node?' + 'name=' + name + (page !== void 0 ? '&page=' + page : ''), {mode: 'cors'})).json();
      handleAppValues(result);
      return result;
    },
    async topic(t, page) {
      t = normalizeTopic(t);
      let result = await (await fetch(SERVER_ADDRESS + '/topic?t=' + t + (page !== void 0 ? '&page=' + page : ''))).json();
      handleAppValues(result);
      return result;
    },
    async notifications(currentCount, page = 1) {
      let result = await (await fetch(SERVER_ADDRESS + '/notifications?page=' + page)).json();
      handleAppValues(result, {
        keepNotificationCount: true
      });
      return result;
    },
    alterFollowing(status, topic, title) {
      return fetch(SERVER_ADDRESS + `/alterFollowing?following=${status}&topic=${topic}&title=${title}`, {
        method: 'POST'
      }).then(res => res.json());
    },
    collected(page = 1) {
      return fetch(`${SERVER_ADDRESS}/collected?page=${page}`)
        .then(ret => ret.json());
    },
    nodes() {
      return fetch(`${SERVER_ADDRESS}/nodes`)
        .then(ret => ret.json());
    },
    blockUser(memberId, memberName, actionToken) {
      return fetch(`${SERVER_ADDRESS}/block?member=${memberId}&memberName=${memberName}&action=${actionToken}`)
        .then(ret => ret.json());  
    },
    unblockUser(memberId, memberName, actionToken) {
      return fetch(`${SERVER_ADDRESS}/unblock?member=${memberId}&memberName=${memberName}&action=${actionToken}`)
        .then(ret => ret.json());  
    },
    async reply(t, content, once) {
      const form = new FormData();
      form.append('content', content);
      form.append('once', once);
      return await (await fetch(SERVER_ADDRESS + '/reply?t=' + t, {
        method: 'POST',
        body: form
      })).json();
    },
    createTopic(node, title, content, once = window.onceToken) {
      const form = new FormData();
      form.append('title', title);
      form.append('content', content);
      form.append('once', once);
      return fetch(`${SERVER_ADDRESS}/createTopic?node=${node}`, {
        method: 'POST',
        body: form
      })
        .then(res => res.json());
    },
    async collect(t, action) {
      t = normalizeTopic(t);
      return await (await fetch(SERVER_ADDRESS + '/collect?t=' + t + '&action=' + action, {
        method: 'POST'
      })).json();
    },
    async uncollect(t, action) {
      t = normalizeTopic(t);
      return await (await fetch(SERVER_ADDRESS + '/uncollect?t=' + t + '&action=' + action, {
        method: 'POST'
      })).json();
    },
    async like(t, action) {
      t = normalizeTopic(t);
      return await (await fetch(SERVER_ADDRESS + '/likePost?t=' + t + '&action=' + action, {
        method: 'POST'
      })).json();
    },
    likeComment(t, action = window.onceToken) {
      return fetch(SERVER_ADDRESS + '/likeComment?t=' + t + '&action=' + action, {
        method: 'POST'
      });
    },
    member(member, type, page) {
      return fetch(SERVER_ADDRESS + '/member?' + stringifyParams({
        member,
        type,
        page
      }))
        .then(ret => ret.json())
        .then(handleAppValues);
    },
    submitCipher(cipher) {
      return fetch(SERVER_ADDRESS + '/cipher?cipher=' + cipher)
        .then(ret => ret.json());
    },
    async signIn(captcha) {
      return await (await fetch(SERVER_ADDRESS + '/login?captcha=' + captcha, {
        method: 'GET'
      })).json()
        .then((ret) => {
          return ret.success;
        });
    }
  };
})();
