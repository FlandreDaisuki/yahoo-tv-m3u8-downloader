const database = {};
/* {
  [tabId: Number]: {
    name: String,
    res: new Map() // (resCode: String) ⇒ ({ m3u8: String, height: Number })
  },
}
*/

const demuxer = new TSDemuxer();

// ** Playlist flow **

// Step (1), trigger by m3u8 request
browser.webRequest.onHeadersReceived.addListener(
  headersReceivedPlaylistListener,
  { urls: ['https://*.cdn.yimg.com/*'] },
  ['blocking', 'responseHeaders']
);

function headersReceivedPlaylistListener(details) {
  const { responseHeaders, tabId, requestId } = details;
  const hMap = headersToMap(responseHeaders);

  if (hMap.get('Content-Type') === 'application/vnd.apple.mpegurl') {
    // console.debug('bg::m3u8::details', details);

    const { pathname } = new URL(details.url);
    const resCode = pathname.replace(/.*(_\d+)\.m3u8$/, '$1');
    // console.debug('bg::m3u8::resCode', resCode);

    const db = getTabDatabase(tabId);
    const resData = db.res.get(resCode);
    if (resData && resData.m3u8) {
      return;
    }

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

      // console.debug('bg::m3u8', m3u8);

      browser.pageAction.hide(tabId).then(() => {
        // Step (2-2), ask name from content_scripts
        browser.tabs.sendMessage(tabId, { q: 'name', m3u8, resCode });
      });
    };
  }
}

// Step (3), answer name from content_scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.debug('bg::onMessage', request, sender);

  if (request.q === 'name') {
    const tabId = sender.tab.id;
    const db = getTabDatabase(tabId);
    if (db.name !== request.name) {
      db.name = request.name;
      db.res = new Map();
    }

    const { resCode, m3u8 } = request;
    db.res.set(resCode, { m3u8 });

    // m3u8 done
    browser.pageAction.show(tabId);
  } else if (request.q === 'tabDatabase') {
    // Step (4), wait until user click the icon
    sendResponse(getTabDatabase(request.tabId));
  }
});

// ** Stream fragments flow **

// Step (1), trigger by m2ts request
browser.webRequest.onHeadersReceived.addListener(
  headersReceivedM2TSListener,
  { urls: ['https://*.cdn.yimg.com/*'] },
  ['blocking', 'responseHeaders']
);

function headersReceivedM2TSListener(details) {
  const { responseHeaders, tabId, requestId } = details;
  const hMap = headersToMap(responseHeaders);

  if (hMap.get('Content-Type') === 'video/mp2t') {
    // console.debug('bg::m2ts::details', details);

    const { pathname } = new URL(details.url);
    const resCode = pathname.replace(/.*(_\d+)_\d+\.ts$/, '$1');
    // console.debug('bg::m2ts::resCode', resCode);

    const db = getTabDatabase(tabId);
    const resData = db.res.get(resCode);

    if (resData && !resData.height) {
      const arraybuffers = [];

      const filter = browser.webRequest.filterResponseData(requestId);
      // Step (2), collect arraybuffers
      filter.ondata = (event) => {
        arraybuffers.push(event.data);
        filter.write(event.data);
      };

      filter.onstop = () => {
        filter.disconnect();

        const typedArraybuffer = cancatTypedArray(Uint8Array, ...arraybuffers.map((ab) => new Uint8Array(ab)));

        // console.debug('bg::typedArraybuffer', typedArraybuffer);

        // Step (3), demux stream
        console.time('bg::demuxer');
        demuxer.reset(typedArraybuffer);
        console.timeEnd('bg::demuxer');

        if (demuxer._avcTrack) {
          // console.debug('bg::demuxer._avcTrack.height', demuxer._avcTrack.height);

          resData.height = demuxer._avcTrack.height;
        }
      };
    }
  }
}

// ** Helper functions **

function getTabDatabase(id) {
  if (!database[id]) {
    database[id] = {
      name: null,
      res: new Map(),
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

// ref: https://github.com/dmnsgn/concat-typed-array/
function cancatTypedArray(ResultConstructor, ...arrays) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new ResultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
