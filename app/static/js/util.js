class Util {
  async init() {
    return false;
  }

  /**
   * cookie
   */
  isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
      return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
      return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
      return true;
    }

    return false;
  }

  setCookie(name, value, options) {
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var s = [cookie, expires, path, domain, secure].join('');
    var secure = options.secure ? '; secure' : '';
    var c = [name, '=', encodeURIComponent(value)].join('');
    var cookie = [c, expires, path, domain, secure].join('')

    if (!this.isElectron()) {
      options = options || {};
      document.cookie = cookie;
    } else {
      const electron = window.require('electron');

      const cookissse = { url: "http://localhost:8484", name: name, value: value }

      electron.remote.session.defaultSession.cookies.set(cookissse)
        .then(() => {
          //
        }, (error) => {
          console.error(error)
        })
    }
  }

  async getCookie(name) {
    var cookieValue = null;

    if (!this.isElectron()) {
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
  }
  else  {
    const electron = window.require('electron');
    cookieValue = await electron.remote.session.defaultSession.cookies.get({url: "http://localhost:8484", name: name})
      .then((cookies) => {
         return cookies[0].value
      }, (error) => {
        console.error(error)

      })
    }
    return cookieValue;

  }
}

let util = new Util;

export default util;
