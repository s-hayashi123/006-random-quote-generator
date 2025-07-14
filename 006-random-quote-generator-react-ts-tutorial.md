# 【React & TypeScript & Tailwind CSS】名言ジェネレーター開発チュートリアル (006)

このチュートリアルでは、`web-dev-100-challenge`の課題`006`に基づき、外部APIと連携してランダムな名言を表示するWebアプリケーションを、React, TypeScript, そしてTailwind CSSを使いながらステップバイステップで構築します。

非同期処理やAPI連携は現代のWeb開発に必須のスキルです。このチュートリアルを通して、その基本をしっかりとマスターしましょう。

## 🎯 課題の確認

最初に、`006-random-quote-generator.md`で定義されている要件と学習ポイントを再確認します。

- **主要機能**: 外部APIから名言を取得し、表示する。ボタンで新しい名言に更新できる。
- **技術スタック**: React, TypeScript, Vite, Tailwind CSS, `fetch` API
- **学習ポイント**: `useState`, `useEffect`, `useCallback`フック、`async/await`による非同期処理、APIレスポンスの型付け、ローディング・エラー状態の管理

---

## 開発ステップ

### Step 0: 開発環境の準備

Viteを使って、React + TypeScriptのプロジェクトを素早く立ち上げます。

1.  ターミナルを開き、プロジェクトを作成したいディレクトリに移動して、以下のコマンドを実行します。

    ```bash
    npm create vite@latest 006-random-quote-generator -- --template react-ts
    ```

2.  作成されたプロジェクトフォルダに移動し、開発に必要なパッケージをインストールします。

    ```bash
    cd 006-random-quote-generator
    npm install
    ```

### Step 1: Tailwind CSSのセットアップ

次に、モダンなCSSフレームワークであるTailwind CSSをプロジェクトに導入します。

1.  Tailwind CSSとその関連パッケージをインストールします。

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

2.  `tailwind.config.js`を開き、Tailwindがどのファイルに適用されるべきかを設定します。

    ```javascript
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

3.  `src/index.css`を作成し、Tailwind CSSのディレクティブを記述します。

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

4.  `src/main.tsx`で`index.css`をインポートします。

    ```tsx
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.tsx'
    import './index.css' // この行を追加

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    ```

5.  `src/App.css`は不要になるので削除してください。

### Step 2: APIの選定と型定義

今回は[Quotable](https://github.com/lukePeavey/quotable)という無料の名言APIを使用します。

1.  **APIの確認**: `https://api.quotable.io/random` にアクセスすると、ランダムな名言がJSON形式で返ってくることを確認しましょう。

2.  **型定義**: APIから返ってくるデータ構造に合わせて、`src/App.tsx`の先頭に`interface`を定義します。

    ```typescript
    // src/App.tsx

    interface Quote {
      _id: string;
      content: string;
      author: string;
      tags: string[];
      authorSlug: string;
      length: number;
      dateAdded: string;
      dateModified: string;
    }
    ```

### Step 3: アプリの骨格と状態管理

`App.tsx`を編集して、アプリケーションのレイアウトと、APIから取得するデータを管理する「状態（state）」を準備します。

1.  `src/App.tsx` を開き、既存のコードをすべて削除して、以下の様に書き換えます。

    ```tsx
    // src/App.tsx
    import { useState, useEffect, useCallback } from 'react';

    // (ここに先ほど定義したQuoteインターフェース)

    const API_URL = 'https://api.quotable.io/random';

    function App() {
      // TODO: ここにuseStateを使って、名言、ローディング状態、エラー状態を管理する3つのstateを定義してみましょう。
      // ヒント:
      // const [quote, setQuote] = useState<Quote | null>(null);
      // const [isLoading, setIsLoading] = useState<boolean>(true);
      // const [error, setError] = useState<string | null>(null);

      return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center p-4">
          <div className="max-w-2xl w-full bg-gray-900 rounded-lg shadow-lg p-8">
            {/* ここに条件付きレンダリングを実装していく */}
          </div>
        </div>
      );
    }

    export default App;
    ```
    **コード解説:**
    - **レイアウト**: Tailwind CSSを使い、ダークモード風のUIを作成しています。
    - **`useState`**: `quote`（APIレスポンス）、`isLoading`（ローディング状態）、`error`（エラーメッセージ）の3つの状態を管理します。これが非同期通信UIの基本パターンです。

### Step 4: API取得ロジックの実装

`fetch` APIと `async/await` を使って、名言を取得する関数を実装します。

1.  `App`コンポーネント内に、`fetchQuote`関数を`useCallback`フックを使って定義します。

    ```tsx
    // Appコンポーネント内

    const fetchQuote = useCallback(async () => {
      // TODO: ローディング開始のstate更新
      // setError(null); // エラーをリセット

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          // TODO: fetchが成功しなかった場合のエラーをthrowする
          // throw new Error('名言の取得に失敗しました。');
        }
        const data: Quote = await response.json();
        // TODO: 取得したデータをstateにセットする
      } catch (err) {
        // TODO: catchしたエラーをstateにセットする
        // if (err instanceof Error) {
        //   setError(err.message);
        // }
      } finally {
        // TODO: ローディング完了のstate更新
      }
    }, []); // 依存配列は空
    ```
    **コード解説:**
    - **`useCallback`**: `fetchQuote`関数をメモ化します。これにより、コンポーネントが再レンダリングされても、関数は再生成されません。
    - **`try...catch...finally`**: 非同期処理のエラーハンドリングの基本形です。
    - **`response.ok`**: `fetch`はサーバーエラー（404や500）では例外を投げません。`response.ok`が`false`の場合に手動でエラーを投げるのが定石です。

2.  `useEffect`を使って、コンポーネントが最初に表示されたときに`fetchQuote`を呼び出します。

    ```tsx
    // Appコンポーネント内

    useEffect(() => {
      fetchQuote();
    }, [fetchQuote]); // fetchQuoteが変更されたとき（初回のみ）実行
    ```

### Step 5: 条件付きレンダリング

`isLoading`, `error`, `quote`の状態に応じて、表示するUIを切り替えます。

1.  `App.tsx`のJSX部分を以下のように修正します。

    ```tsx
    // return内の <div className="max-w-2xl ..."> の中身

    {isLoading ? (
      <p className="text-center text-lg">Loading...</p>
    ) : error ? (
      <p className="text-center text-red-500 text-lg">{error}</p>
    ) : quote ? (
      <>
        <blockquote className="text-2xl italic font-semibold mb-4">
          "{quote.content}"
        </blockquote>
        <cite className="block text-right text-lg not-italic">- {quote.author}</cite>
      </>
    ) : null}

    <button
      onClick={fetchQuote}
      disabled={isLoading}
      className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
    >
      {isLoading ? '取得中...' : '新しい名言を取得'}
    </button>
    ```
    **コード解説:**
    - **三項演算子**: `isLoading` -> `error` -> `quote` の順で状態をチェックし、対応するUIを表示します。
    - **`disabled`属性**: `isLoading`が`true`の間はボタンを無効化し、連続クリックを防ぎます。

## 🏆 完成！

お疲れ様でした！これでAPIと連携する名言ジェネレーターが完成しました。`// TODO:`の部分を埋めて、実際に動作させてみましょう。

この課題を通して、以下の実践的なスキルを学びました。

- `useState`, `useEffect`, `useCallback`を使った非同期処理の管理
- `fetch`と`async/await`によるAPI通信
- APIレスポンスに対する型付け
- `loading`, `error`, `data`の3状態に基づいたUIの条件付きレンダリング

## 🚀 挑戦課題

さらにスキルアップするために、以下の機能追加に挑戦してみましょう！

- **Easy:** 取得した名言をTwitterで共有するボタンを追加してみましょう。（ヒント: `https://twitter.com/intent/tweet?text=...`）
- **Medium:** ローディング表示を、単純なテキストからスピナーアニメーションに変更してみましょう。（Tailwind CSSでスピナーを作るか、`react-spinners`のようなライブラリを使ってみましょう）
- **Hard:** `localStorage`を使って、最後に取得した名言を保存し、次回ページを開いたときにその名言を初期表示するようにしてみましょう。
