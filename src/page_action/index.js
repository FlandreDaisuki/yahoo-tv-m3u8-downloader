const RES_NAME = {
  1080: '高畫質 (1080p)',
  720: '高畫質 (720p)',
  540: '中畫質 (540p)',
  360: '低畫質 (360p)',
  240: '低畫質 (240p)',
};

browser.tabs.query({ currentWindow: true, active: true })
  .then((tabs) => {
    // console.debug('pa::tabs', tabs);

    if (tabs.length > 1) {
      console.warn('pa::tabs length > 1');
    }
    const tab = tabs[0];

    return browser.runtime.sendMessage({ q: 'tabDatabase', tabId: tab.id });
  })
  .then((resp) => {
    // console.debug('pa::resp', resp);

    [...resp.res.values()]
      .filter((resData) => resData.height && resData.m3u8)
      .sort((a, b) => {
        return b.height - a.height;
      })
      .forEach(({ height, m3u8 }) => {
        // console.debug('pa::resData', { height, m3u8 });

        const btn = document.createElement('button');
        btn.textContent = RES_NAME[height];
        btn.addEventListener('click', () => {
          const blob = new Blob([m3u8], { type: 'text/plain;charset=utf-8' });
          saveAs(blob, `${resp.name}.m3u8`, { autoBOM: false });
        });
        document.body.appendChild(btn);
        if (document.body.children.length === 1) {
          btn.classList.add('first');
        }
      });

    // console.debug('pa::body.children', document.body.children);
  });
