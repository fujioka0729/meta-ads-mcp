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
- Meta for Developers でアプリ作成済み（App ID / App Secret 取得済み）

### 1. Skills のインストール

```bash
npx meta-ads-mcp setup-skills
```

`~/.claude/skills/meta-ads-api-skill/` に API リファレンスと操作ガイドがインストールされます。

### 2. MCP サーバーの登録

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

### 3. Claude Code を再起動

### 4. 認証設定

Claude Code の会話で:

```
Meta広告の認証設定をして
```

広告アカウント ID（act_XXXXX）・App ID・App Secret を入力すると `~/.config/meta-ads-mcp/config.json` に保存されます。

### 5. OAuth 認証

```
Meta広告の認証をして
```

ブラウザが開き Facebook ログイン画面が表示されます。認証完了後、long-lived トークン（60日有効）が自動保存されます。

### 6. 動作確認

```
Meta広告のキャンペーン一覧を取得して
```

### ソースからビルドする場合

```bash
git clone <repository-url>
cd meta-ads-mcp
npm install
npm run build
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
    ├── insights-reporting.md        # インサイト・レ��ート
    ├── audience-management.md       # オーディエンス管理
    └── troubleshooting.md           # トラブルシューティング
```

## Meta アプリの作成

1. [developers.facebook.com](https://developers.facebook.com/) でアプリを新規作成（タイプ: ビジネス）
2. Marketing API 製品を追加
3. Facebook Login の設定:
   - 有効な OAuth リダイレクト URI: `http://localhost:9876/callback`
   - Client OAuth Login: ON
   - Web OAuth Login: ON
4. 必要な権限:
   - `ads_management` — 広告の作成・管理
   - `ads_read` — 広告データの読み取り
   - `business_management` — ビジネスマネージャアクセス
   - `read_insights` — インサイトデータの読み取り
5. App ID / App Secret を控える

## トラブルシューティング

### MCP サーバーが認識されない

- `settings.json` のパスが正しいか確認
- Claude Code を再起動したか確認
- `npx meta-ads-mcp` を直接実行してエラーが出ないか確認

### 認証エラー (OAuthException)

- トークンの有効期限を確認: `meta_ads_auth_status` ツール
- トークン期限切れの場合は再認証: `meta_ads_authenticate` ツール
- トークンキャッシュを削除: `rm ~/.config/meta-ads-mcp/tokens.json`

### 権限不足

- Meta for Developers でアプリの権限設定を確認
- 開発モードでは自分のアカウントのみアクセス可能
- 他ユーザーのアカウントにアクセスするにはアプリレビューが必要

### レート制限

Meta Ads API のレート制限は広告アカウント単位。制限に達した場合は数分待ってから再試行してください。

## ライセンス

MIT
