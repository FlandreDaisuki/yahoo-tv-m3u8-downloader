browser.runtime.onMessage.addListener((request) => {
  // console.debug('content::request', request);

  switch (request.q) {
  case 'name': {
    const nameEl = document.querySelector('.video-tab-container h1');
    const ans = Object.assign({ name: null }, request);
    if (nameEl) {
      ans.name = nameEl.textContent;
    }
    // console.debug('content::ans', ans);
    browser.runtime.sendMessage(ans);
    break;
  }

  default:
    break;
  }
});
