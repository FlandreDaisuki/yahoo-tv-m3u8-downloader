const RES_NAME = {
  0x00: '高畫質(1080p)',
  0x10: '中畫質(540p)',
  0x20: '低畫質(360p)',
};

browser.tabs.query({ currentWindow: true, active: true })
  .then((tabs) => {
    console.debug('pa::tabs', tabs);

    if (tabs.length > 1) {
      console.warn('pa::tabs length > 1');
    }
    const tab = tabs[0];

    return browser.runtime.sendMessage({ q: 'tabDatabase', tabId: tab.id });
  })
  .then((resp) => {
    console.debug('pa::resp', resp);

    resp.res.forEach((m3u8, index) => {
      const btn = document.createElement('button');
      btn.textContent = RES_NAME[index & 0xF0];
      btn.addEventListener('click', () => {
        const blob = new Blob([m3u8], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${resp.name}.m3u8`, { autoBOM: false });
      });
      document.body.appendChild(btn);
      if (document.body.children.length === 1) {
        btn.classList.add('first');
      }
    });

    console.debug('pa::body.children', document.body.children);
  });
