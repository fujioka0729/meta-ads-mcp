# Ad Sets API

## エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/act_{ad_account_id}/adsets` | 広告セット一覧 |
| POST | `/act_{ad_account_id}/adsets` | 広告セット作成 |
| GET | `/{adset_id}` | 広告セット詳細 |
| POST | `/{adset_id}` | 広告セット更新 |
| DELETE | `/{adset_id}` | 広告セット削除 |

## 主要フィールド

| フィールド | 型 | 説明 |
|------------|------|------|
| id | string | 広告セットID |
| name | string | 広告セット名 |
| campaign_id | string | 親キャンペーンID |
| status | enum | ACTIVE, PAUSED, DELETED, ARCHIVED |
| daily_budget | string | 日予算（セント単位） |
| lifetime_budget | string | 通算予算（セント単位） |
| bid_amount | string | 入札額（セント単位） |
| billing_event | enum | 課金イベント（IMPRESSIONS, LINK_CLICKS等） |
| optimization_goal | enum | 最適化目標 |
| targeting | object | ターゲティング設定 |
| start_time | datetime | 開始日時 |
| end_time | datetime | 終了日時 |

## ターゲティング設定

```json
{
  "targeting": {
    "age_min": 18,
    "age_max": 65,
    "genders": [1, 2],
    "geo_locations": {
      "countries": ["JP"],
      "location_types": ["home", "recent"]
    },
    "publisher_platforms": ["facebook", "instagram"],
    "facebook_positions": ["feed", "story"],
    "instagram_positions": ["stream", "story"]
  }
}
```

### gender値
- `1`: 男性
- `2`: 女性

## optimization_goal の主要値

- `LINK_CLICKS` - リンククリック
- `IMPRESSIONS` - インプレッション
- `REACH` - リーチ
- `LANDING_PAGE_VIEWS` - ランディングページビュー
- `LEAD_GENERATION` - リード獲得
- `OFFSITE_CONVERSIONS` - オフサイトコンバージョン
- `VALUE` - 価値最適化
- `THRUPLAY` - ThruPlay（動画視聴）

## 作成例

```
meta_ads_api_post({
  path: "/act_XXXXX/adsets",
  body: {
    name: "テスト広告セット",
    campaign_id: "{campaign_id}",
    daily_budget: "1000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "LINK_CLICKS",
    status: "PAUSED",
    targeting: {
      age_min: 25,
      age_max: 45,
      genders: [1, 2],
      geo_locations: { countries: ["JP"] }
    },
    start_time: "2024-01-01T00:00:00+0900"
  }
})
```
