# 認証 (Authentication)

## 概要

Meta Ads API は OAuth 2.0 Authorization Code Flow で認証します。

## セットアップ手順

### 1. Metaアプリの作成

1. [Meta for Developers](https://developers.facebook.com/) にアクセス
2. 「マイアプリ」→「アプリを作成」
3. アプリタイプ: 「ビジネス」を選択
4. Marketing API 製品を追加

### 2. アプリ設定

- アプリID（App ID）を控える
- 設定 → ベーシック → App Secret を控える
- Facebook Login の設定:
  - 有効なOAuthリダイレクトURI: `http://localhost:9876/callback`
  - Client OAuth Login: ON
  - Web OAuth Login: ON

### 3. 必要な権限（スコープ）

| スコープ | 説明 |
|----------|------|
| `ads_management` | 広告の作成・管理 |
| `ads_read` | 広告データの読み取り |
| `business_management` | ビジネスマネージャへのアクセス |
| `read_insights` | インサイトデータの読み取り |

### 4. MCP設定

```
meta_ads_configure({
  ad_account_id: "act_XXXXX",
  app_id: "あなたのアプリID",
  app_secret: "あなたのApp Secret"
})
```

### 5. 認証実行

```
meta_ads_authenticate()
```

ブラウザが開き、Facebookログイン画面が表示されます。

## トークンの有効期限

- Short-lived token: 約1-2時間
- Long-lived token: 約60日（MCPが自動的に交換）
- 期限切れ後は再度 `meta_ads_authenticate` を実行

## 広告アカウントIDの確認

```
meta_ads_api_get({ path: "/me/adaccounts", query: { fields: "id,name,account_status" } })
```

## トラブルシューティング

### 「OAuthException」エラー
- トークンが期限切れ → `meta_ads_authenticate` で再認証
- 権限不足 → アプリの権限設定を確認

### 「Invalid OAuth 2.0 Access Token」
- `meta_ads_auth_status` でトークン状態を確認
- 期限切れなら再認証

### アプリレビュー
- 開発モードでは自分のアカウントのみアクセス可能
- 他ユーザーのアカウントにアクセスするにはアプリレビューが必要
