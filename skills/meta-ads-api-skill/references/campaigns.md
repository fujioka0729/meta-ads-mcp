# Campaigns API

## エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/act_{ad_account_id}/campaigns` | キャンペーン一覧 |
| POST | `/act_{ad_account_id}/campaigns` | キャンペーン作成 |
| GET | `/{campaign_id}` | キャンペーン詳細 |
| POST | `/{campaign_id}` | キャンペーン更新 |
| DELETE | `/{campaign_id}` | キャンペーン削除 |

## 主要フィールド

| フィールド | 型 | 説明 |
|------------|------|------|
| id | string | キャンペーンID |
| name | string | キャンペーン名 |
| objective | enum | 目的（OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT, OUTCOME_LEADS, OUTCOME_SALES, OUTCOME_AWARENESS） |
| status | enum | ACTIVE, PAUSED, DELETED, ARCHIVED |
| effective_status | enum | 実効ステータス |
| daily_budget | string | 日予算（セント単位） |
| lifetime_budget | string | 通算予算（セント単位） |
| bid_strategy | enum | 入札戦略（LOWEST_COST_WITHOUT_CAP, LOWEST_COST_WITH_BID_CAP, COST_CAP） |
| special_ad_categories | array | 特別広告カテゴリ |
| buying_type | string | AUCTION または RESERVED |
| created_time | datetime | 作成日時 |
| updated_time | datetime | 更新日時 |

## 一覧取得

```
meta_ads_api_get({
  path: "/act_XXXXX/campaigns",
  query: {
    fields: "id,name,status,objective,daily_budget,lifetime_budget,effective_status",
    limit: "50"
  }
})
```

## 作成

```
meta_ads_api_post({
  path: "/act_XXXXX/campaigns",
  body: {
    name: "テストキャンペーン",
    objective: "OUTCOME_TRAFFIC",
    status: "PAUSED",
    special_ad_categories: []
  }
})
```

## 更新

```
meta_ads_api_post({
  path: "/{campaign_id}",
  body: {
    name: "新しいキャンペーン名",
    status: "ACTIVE"
  }
})
```

## 削除

```
meta_ads_api_delete({ path: "/{campaign_id}" })
```

## objective の値（Outcome-Based）

Meta Ads APIは2023年からOutcome-Based Ad Objectivesに移行:

- `OUTCOME_AWARENESS` - ブランド認知
- `OUTCOME_ENGAGEMENT` - エンゲージメント
- `OUTCOME_TRAFFIC` - トラフィック
- `OUTCOME_LEADS` - リード
- `OUTCOME_APP_PROMOTION` - アプリプロモーション
- `OUTCOME_SALES` - 売上
