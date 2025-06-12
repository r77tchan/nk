# nk

このリポジトリは React Router を使ったフルスタックアプリケーションのテンプレートです。Vite をベースに開発効率を高める設定が一通り揃っています。

## 特徴
- サーバーサイドレンダリング対応
- ホットモジュールリプレースメント (HMR)
- アセットの最適化
- データのロードとミューテーション
- TypeScript 対応
- Tailwind CSS によるスタイリング

## 推奨環境
- Node.js 18 以降

## セットアップ
依存関係をインストールします。
```bash
npm install
```
開発サーバーを起動するには次のコマンドを実行します。
```bash
npm run dev
```
ブラウザで <http://localhost:5173> を開くとアプリケーションが表示されます。

## ビルド
本番用のビルドを生成するには以下を実行します。
```bash
npm run build
```
ビルド成果物は `build` ディレクトリに出力されます。

## GitHub Pages へのデプロイ
このプロジェクトは GitHub Pages でホストできます。事前に `npm run build` を実行した後、以下のコマンドで静的ファイルを `gh-pages` ブランチへ公開します。
```bash
npm run deploy
```
公開されたサイトは以下の URL で閲覧できます。

<https://r77tchan.github.io/nk/>

デプロイデータは `gh-pages` ブランチに保存されます。

## カスタマイズのヒント
- Tailwind の設定を変更してデザインを自由に拡張できます。
- `app/routes` 以下にファイルを追加することで簡単にルートを増やせます。
- 自動テストを導入したい場合は Jest や Testing Library の利用がおすすめです。
- GitHub Actions を使えば CI/CD を構築してデプロイを自動化できます。

## ライセンス
MIT License
