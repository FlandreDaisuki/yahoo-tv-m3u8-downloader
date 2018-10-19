# 從 m3u8 轉檔至 mp4

- [從 m3u8 轉檔至 mp4](#從-m3u8-轉檔至-mp4)
  - [Linux(Ubuntu)](#linuxubuntu)
    - [安裝依賴及腳本](#安裝依賴及腳本)
    - [如何使用](#如何使用)
  - [Windows](#windows)

## Linux(Ubuntu)

### 安裝依賴及腳本

```sh
$ apt install ffmpeg
```

將轉換腳本放到 `~/bin` 內

```sh
# 如果沒有該資料夾就創一個
$ mkdir -p ~/bin

# 用 wget 或 curl 下載到 ~/bin
$ wget -O ~/bin/m3u8-to-mp4 https://raw.githubusercontent.com/FlandreDaisuki/yahoo-tv-m3u8-downloader/master/script/m3u8-to-mp4

$ curl -o ~/bin/m3u8-to-mp4 https://raw.githubusercontent.com/FlandreDaisuki/yahoo-tv-m3u8-downloader/master/script/m3u8-to-mp4

# 設定執行權限
$ chmod 755 ~/bin/m3u8-to-mp4
```

### 如何使用

假設有一個資料夾(範例路徑: `~/桌面/某某動畫`)已經載好所有 m3u8

```txt
~/桌面/某某動畫
├── 某某動畫EP01 完整版.m3u8
├── ...
├── ...
└── 某某動畫EP13 完整版.m3u8
```

```sh
$ cd ~/桌面/某某動畫
$ ~/bin/m3u8-to-mp4 # 若 PATH 有 ~/bin 時可只打 m3u8-to-mp4
```

## Windows

PR 希望
