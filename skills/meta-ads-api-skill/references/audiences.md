# Audiences API

## エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/act_{ad_account_id}/customaudiences` | カスタムオーディエンス一覧 |
| POST | `/act_{ad_account_id}/customaudiences` | カスタムオーディエンス作成 |
| GET | `/{audience_id}` | オーディエンス詳細 |
| POST | `/{audience_id}` | オーディエンス更新 |
| DELETE | `/{audience_id}` | オーディエンス削除 |

## カスタムオーディエンスの種類

### ウェブサイトカスタムオーディエンス

```
meta_ads_api_post({
  path: "/act_XXXXX/customaudiences",
  body: {
    name: "ウェブサイト訪問者30日",
    subtype: "WEBSITE",
    rule: {
      inclusions: {
        operator: "or",
        rules: [
          {
            event_sources: [{ id: "{pixel_id}", type: "pixel" }],
            retention_seconds: 2592000,
            filter: { operator: "and", filters: [{ field: "url", operator: "i_contains", value: "/" }] }
          }
        ]
      }
    }
  }
})
```

### 顧客リストオーディエンス

```
meta_ads_api_post({
  path: "/act_XXXXX/customaudiences",
  body: {
    name: "既存顧客リスト",
    subtype: "CUSTOM",
    customer_file_source: "USER_PROVIDED_ONLY"
  }
})
```

### Lookalike オーディエンス

```
meta_ads_api_post({
  path: "/act_XXXXX/customaudiences",
  body: {
    name: "類似オーディエンス 1%",
    subtype: "LOOKALIKE",
    origin_audience_id: "{source_audience_id}",
    lookalike_spec: {
      type: "similarity",
      country: "JP",
      ratio: 0.01
    }
  }
})
```

## subtype の値

- `CUSTOM` - 顧客リスト
- `WEBSITE` - ウェブサイトトラフィック
- `APP` - アプリアクティビティ
- `OFFLINE` - オフラインアクティビティ
- `ENGAGEMENT` - エンゲージメント
- `LOOKALIKE` - 類似オーディエンス
- `VIDEO` - 動画視聴者
- `LEAD_GEN` - リードフォーム
