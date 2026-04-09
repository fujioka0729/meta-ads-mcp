# Ads API

## エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/act_{ad_account_id}/ads` | 広告一覧 |
| POST | `/act_{ad_account_id}/ads` | 広告作成 |
| GET | `/{ad_id}` | 広告詳細 |
| POST | `/{ad_id}` | 広告更新 |
| DELETE | `/{ad_id}` | 広告削除 |

## 主要フィールド

| フィールド | 型 | 説明 |
|------------|------|------|
| id | string | 広告ID |
| name | string | 広告名 |
| adset_id | string | 親広告セットID |
| creative | object | クリエイティブ参照 `{ creative_id: "..." }` |
| status | enum | ACTIVE, PAUSED, DELETED, ARCHIVED |
| effective_status | enum | 実効ステータス |
| tracking_specs | array | トラッキング設定 |
| conversion_specs | array | コンバージョン設定 |

## 作成例

```
meta_ads_api_post({
  path: "/act_XXXXX/ads",
  body: {
    name: "テスト広告",
    adset_id: "{adset_id}",
    creative: { creative_id: "{creative_id}" },
    status: "PAUSED"
  }
})
```

## インラインクリエイティブで作成

クリエイティブを別途作成せずに広告と一緒に作る:

```
meta_ads_api_post({
  path: "/act_XXXXX/ads",
  body: {
    name: "テスト広告",
    adset_id: "{adset_id}",
    creative: {
      name: "インラインクリエイティブ",
      object_story_spec: {
        page_id: "{page_id}",
        link_data: {
          link: "https://example.com",
          message: "広告テキスト",
          image_hash: "{image_hash}"
        }
      }
    },
    status: "PAUSED"
  }
})
```

## ステータスフロー

1. `PAUSED` で作成
2. クリエイティブ・ターゲティング確認
3. `ACTIVE` に更新して配信開始
4. 停止時は `PAUSED` に更新
5. 完全削除は `DELETE` リクエスト
