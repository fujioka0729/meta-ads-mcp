# トラブルシューティング

## よくあるエラー

### OAuthException (Code 190)

**原因**: アクセストークンの期限切れまたは無効

**対処法**:
```
meta_ads_auth_status()  // トークン状態確認
meta_ads_authenticate() // 再認証
```

### Permission Error (Code 10)

**原因**: 必要な権限（スコープ）が不足

**対処法**:
- Meta for Developers でアプリの権限を確認
- 必要なスコープ: `ads_management`, `ads_read`, `business_management`, `read_insights`
- 再度 `meta_ads_authenticate` で認証

### Invalid Parameter (Code 100)

**原因**: リクエストパラメータが不正

**対処法**:
- fields パラメータのフィールド名を確認
- body の必須フィールドを確認
- 日付フォーマット: `YYYY-MM-DD` または ISO 8601

### Rate Limit (Code 32)

**原因**: APIレート制限に達した

**対処法**:
- 数分待ってからリトライ
- バッチリクエストの使用を検討
- 不要なフィールドを減らす

### Ad Account Disabled (Code 1487851)

**原因**: 広告アカウントが無効化されている

**対処法**:
- Meta Business Suite でアカウント状態を確認
- アカウントの支払い設定を確認

## よくある質問

### 広告アカウントIDがわからない

```
meta_ads_api_get({
  path: "/me/adaccounts",
  query: { fields: "id,name,account_status" }
})
```

### ページIDがわからない

```
meta_ads_api_get({
  path: "/me/accounts",
  query: { fields: "id,name" }
})
```

### Pixel IDがわからない

```
meta_ads_api_get({
  path: "/act_XXXXX/adspixels",
  query: { fields: "id,name" }
})
```

### 予算の単位

- 日本円（JPY）の場合: 値はそのまま円単位（例: `"5000"` = 5,000円）
- USD の場合: セント単位（例: `"5000"` = $50.00）
- 通貨は広告アカウントの設定に依存

### filtering パラメータの書式

```
'[{"field":"effective_status","operator":"IN","value":["ACTIVE","PAUSED"]}]'
```

使用可能な operator:
- `EQUAL` - 等しい
- `NOT_EQUAL` - 等しくない
- `IN` - 含む
- `NOT_IN` - 含まない
- `GREATER_THAN` - より大きい
- `LESS_THAN` - より小さい
- `CONTAIN` - 文字列を含む
- `NOT_CONTAIN` - 文字列を含まない
