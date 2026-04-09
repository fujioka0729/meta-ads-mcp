# 広告管理

## 広告一覧

```
meta_ads_api_get({
  path: "/act_XXXXX/ads",
  query: {
    fields: "id,name,status,effective_status,adset_id,creative{id,name,thumbnail_url}",
    limit: "50"
  }
})
```

## 広告の作成（既存クリエイティブを使用）

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

## 広告の作成（インラインクリエイティブ）

### リンク広告

```
meta_ads_api_post({
  path: "/act_XXXXX/ads",
  body: {
    name: "リンク広告",
    adset_id: "{adset_id}",
    creative: {
      name: "リンク広告クリエイティブ",
      object_story_spec: {
        page_id: "{page_id}",
        link_data: {
          link: "https://example.com",
          message: "広告テキスト",
          name: "見出しテキスト",
          description: "説明テキスト",
          image_hash: "{image_hash}",
          call_to_action: { type: "LEARN_MORE" }
        }
      }
    },
    status: "PAUSED"
  }
})
```

## 広告のステータス変更

```
meta_ads_api_post({
  path: "/{ad_id}",
  body: { status: "ACTIVE" }
})
```

## 広告の削除

```
meta_ads_api_delete({ path: "/{ad_id}" })
```

## 広告プレビュー

```
meta_ads_api_get({
  path: "/{ad_id}/previews",
  query: { ad_format: "DESKTOP_FEED_STANDARD" }
})
```

### ad_format の値
- `DESKTOP_FEED_STANDARD` - デスクトップフィード
- `MOBILE_FEED_STANDARD` - モバイルフィード
- `INSTAGRAM_STANDARD` - Instagram フィード
- `INSTAGRAM_STORY` - Instagram ストーリー
- `RIGHT_COLUMN_STANDARD` - 右カラム
