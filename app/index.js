const { ipcRenderer } = require('electron');

const closeEl = document.querySelector('.close');

const indexPage = {
  timer: 0,
  el: {
    btnStart: document.getElementById('btnStart'),
    btnPase: document.getElementById('btnPase'),
    files: document.getElementById('files'),
    btnImport: document.getElementById('btnImport'),
    result: document.getElementById('result'),
    lucky: document.getElementById('lucky'),
  },
  status: {
    pase: false,
  },
  data: [],
  lucky: [],
  token: [ '张磊' ],
  showKeyCache: 0,
  start() {
    this.status.pase = false;
    const that = this;
    this.timer = setInterval(function() {
      if (!that.data.length) {
        clearInterval(that.timer);
        alert('请选导入参与抽奖的名单');
        return;
      }
      that.show();
    }, 100);
  },
  getShowkey() {
    this.showKeyCache = Math.floor(Math.random() * this.data.length);
    return this.showKeyCache;
  },
  getTokenkey() {
    const that = this;
    let key = this.showKeyCache;
    this.token.forEach(function(v) {
      that.data.forEach(function(d, didx) {
        if (d.indexOf(v) !== -1) {
          key = didx;
        }
      });
    });
    this.showKeyCache = key;
    return key;
  },
  show(key) {
    const Showkey = key || this.getShowkey();
    this.el.result.innerHTML = this.data[Showkey];
  },
  pase() {
    if (!this.status.pase) {
      clearInterval(this.timer);
      this.show(this.getTokenkey());
      const lucky = this.data.splice(this.showKeyCache, 1);
      this.lucky = this.lucky.concat(lucky);
      this.showLucky();
    }
    this.status.pase = true;
  },
  showLucky() {
    const r = [];
    this.lucky.forEach(function(l) {
      r.push(`<li>${l}</li>`);
    });
    this.el.lucky.innerHTML = `<ol>${r.join('')}</ol>`;
  },
  importfile() {
    const that = this;
    const selectedFile = document.getElementById('files').files[0];
        // console.log(selectedFile)
    const reader = new window.FileReader();
    reader.readAsText(selectedFile);
    reader.onload = function() {
      that.lucky = [];
      that.data = eval(`[${this.result.replace(/(\S+)\n?/g, '"$1",')}]`);
    };
  },

  initEvent() {
    const that = this;
    that.el.btnStart.addEventListener('click', function() {
      that.start();
    });
    that.el.btnPase.addEventListener('click', function() {
      that.pase();
    });
    that.el.files.addEventListener('change', function() {
      that.importfile();
    });

    that.el.btnImport.addEventListener('click', function() {
      that.el.files.click();
    });
  },
  init() {
    this.initEvent();
  },
};

// indexPage.init();

closeEl.addEventListener('click', function() {
  ipcRenderer.send('close-main-window');
});

const selectDirBtn = document.getElementById('select-directory')

selectDirBtn.addEventListener('click', function (event) {
  ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', function(event, path) {
  document.getElementById('selected-file').innerHTML = `You selected: ${path}`;
});
