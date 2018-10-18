const database = {};
/* {
  [tabId: Number]: {
    name: String,
    text: String
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

    browser.pageAction.hide(tabId);
    resetDatabase(tabId);

    const filter = browser.webRequest.filterResponseData(requestId);
    const decoder = new TextDecoder('utf-8');
    const encoder = new TextEncoder();

    // Step (2-1), copy m3u8 to database
    filter.ondata = (event) => {
      const m3u8 = decoder.decode(event.data, { stream: true });
      console.debug('bg::m3u8', m3u8);
      insertDatabase(tabId, 'text', m3u8);
      filter.write(encoder.encode(m3u8));
      filter.disconnect();
    };

    // Step (2-2), ask name from content_scripts
    browser.tabs.sendMessage(tabId, { q: 'name' });
  }
}

// Step (3), answer name from content_scripts
browser.runtime.onMessage.addListener((request, sender) => {
  console.debug('bg::onMessage', request, sender);

  if (request.q === 'name') {
    const tabId = sender.tab.id;
    insertDatabase(tabId, 'name', request.name);
    // m3u8 done
    browser.pageAction.show(tabId);
  }
});

// Step (4), wait until user click the icon
browser.pageAction.onClicked.addListener((tab) => {
  const tabId = tab.id;
  console.debug('bg::pageAction.onClicked -> tab', tab);
  browser.tabs.sendMessage(tabId, { q: 'download', body: database[tabId] });
});


function resetDatabase(id) {
  database[id] = {};
}

function insertDatabase(id, key, value) {
  if (!database[id]) {
    resetDatabase(id);
  }
  database[id][key] = value;
}

function headersToMap(h) {
  return h.reduce((prev, curr) => {
    prev.set(curr.name, curr.value);
    return prev;
  }, new Map());
}
