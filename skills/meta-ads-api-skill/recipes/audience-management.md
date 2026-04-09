# オーディエンス管理

## カスタムオーディエンス一覧

```
meta_ads_api_get({
  path: "/act_XXXXX/customaudiences",
  query: {
    fields: "id,name,subtype,approximate_count,delivery_status"
  }
})
```

## ウェブサイト訪問者オーディエンス作成

### 全ページ訪問者（過去30日）

```
meta_ads_api_post({
  path: "/act_XXXXX/customaudiences",
  body: {
    name: "全ページ訪問者 30日",
    subtype: "WEBSITE",
    rule: {
      inclusions: {
        operator: "or",
        rules: [{
          event_sources: [{ id: "{pixel_id}", type: "pixel" }],
          retention_seconds: 2592000
        }]
      }
    }
  }
})
```

### 特定ページ訪問者

```
meta_ads_api_post({
  path: "/act_XXXXX/customaudiences",
  body: {
    name: "購入完了ページ訪問者",
    subtype: "WEBSITE",
    rule: {
      inclusions: {
        operator: "or",
        rules: [{
          event_sources: [{ id: "{pixel_id}", type: "pixel" }],
          retention_seconds: 2592000,
          filter: {
            operator: "and",
            filters: [{ field: "url", operator: "i_contains", value: "/thank-you" }]
          }
        }]
      }
    }
  }
})
```

## Lookalike オーディエンス作成

```
meta_ads_api_post({
  path: "/act_XXXXX/customaudiences",
  body: {
    name: "購入者類似 1%",
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

### ratio の目安
- `0.01` (1%) - 最も類似度が高い
- `0.03` (3%) - バランス型
- `0.05` (5%) - リーチ重視
- `0.10` (10%) - 最大リーチ

## オーディエンスの削除

```
meta_ads_api_delete({ path: "/{audience_id}" })
```
