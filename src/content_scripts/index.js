browser.runtime.onMessage.addListener(request => {
  console.debug('content::request', request);

  switch (request.q) {
  case 'name': {
    const nameEl = document.querySelector('.video-tab-container h1');
    const ans = { q: 'name', name: null };
    if (nameEl) {
      ans.name = nameEl.textContent;
    }
    browser.runtime.sendMessage(ans);
    break;
  }

  case 'download': {
    const info = request.body;

    if (info.text && info.name) {
      const blob = new Blob([info.text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${info.name}.m3u8`, { autoBOM: false });
    } else {
      console.warn('some info loss...');
    }
    break;
  }

  default:
    break;
  }
});
