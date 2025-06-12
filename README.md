# nk

ファイル / テキスト の比較、抽出、編集ツール（没）
重いファイルをブラウザに読み込むのは流石に厳しいので、Python でやったほうがいいなということで没になった。

## URL
https://r77tchan.github.io/nk/

## 特徴
- Vite / React Router v7 を使用
- [Codex](https://openai.com/ja-JP/index/introducing-codex/) を使用したバイブコーディング

## 注意
一部コマンドは Windows 向けです。
```
"postbuild": "copy build\\client\\index.html build\\client\\404.html",
```
macOS や Linux（Unix系）では copy コマンドが使えないため、package.json の postbuild を次のように変更してください：
```
"postbuild": "cp build/client/index.html build/client/404.html",
```
※ Windows では `copy`、Unix系では `cp` を使う必要があります。

## メモ
scripts の `predeploy` は `deploy` の前に自動実行される
