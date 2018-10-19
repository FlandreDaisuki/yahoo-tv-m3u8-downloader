const RES_ENUM = {
  // 1080p
  _31: 0x00,
  _11: 0x01,

  // 540p
  _35: 0x10,
  _10: 0x11, // 有時是 1080p 有時是 540p，取差者
  _9: 0x12,

  // 360p
  _36: 0x20,
  _34: 0x21,
  _8: 0x22,
  _7: 0x23,
};

const database = {};
/* {
  [tabId: Number]: {
    name: String,
    res: m3u8String[]
  },
}
*/

// Step (1), trigger by m3u8 request
browser.webRequest.onHeadersReceived.addListener(
  headersReceivedListener,
  { urls: ['https://*.cdn.yimg.com/*'] },
  ['blocking', 'responseHeaders']
);

function headersReceivedListener(details) {
  const { responseHeaders, tabId, requestId } = details;
  const hMap = headersToMap(responseHeaders);

  if (hMap.get('Content-Type') === 'application/vnd.apple.mpegurl') {
    console.debug('bg::details', details);

    const { pathname } = new URL(details.url);
    const resCode = pathname.replace(/.*(_\d+)\.m3u8$/, '$1');
    console.debug('bg::resCode', resCode);

    const filter = browser.webRequest.filterResponseData(requestId);
    const decoder = new TextDecoder('utf-8');
    let m3u8 = '';

    // Step (2-1), copy m3u8 to database
    filter.ondata = (event) => {
      m3u8 += decoder.decode(event.data, { stream: true });
      filter.write(event.data);
    };

    filter.onstop = () => {
      filter.disconnect();

      console.debug('bg::m3u8', m3u8);

      browser.pageAction.hide(tabId).then(() => {
        // Step (2-2), ask name from content_scripts
        browser.tabs.sendMessage(tabId, { q: 'name', m3u8, resCode });
      });
    };
  }
}

// Step (3), answer name from content_scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.debug('bg::onMessage', request, sender);

  if (request.q === 'name') {
    const tabId = sender.tab.id;
    const db = getTabDatabase(tabId);
    if (db.name !== request.name) {
      db.name = request.name;
      db.res = [];
    }
    db.res[RES_ENUM[request.resCode]] = request.m3u8;
    // m3u8 done
    browser.pageAction.show(tabId);
  } else if (request.q === 'tabDatabase') {
    // Step (4), wait until user click the icon
    sendResponse(getTabDatabase(request.tabId));
  }
});

function getTabDatabase(id) {
  if (!database[id]) {
    database[id] = {
      name: null,
      res: [],
    };
  }

  return database[id];
}

function headersToMap(h) {
  return h.reduce((prev, curr) => {
    prev.set(curr.name, curr.value);
    return prev;
  }, new Map());
}
