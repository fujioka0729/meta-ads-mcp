---
name: meta-ads-api-skill
description: Meta Ads API (Facebook/Instagram広告) の操作ガイド・リファレンス
trigger: Meta広告、Facebook広告、Instagram広告、広告キャンペーン、広告セット、広告インサイト、Meta Ads API に関する操作や仕様の質問
tools: meta_ads_configure, meta_ads_authenticate, meta_ads_auth_status, meta_ads_server_info, meta_ads_api_get, meta_ads_api_post, meta_ads_api_delete, meta_ads_api_list_paths
---

# Meta Ads API Skill

Meta Ads API (Graph API) を使って Facebook/Instagram 広告を操作するためのガイドです。

## セットアップ

1. [Meta for Developers](https://developers.facebook.com/) でアプリを作成
2. アプリにMarketing API製品を追加
3. `meta_ads_configure` でアプリID・シークレット・広告アカウントIDを設定
4. `meta_ads_authenticate` でブラウザ認証

```
meta_ads_configure({ ad_account_id: "act_XXXXX", app_id: "XXXXX", app_secret: "XXXXX" })
meta_ads_authenticate()
```

## 利用可能なツール

| ツール | 説明 |
|--------|------|
| `meta_ads_configure` | 接続設定の保存 |
| `meta_ads_authenticate` | OAuth認証（ブラウザ） |
| `meta_ads_auth_status` | 認証状態の確認 |
| `meta_ads_server_info` | サーバー情報表示 |
| `meta_ads_api_get` | GETリクエスト |
| `meta_ads_api_post` | POSTリクエスト（作成・更新） |
| `meta_ads_api_delete` | DELETEリクエスト |
| `meta_ads_api_list_paths` | エンドポイント一覧 |

## リファレンス

- [キャンペーン](references/campaigns.md)
- [広告セット](references/adsets.md)
- [広告](references/ads.md)
- [クリエイティブ](references/creatives.md)
- [オーディエンス](references/audiences.md)
- [インサイト](references/insights.md)
- [認証](references/common-authentication.md)

## レシピ

- [キャンペーン管理](recipes/campaign-management.md)
- [広告セット管理](recipes/adset-management.md)
- [広告管理](recipes/ad-management.md)
- [インサイト・レポート](recipes/insights-reporting.md)
- [オーディエンス管理](recipes/audience-management.md)
- [トラブルシューティング](recipes/troubleshooting.md)
