# 広告セット管理

## 広告セット一覧

```
meta_ads_api_get({
  path: "/act_XXXXX/adsets",
  query: {
    fields: "id,name,status,daily_budget,targeting,optimization_goal,billing_event,campaign_id",
    limit: "50"
  }
})
```

## 特定キャンペーンの広告セット

```
meta_ads_api_get({
  path: "/{campaign_id}/adsets",
  query: {
    fields: "id,name,status,daily_budget,optimization_goal"
  }
})
```

## 広告セットの作成

### 基本的なトラフィック広告セット

```
meta_ads_api_post({
  path: "/act_XXXXX/adsets",
  body: {
    name: "日本向け25-45歳トラフィック",
    campaign_id: "{campaign_id}",
    daily_budget: "3000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "LINK_CLICKS",
    status: "PAUSED",
    targeting: {
      age_min: 25,
      age_max: 45,
      geo_locations: { countries: ["JP"] },
      publisher_platforms: ["facebook", "instagram"],
      facebook_positions: ["feed"],
      instagram_positions: ["stream"]
    },
    start_time: "2024-01-01T00:00:00+0900"
  }
})
```

### インタレストターゲティング

```
meta_ads_api_post({
  path: "/act_XXXXX/adsets",
  body: {
    name: "テクノロジー興味関心",
    campaign_id: "{campaign_id}",
    daily_budget: "5000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "LINK_CLICKS",
    status: "PAUSED",
    targeting: {
      age_min: 20,
      age_max: 50,
      geo_locations: { countries: ["JP"] },
      interests: [
        { id: "6003139266461", name: "Technology" }
      ]
    }
  }
})
```

## 予算の変更

```
meta_ads_api_post({
  path: "/{adset_id}",
  body: { daily_budget: "8000" }
})
```

## スケジュールの設定

```
meta_ads_api_post({
  path: "/{adset_id}",
  body: {
    start_time: "2024-02-01T00:00:00+0900",
    end_time: "2024-02-28T23:59:59+0900"
  }
})
```
