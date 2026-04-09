# Ad Creatives API

## エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/act_{ad_account_id}/adcreatives` | クリエイティブ一覧 |
| POST | `/act_{ad_account_id}/adcreatives` | クリエイティブ作成 |
| GET | `/{creative_id}` | クリエイティブ詳細 |
| DELETE | `/{creative_id}` | クリエイティブ削除 |

## 主要フィールド

| フィールド | 型 | 説明 |
|------------|------|------|
| id | string | クリエイティブID |
| name | string | クリエイティブ名 |
| object_story_spec | object | 広告の内容（リンク、画像、動画等） |
| asset_feed_spec | object | ダイナミッククリエイティブ用 |
| thumbnail_url | string | サムネイルURL |
| effective_object_story_id | string | 投稿ID |

## object_story_spec

### リンク広告

```json
{
  "object_story_spec": {
    "page_id": "{page_id}",
    "link_data": {
      "link": "https://example.com",
      "message": "広告テキスト",
      "name": "見出し",
      "description": "説明文",
      "image_hash": "{image_hash}",
      "call_to_action": {
        "type": "LEARN_MORE",
        "value": { "link": "https://example.com" }
      }
    }
  }
}
```

### 動画広告

```json
{
  "object_story_spec": {
    "page_id": "{page_id}",
    "video_data": {
      "video_id": "{video_id}",
      "message": "広告テキスト",
      "title": "動画タイトル",
      "image_hash": "{thumbnail_hash}",
      "call_to_action": {
        "type": "SHOP_NOW",
        "value": { "link": "https://example.com" }
      }
    }
  }
}
```

## call_to_action type の主要値

- `LEARN_MORE` - 詳しくはこちら
- `SHOP_NOW` - 購入する
- `SIGN_UP` - 登録する
- `BOOK_TRAVEL` - 旅行を予約
- `CONTACT_US` - お問い合わせ
- `DOWNLOAD` - ダウンロード
- `GET_OFFER` - クーポンを入手
- `APPLY_NOW` - 今すぐ申し込む
- `SUBSCRIBE` - 登録する
- `WATCH_MORE` - もっと見る

## 画像アップロード

```
meta_ads_api_post({
  path: "/act_XXXXX/adimages",
  body: {
    bytes: "{base64エンコードされた画像}"
  }
})
```

レスポンスに `image_hash` が含まれる。
