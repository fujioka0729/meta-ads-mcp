# インサイト・レポート

## アカウント全体のパフォーマンス（過去30日）

```
meta_ads_api_get({
  path: "/act_XXXXX/insights",
  query: {
    fields: "impressions,reach,clicks,spend,cpc,ctr,actions",
    date_preset: "last_30d"
  }
})
```

## キャンペーン別パフォーマンス

```
meta_ads_api_get({
  path: "/act_XXXXX/insights",
  query: {
    fields: "campaign_name,campaign_id,impressions,reach,clicks,spend,cpc,ctr",
    level: "campaign",
    date_preset: "last_30d"
  }
})
```

## 日別レポート

```
meta_ads_api_get({
  path: "/{campaign_id}/insights",
  query: {
    fields: "impressions,clicks,spend,cpc,ctr",
    time_range: '{"since":"2024-01-01","until":"2024-01-31"}',
    time_increment: "1"
  }
})
```

## 年齢・性別ブレークダウン

```
meta_ads_api_get({
  path: "/{campaign_id}/insights",
  query: {
    fields: "impressions,clicks,spend,ctr",
    breakdowns: "age,gender",
    date_preset: "last_30d"
  }
})
```

## プラットフォーム別レポート

```
meta_ads_api_get({
  path: "/{campaign_id}/insights",
  query: {
    fields: "impressions,clicks,spend,ctr",
    breakdowns: "publisher_platform,platform_position",
    date_preset: "last_30d"
  }
})
```

## コンバージョンレポート

```
meta_ads_api_get({
  path: "/{campaign_id}/insights",
  query: {
    fields: "impressions,clicks,spend,actions,cost_per_action_type,conversions,cost_per_conversion,purchase_roas",
    date_preset: "last_30d"
  }
})
```

## 動画パフォーマンス

```
meta_ads_api_get({
  path: "/{ad_id}/insights",
  query: {
    fields: "impressions,reach,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions,video_avg_time_watched_actions",
    date_preset: "last_30d"
  }
})
```

## ページネーション

インサイトのレスポンスが多い場合、カーソルページネーションで次ページを取得:

```json
{
  "data": [...],
  "paging": {
    "cursors": { "before": "...", "after": "..." },
    "next": "https://graph.facebook.com/v21.0/..."
  }
}
```

`after` カーソルをクエリパラメータに追加して次ページを取得できます。
