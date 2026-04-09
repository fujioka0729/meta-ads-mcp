# Insights API

## エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/act_{ad_account_id}/insights` | アカウントインサイト |
| GET | `/{campaign_id}/insights` | キャンペーンインサイト |
| GET | `/{adset_id}/insights` | 広告セットインサイト |
| GET | `/{ad_id}/insights` | 広告インサイト |

## 主要メトリクス

| メトリクス | 説明 |
|------------|------|
| impressions | インプレッション数 |
| reach | リーチ（ユニークユーザー数） |
| clicks | クリック数 |
| cpc | クリック単価 |
| cpm | 1000インプレッション単価 |
| ctr | クリック率 |
| spend | 消化金額 |
| frequency | フリークエンシー |
| actions | アクション（コンバージョン等） |
| cost_per_action_type | アクションあたりコスト |
| conversions | コンバージョン数 |
| cost_per_conversion | コンバージョン単価 |
| purchase_roas | ROAS（広告費用対効果） |
| video_p25_watched_actions | 動画25%視聴 |
| video_p50_watched_actions | 動画50%視聴 |
| video_p75_watched_actions | 動画75%視聴 |
| video_p100_watched_actions | 動画100%視聴 |

## 日付範囲

```
meta_ads_api_get({
  path: "/{campaign_id}/insights",
  query: {
    fields: "impressions,reach,clicks,spend,cpc,ctr,actions",
    time_range: '{"since":"2024-01-01","until":"2024-01-31"}',
    time_increment: "1"
  }
})
```

### time_increment の値
- `1` - 日別
- `7` - 週別
- `monthly` - 月別
- `all_days` - 期間全体（デフォルト）

### date_preset の値（time_rangeの代わりに使用可）
- `today` - 今日
- `yesterday` - 昨日
- `this_month` - 今月
- `last_month` - 先月
- `last_7d` - 過去7日
- `last_14d` - 過去14日
- `last_30d` - 過去30日
- `last_90d` - 過去90日

## ブレークダウン

```
meta_ads_api_get({
  path: "/{campaign_id}/insights",
  query: {
    fields: "impressions,clicks,spend",
    breakdowns: "age,gender",
    time_range: '{"since":"2024-01-01","until":"2024-01-31"}'
  }
})
```

### 主要ブレークダウン
- `age` - 年齢
- `gender` - 性別
- `country` - 国
- `region` - 地域
- `publisher_platform` - プラットフォーム（Facebook, Instagram等）
- `platform_position` - 配置（feed, story等）
- `device_platform` - デバイス
- `impression_device` - インプレッションデバイス

## actions フィールドの構造

actionsは配列で返される:

```json
{
  "actions": [
    { "action_type": "link_click", "value": "150" },
    { "action_type": "post_engagement", "value": "200" },
    { "action_type": "page_engagement", "value": "210" },
    { "action_type": "offsite_conversion.fb_pixel_purchase", "value": "10" }
  ]
}
```

## レベル指定

```
meta_ads_api_get({
  path: "/act_XXXXX/insights",
  query: {
    fields: "campaign_name,impressions,spend",
    level: "campaign",
    time_range: '{"since":"2024-01-01","until":"2024-01-31"}'
  }
})
```

### level の値
- `account` - アカウントレベル
- `campaign` - キャンペーンレベル
- `adset` - 広告セットレベル
- `ad` - 広告レベル
