# Zipcoda MCP Server

## 概要

zipcoda-mcp は [zipcoda](https://zipcoda.net/) のAPIを利用して郵便番号や住所の情報を取得するためのModel Context Protocol (MCP)サーバーです。このツールを使用することで、AIアシスタントからZipcodaのAPIにアクセスし、日本の郵便番号と住所データを簡単に検索できます。


## インストール

### VSCodeでの設定例

VSCodeでGitHub Copilotなどのエージェントと一緒にこのMCPサーバーを使用するには、以下の設定を参考にしてください。

`settings.json`ファイルに以下の設定を追加します：

```jsonc
"mcp": {
  "servers": {
    "zipcoda-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "github:mach3/zipcoda-mcp"
      ]
    }
  }
}
```

環境によっては `npx` の代わりに `npm` を使用します：

```jsonc
"mcp": {
  "servers": {
    "zipcoda-mcp": {
      "type": "stdio",
      "command": "npm",
      "args": [
        "exec",
        "--yes",
        "--",
        "github:mach3/zipcoda-mcp"
      ]
    }
  }
}
```

### NPMパッケージとして使用

```bash
# npxを使って起動
npx github:mach3/zipcoda-mcp

# npmを使って起動
npm exec --yes -- github:mach3/zipcoda-mcp
```

## 使用例

- 「郵便番号1000001の住所を教えて」
- 「渋谷区の郵便番号はいくつ？」

## 提供される機能

このMCPサーバーは、以下の2つの主要ツールを提供します：

### 1. search_by_zipcode

郵便番号から住所を検索するツールです。

**パラメータ**:
- `zipcode`: 検索する郵便番号（例: "1000001"、"100-0001"など）

**レスポンス**:
- マッチした郵便番号と住所の一覧

### 2. search_by_address

住所から郵便番号を検索するツールです。

**パラメータ**:
- `address`: 検索する住所（例: "東京都千代田区"、"渋谷"など）

**レスポンス**:
- マッチした郵便番号と住所の一覧


## 動作要件

- **Node.js**: 18.x以上（@modelcontextprotocol/sdk の要件による）
- **インターネット接続**: zipcoda.net APIへのアクセスが必要


## ライセンス

MIT
