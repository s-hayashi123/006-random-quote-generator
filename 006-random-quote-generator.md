# 006: ランダム名言ジェネレーター (API 利用)

## 1. 概要

外部の API からランダムな名言を取得し、画面に表示するアプリケーションを作成する。ボタンをクリックするたびに、新しい名言に切り替わる。

## 2. 要件定義

- [x] 画面には名言を表示するエリアと、その名言の作者を表示するエリアがある。
- [x] 「新しい名言を取得」ボタンがある。
- [x] ページが最初に読み込まれたとき、自動的に名言を 1 つ取得して表示する。
- [x] 「新しい名言を取得」ボタンをクリックすると、API にリクエストを送信し、新しい名言と作者に表示を更新する。
- [x] API からデータを取得している間、ローディングスピナーなどのインジケーターを表示する。
- [x] API リクエストが失敗した場合、ユーザーにエラーメッセージを表示する。
- [x] （オプション）取得した名言を Twitter で共有するボタンを設置する。

## 3. 技術スタック

- **フレームワーク/ライブラリ:** React
- **言語:** TypeScript
- **開発環境:** Vite
- **データ取得:** `fetch` API, `axios`, または React Query/SWR
- **API:** [Quotable](https://github.com/lukePeavey/quotable) や [Type.fit](https://type.fit/api/quotes) などの無料の名言 API

## 4. 学習ポイント

- **React Hooks:**
  - `useState`: 取得した名言データ、ローディング状態、エラー状態を管理する。
  - `useEffect`: コンポーネントの初回マウント時に API リクエストを実行するために使用する。依存配列は`[]`にする。
  - `useCallback`: API リクエストを行う関数をメモ化し、不要な再生成を防ぐ。特に、その関数を子コンポーネントに渡す場合に有効。
- **非同期処理:**
  - `async/await`を使ったモダンな非同期処理の書き方。
  - `fetch`や`axios`を使った API への GET リクエスト。
  - `Promise`の基本的な扱いと、`.then().catch()`構文。
- **TypeScript:**
  - API から返ってくる JSON データの構造に合わせて`interface`や`type`を定義する。
  - `useState`にジェネリクスを使って、状態の型を明示する（例: `useState<Quote | null>(null)`）。
- **状態管理:**
  - `data`, `loading`, `error` の 3 つの状態を管理し、UI を適切に分岐させる（条件付きレンダリング）。これは非同期通信を扱う UI の基本パターン。

## 5. 設計考察

- **データ取得ライブラリの選定:**
  - **`fetch` API:** ブラウザ標準の機能。追加のライブラリは不要だが、JSON への変換やエラーハンドリングを自前で記述する必要がある。
  - **`axios`:** `fetch`をラップした人気のライブラリ。JSON への変換が自動で行われたり、タイムアウト設定があったりと、より高機能で使いやすい。
  - **React Query / SWR:** API 通信の状態管理（`data`, `loading`, `error`）を抽象化し、キャッシュ、再検証、ページネーションなどの高度な機能を簡単に実装できる。この課題のレベルではオーバースペックかもしれないが、導入してみることで将来的な大規模開発への足がかりとなる。
  - **結論:** まずは`fetch`や`axios`で基本を学び、余裕があれば React Query に挑戦するのが良い学習ステップとなる。
- **API レスポンスの型付け:**
  - API のドキュメントをよく読み、返ってくるデータの構造を正確に型定義することが重要。これにより、`response.data.content`のようなプロパティアクセスが型安全になり、タイポなどのミスを防げる。
- **コンポーネント分割:**
  - `QuoteCard.tsx`: 名言と作者を表示するコンポーネント。
  - `LoadingSpinner.tsx`: ローディング中に表示するスピナー。
  - `ErrorMessage.tsx`: エラー発生時に表示するメッセージ。
  - このように UI を状態に応じて分割すると、メインコンポーネントがスッキリする。

## 6. 開発手順

1.  **プロジェクト作成:** Vite で React + TypeScript プロジェクトを初期化。
2.  **API 選定:** 使用する名言 API を決め、ドキュメントを読んでエンドポイントとレスポンスの形式を確認する。
3.  **型定義:** API のレスポンスに合わせた`Quote`型（例: `{ content: string; author: string; }`）を定義する。
4.  **状態の初期化:** `useState`を使い、`quote`（名言データ）、`isLoading`、`error`の状態を初期化する。
5.  **API 取得関数の実装:**
    - `async`関数として`fetchQuote`を作成する。
    - `try...catch`ブロックを使い、成功時と失敗時の処理を分ける。
    - 処理の開始時に`setIsLoading(true)`、終了時に`setIsLoading(false)`を呼ぶ。
    - 成功したら`setQuote`でデータをセットし、`setError(null)`でエラー状態をリセットする。
    - 失敗したら`setError`でエラーメッセージをセットする。
6.  **初回データ取得:** `useEffect`を使い、コンポーネントのマウント時に一度だけ`fetchQuote`を呼び出す。
7.  **UI 実装:**
    - `isLoading`が`true`ならローディングスピナーを表示。
    - `error`が存在するならエラーメッセージを表示。
    - `quote`が存在するなら名言と作者を表示。
    - 「新しい名言を取得」ボタンに`onClick`イベントを設定し、`fetchQuote`を呼び出す。
8.  **（オプション）Twitter 共有機能:**
    - 名言と作者を含んだ Twitter の Web Intent URL を生成する。
    - `<a>`タグの`href`にその URL を設定する。

## 7. 実装ヒント

- **`fetch`でのエラーハンドリング:** `fetch`はネットワークエラー以外（例: 404, 500 エラー）では Promise を reject しない。`response.ok`プロパティをチェックして手動でエラーを`throw`する必要がある。
  ```typescript
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("データの取得に失敗しました。");
  }
  const data: Quote = await response.json();
  ```
- **Twitter Web Intent URL:**
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote.content + " - " + quote.author)}`
