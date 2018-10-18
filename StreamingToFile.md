# 從 m3u8 轉檔至 mp4

## Linux(Ubuntu)

### 安裝依賴及腳本

```sh
$ apt install ffmpeg
```

將轉換腳本放到 `~/bin` 內

```sh
$ mkdir -p ~/bin # 如果沒有該資料夾就創一個
$ cd ~/bin       # 切換 cwd
$ touch m3u8-to-mp4 # 創一個檔案，將下面的複製貼上
$ chmod 755 m3u8-to-mp4 # 設定權限
```

`~/bin/m3u8-to-mp4` 內容

```sh
#!/bin/sh

set -e

IFS='
'
for fullname in `ls *.m3u8`; do
  filename=$(basename "$fullname")
  name="${filename%.*}"
  ffmpeg -i "$filename" -c copy -bsf:a aac_adtstoasc "${name}.mp4"
done
```

### 如何使用

假設有一個資料夾已經載好所有 m3u8

```
.
├── 某某動畫EP01 完整版.m3u8
├── ...
├── ...
└── 某某動畫EP13 完整版.m3u8
```

```sh
$ cd "該資料夾"
$ ~/bin/m3u8-to-mp4 # 若 PATH 有 ~/bin 時可只打 m3u8-to-mp4
```

## Windows

PR 希望
