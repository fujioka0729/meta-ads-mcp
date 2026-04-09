# meta-ads-mcp

Meta Ads API (Facebook/Instagram広告) を Claude Code から操作するための MCP サーバーと Skills。

キャンペーン管理・広告セット作成・インサイト取得・オーディエンス管理など、Meta Ads の各種 API を Claude Code の会話から直接利用できます。

> **Note**: このプロジェクトは Meta Platforms, Inc. の公式ツールではありません。[Meta Marketing API](https://developers.facebook.com/docs/marketing-apis) の公開仕様をもとに作成した非公式の連携ツールです。

## 構成

```
meta-ads-mcp/
├── MCP サーバー (src/, bin/)    ... APIを実際に叩く「手足」
└── Skills (skills/)             ... APIの使い方を知る「知識」
```

- **MCP サーバー**: 8つの汎用ツール（GET/POST/DELETE + 管理系）を提供
- **Skills**: API リファレンス 7 ファイル + 操作ガイド 6 ファイル

## セットアップ

### 前提条件

- Node.js 18 以上
- Claude Code インストール済み

### Step 1: Meta アプリの作成

1. [developers.facebook.com](https://developers.facebook.com/) にアクセス
2. 「マイアプリ」→「アプリを作成」
3. **アプリタイプは必ず「ビジネス」を選択**（「生活者」だと広告系の権限が使えません）
4. アプリ名を入力（`meta`, `facebook`, `insta` 等の商標は使用不可）
5. ビジネスポートフォリオを選択（任意）
6. 「アプリを作成」をクリック

### Step 2: Marketing API の追加

1. アプリのダッシュボード → 「アプリに製品を追加」
2. 「**マーケティングAPI**」の「設定」をクリック
3. 左メニューに「マーケティングAPI」が追加されることを確認

### Step 3: App ID / App Secret の確認

1. 左メニュー → 「アプリの設定」→「ベーシック」
2. **アプリID** と **app secret**（「表示」をクリック）を控える

### Step 4: アクセストークンの取得

Graph API Explorer を使ってトークンを取得します。

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/) にアクセス
2. 右上の「Metaアプリ」で作成したアプリを選択
3. 「許可を追加」欄に以下を1つずつ入力して追加:
   - `ads_management`
   - `ads_read`
   - `read_insights`
   - `business_management`
4. 「**Generate Access Token**」をクリック
5. Facebook ログイン画面で権限を許可
6. 生成された**アクセストークンをコピー**（後で使います）

### Step 5: Skills のインストール

```bash
npx meta-ads-mcp setup-skills
```

`~/.claude/skills/meta-ads-api-skill/` に API リファレンスと操作ガイドがインストールされます。

### Step 6: MCP サーバーの登録

`~/.claude/settings.json` の `mcpServers` に追加:

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["meta-ads-mcp"]
    }
  }
}
```

### Step 7: Claude Code を再起動

### Step 8: MCP の設定

Claude Code の会話で認証情報を設定します:

```
meta_ads_configure({
  ad_account_id: "act_XXXXX",
  app_id: "あなたのアプリID",
  app_secret: "あなたのApp Secret"
})
```

#### 広告アカウント ID がわからない場合

設定後に以下で確認できます:

```
meta_ads_api_get({ path: "/me/adaccounts", query: { fields: "id,name" } })
```

### Step 9: トークンの保存

#### 方法 A: OAuth 認証（ブラウザ）

```
Meta広告の認証をして
```

ブラウザが開き Facebook ログイン画面が表示されます。認証完了後、long-lived トークン（60日有効）が自動保存されます。

> **Note**: ビジネスタイプのアプリでは OAuth フローが動作しない場合があります。その場合は方法 B を使ってください。

#### 方法 B: Graph API Explorer のトークンを保存（推奨）

Step 4 で取得したトークンを Claude Code の会話で貼り付けるだけです:

```
meta_ads_save_token({ access_token: "Step4で取得したトークン" })
```

自動的に long-lived トークン（60日有効）に交換して保存されます。

### Step 10: 動作確認

```
Meta広告のキャンペーン一覧を取得して
```

## MCP ツール一覧

| ツール | 説明 |
|-------|------|
| `meta_ads_api_get` | GET リクエスト（データ取得） |
| `meta_ads_api_post` | POST リクエスト（データ作成・更新） |
| `meta_ads_api_delete` | DELETE リクエスト（データ削除） |
| `meta_ads_api_list_paths` | 利用可能なエンドポイント一覧 |
| `meta_ads_configure` | 認証情報設定 |
| `meta_ads_authenticate` | OAuth認証（ブラウザ） |
| `meta_ads_save_token` | トークン保存（Graph API Explorer用、long-lived自動交換） |
| `meta_ads_auth_status` | 認証状態確認 |
| `meta_ads_server_info` | サーバー情報表示 |

## Skills 構成

```
skills/meta-ads-api-skill/
├── SKILL.md                         # スキル定義・全体目次
├── references/ (7 ファイル)          # API エンドポイント仕様書
│   ├── campaigns.md                 # キャンペーン
│   ├── adsets.md                    # 広告セット
│   ├── ads.md                       # 広告
│   ├── creatives.md                 # クリエイティブ
│   ├── audiences.md                 # オーディエンス
│   ├── insights.md                  # インサイト
│   └── common-authentication.md     # 認証
└── recipes/ (6 ファイル)             # 操作手順ガイド
    ├── campaign-management.md       # キャンペーン管理
    ├── adset-management.md          # 広告セット管理
    ├── ad-management.md             # 広告管理
    ├── insights-reporting.md        # インサイト・レポート
    ├── audience-management.md       # オーディエンス管理
    └── troubleshooting.md           # トラブルシューティング
```

## トラブルシューティング

### アプリタイプを間違えた

アプリタイプは作成後に変更できません。「生活者」で作成してしまった場合は、新しく「ビジネス」タイプでアプリを作り直してください。

### 「Invalid Scopes」エラーが出る

アプリタイプが「生活者」の場合、`ads_management` 等の広告系権限は使えません。「ビジネス」タイプでアプリを作り直してください。

### OAuth 認証で「機能をご利用いただけません」

ビジネスタイプのアプリでは通常の Facebook ログインではなく「ビジネス向け Facebook ログイン」が使われます。Graph API Explorer でトークンを取得する方法（Step 4 + Step 9 方法 B）を使ってください。

### MCP サーバーが認識されない

- `settings.json` のパスが正しいか確認
- Claude Code を再起動したか確認
- `npx meta-ads-mcp` を直接実行してエラーが出ないか確認

### 認証エラー (OAuthException)

- トークンの有効期限を確認: `meta_ads_auth_status` ツール
- トークン期限切れの場合は Step 4 → Step 9 でトークンを再取得
- トークンキャッシュを削除: `rm ~/.config/meta-ads-mcp/tokens.json`

### 権限不足

- Graph API Explorer で必要な権限を追加してトークンを再生成
- 開発モードでは自分のアカウントのみアクセス可能
- 他ユーザーのアカウントにアクセスするにはアプリレビューが必要

### トークンの有効期限

- Graph API Explorer で取得したトークン: 約1-2時間
- long-lived トークン（交換後）: 約60日
- 期限切れ後は Step 4 → Step 9 でトークンを再取得

### レート制限

Meta Ads API のレート制限は広告アカウント単位。制限に達した場合は数分待ってから再試行してください。

## ソースからビルドする場合

```bash
git clone https://github.com/fujioka0729/meta-ads-mcp.git
cd meta-ads-mcp
npm install
npm run build
```

## ライセンス

MIT
