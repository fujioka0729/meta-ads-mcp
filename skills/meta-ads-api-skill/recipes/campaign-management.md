# キャンペーン管理

## キャンペーン一覧の取得

```
meta_ads_api_get({
  path: "/act_XXXXX/campaigns",
  query: {
    fields: "id,name,status,objective,daily_budget,lifetime_budget,effective_status,created_time",
    limit: "50"
  }
})
```

## アクティブなキャンペーンのみ取得

```
meta_ads_api_get({
  path: "/act_XXXXX/campaigns",
  query: {
    fields: "id,name,objective,daily_budget,effective_status",
    filtering: '[{"field":"effective_status","operator":"IN","value":["ACTIVE"]}]'
  }
})
```

## キャンペーンの作成

```
meta_ads_api_post({
  path: "/act_XXXXX/campaigns",
  body: {
    name: "新規キャンペーン",
    objective: "OUTCOME_TRAFFIC",
    status: "PAUSED",
    special_ad_categories: [],
    daily_budget: "5000"
  }
})
```

## キャンペーンの一時停止

```
meta_ads_api_post({
  path: "/{campaign_id}",
  body: { status: "PAUSED" }
})
```

## キャンペーンの再開

```
meta_ads_api_post({
  path: "/{campaign_id}",
  body: { status: "ACTIVE" }
})
```

## キャンペーンの削除

```
meta_ads_api_delete({ path: "/{campaign_id}" })
```

## 予算の変更

```
meta_ads_api_post({
  path: "/{campaign_id}",
  body: { daily_budget: "10000" }
})
```

注意: 予算の値はセント単位（日本円の場合は円単位）。
