# Yahoo TV m3u8 下載

- [Yahoo TV m3u8 下載](#yahoo-tv-m3u8-下載)
    - [起因](#起因)
    - [安裝](#安裝)
        - [一般使用者](#一般使用者)
        - [開發者](#開發者)
    - [使用](#使用)
    - [授權與聲明](#授權與聲明)

## 起因

受不了[動畫瘋的編碼](https://www.ptt.cc/bbs/C_Chat/M.1538547978.A.AE6.html)了... 主要是拿來看動畫。

## 安裝

### 一般使用者

到本專案 [Releases](https://github.com/FlandreDaisuki/yahoo-tv-m3u8-downloader/releases) 頁面下載最新的 xpi 檔案，拉到火狐即可。

### 開發者

1. clone 本專案
2. 打開火狐進入 **about:debugging** ，選<kbd>載入暫用附加元件</kbd>
3. 選本專案的 `src/manifest.json`
4. 若需要除錯可勾選 **啟用附加元件除錯**，並點選本附加元件的<kbd>除錯</kbd>打開控制台

若想打包成 xpi 可用 [web-ext](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext) 打包

```sh
$ web-ext sign -c web-ext.config.js --api-key $你的API帳號 --api-secret $你的API密鑰
```

## 使用

1. 到可播放動畫的頁面 (e.g. [登山少女第三季 EP1](https://tw.tv.yahoo.com/encouragement-of-climb_s3/%E5%89%8D%E9%80%B2%E5%90%A7-%E7%99%BB%E5%B1%B1%E5%B0%91%E5%A5%B3-%E7%AC%AC%E4%B8%89%E5%AD%A3ep01-%E5%AE%8C%E6%95%B4%E7%89%88-023000765.html))
2. 網址列會出現一個 ![Y icon](src/icons/Y16.png) 圖示
3. 點圖示會出現選單，點你想下載的畫質就可以下載了
    - 本附加元件是利用攔截封包的方式拿到 m3u8
    - 如果沒有你要的畫質請多切換幾次，(應該)就可以攔截到高畫質的版本

至於如何將 m3u8 轉換成 mp4 請看[教學](StreamingToFile.md)

## 授權與聲明

本專案為學術交流用途，所有影片所有權及播放權由原網站所屬。

The MIT License (MIT)

Copyright (c) 2018 FlandreDaisuki\<vbnm123c@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
