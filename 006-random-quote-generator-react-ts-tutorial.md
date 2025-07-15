# 【React & TypeScript】API連携で作る！ランダム名言ジェネレーター開発チュートリアル (006)

このチュートリアルでは、`web-dev-100-challenge`の課題`006`に基づき、外部APIと連携してランダムな名言を表示するWebアプリケーションを、最新のフロントエンド環境で構築します。

**【お詫び】**
度重なる情報の誤り、誠に申し訳ございませんでした。本チュートリアルは、ご指定いただいた公式ドキュメント [shadcn/ui - Installation: Vite](https://ui.shadcn.com/docs/installation/vite) の手順に、今度こそ正確に基づき作成しています。

## 🎯 学習ゴール

- Vite環境でTailwind CSSとshadcn/uiを公式ドキュメント通りにセットアップできる。
- `async/await`を用いたモダンな非同期処理を理解し、実装できる。
- APIから取得したデータの状態（ローディング、成功、エラー）を管理し、UIに反映できる。

---

## 🛠️ 環境構築 (shadcn/ui for Vite 公式ドキュメント準拠)

### Step 1: Viteプロジェクトの作成

```bash
# 1. Vite + React + TypeScript のプロジェクトを作成します
# (公式ドキュメントはpnpmを例にしていますが、npmでも同様です)
npm create vite@latest 006-random-quote-generator -- --template react-ts

# 2. プロジェクトディレクトリに移動します
cd 006-random-quote-generator
```

### Step 2: Tailwind CSSの追加

ここがご指摘のポイントです。Vite用のパッケージをインストールします。

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 3: CSSファイルの編集

`src/index.css` の中身を以下の一行に置き換えます。

```css
/* src/index.css */
@import "tailwindcss";
```

### Step 4: tsconfig.json の設定

`compilerOptions` に `baseUrl` と `paths` を追加します。

```json
// tsconfig.json
{
  "compilerOptions": {
    // ... (既存のオプション)
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  // ... (既存の設定)
}
```

### Step 5: vite.config.ts の更新

1.  Viteがパスエイリアスを解決するために `@types/node` をインストールします。

    ```bash
    npm install -D @types/node
    ```

2.  `vite.config.ts` を更新し、`@tailwindcss/vite` をプラグインとして追加します。

    ```typescript
    // vite.config.ts
    import path from "path"
    import tailwindcss from "@tailwindcss/vite"
    import react from "@vitejs/plugin-react"
    import { defineConfig } from "vite"

    export default defineConfig({
      plugins: [react(), tailwindcss()], // tailwindcss() を追加
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    })
    ```

### Step 6: shadcn/ui の初期化

`dlx` を使って `init` コマンドを実行します。

```bash
# npm v7以降が必要です
npx shadcn-ui@latest init
```

表示される質問に回答して、プロジェクトのセットアップを完了します。

### Step 7: 必要なコンポーネントの追加

```bash
npx shadcn-ui@latest add card button
```

---

## 💻 実装ステップ (変更なし)

(ここからの実装ステップは前回と同様です)

### Step 1: APIの確認と型定義

```tsx
// src/App.tsx

// TODO: APIから返ってくるJSONの構造に合わせて、Quoteという名前のinterfaceを定義してみましょう。
// 最低限、content（名言）とauthor（作者）のキーがあれば動作します。


function App() {
  // ...
}

export default App;
```

### Step 2: 状態管理の設計

```tsx
// src/App.tsx 内の App コンポーネント
import { useState } from 'react';

// TODO: 3つの状態を管理するためのuseStateを定義してください。
// 1. quote: APIから取得した名言オブジェクト(Quote型)またはnullを保持します。
// 2. isLoading: データを取得中かどうかを示す真偽値(boolean)です。初期値はtrueとしましょう。
// 3. error: エラーメッセージ(string)またはnullを保持します。

```

### Step 3: API通信ロジックの実装

```tsx
// src/App.tsx 内の App コンポーネント
import { useState, useCallback } from 'react';

// TODO: `fetchQuote`という名前で、名言を取得する非同期関数を`useCallback`を使って定義しましょう。
//
// --- 関数の思考プロセス ---
// 1. 通信開始前： `isLoading`をtrueに、`error`をnullにリセットします。
// 2. `try...catch`構文で囲む： API通信には失敗がつきものです。
// 3. `fetch`でAPIを叩く： `await`を忘れずに。
// 4. `response.ok`をチェック： サーバーエラー(404, 500など)を検知します。okでなければエラーをthrowします。
// 5. 成功時： レスポンスをJSONに変換し、`quote`ステートを更新します。
// 6. 失敗時(catchブロック)： エラーオブジェクトからメッセージを取り出し、`error`ステートを更新します。
// 7. `finally`ブロック： 成功・失敗にかかわらず、`isLoading`をfalseにします。

```

### Step 4: 初回読み込み時のデータ取得

```tsx
// src/App.tsx 内の App コンポーネント
import { useState, useCallback, useEffect } from 'react';

// TODO: `useEffect`フックを使い、コンポーнентが最初に一度だけレンダリングされた後に`fetchQuote`関数を実行してください。
// ヒント： useEffectの第二引数である依存配列をどうすれば「最初の一度だけ」を実現できるでしょうか？

```

### Step 5: UIの構築と条件分岐

```tsx
// src/App.tsx の return 文の中
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

return (
  <div className="min-h-screen bg-background text-foreground flex justify-center items-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Random Quote Generator</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[150px] flex justify-center items-center">
        {
          // TODO: ここに条件分岐を実装します。
          // 1. isLoadingがtrueなら？ -> ローディング中だとわかる表示をしましょう。
          // 2. errorにメッセージがあるなら？ -> エラーメッセージを表示しましょう。
          // 3. quoteにデータがあるなら？ -> 名言と作者を表示しましょう。
          // 4. それ以外は？ -> 何も表示しない、でOKです。
        }
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          // TODO: ボタンがクリックされたら`fetchQuote`が実行されるようにしてください。
          // TODO: isLoadingがtrueの間、ボタンは押せないように(disabled)してください。
        >
          {/* TODO: isLoadingがtrueならボタンのテキストを"Loading..."に、そうでなければ"Get New Quote"にしてください。 */}
        </Button>
      </CardFooter>
    </Card>
  </div>
);
```