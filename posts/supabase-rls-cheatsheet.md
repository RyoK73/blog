---
title: SupabaseのRLSチートシート
createdAt: "2026-06-28"
category: tech
published: false
---

## はじめに

この記事では、SupabaseのRLSの設定・書き方について解説します。

RLSはSupabaseを利用するうえで最重要項目といっても過言ではないほど重要です。

Supabase初学者だけでなく、経験者の理解を深めるためにもぜひご覧ください。

> 出典: [Supabase 公式ドキュメント - Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## 基本構文

```sql
CREATE POLICY "ポリシー名"
  ON テーブル名
  FOR SELECT | INSERT | UPDATE | DELETE | ALL  -- 操作の種類
  TO authenticated | anon | public             -- 対象ロール
  USING (既存行への条件)                        -- SELECT / UPDATE / DELETE に使う
  WITH CHECK (新規行への条件);                  -- INSERT / UPDATE に使う
```

> **ポイント**
>
> - `USING` → 操作する行の条件を指定(どの既存業を対象に選ぶか)
> - `WITH CHECK` → 追加・更新した行の条件を指定(書き込んだ行が条件を満たしているか)
> - `USING / WITH CHECK`を使用できない操作に対して指定した場合、マイグレーション適用時にエラーが出ます。
> - すべての操作に対して許可を与えたい場合にのみ`FOR ALL`を使う。*ポリシーの設定が面倒くさいから`FOR ALL`で*はNG

- 大文字・小文字の区別はありません。""で囲む場合を除き、`create policy`も`CREATE POLICY`も同じものとして扱われます。

---

## anon / authenticated / service_role の違い

| ロール          | 説明                                  | RLS                |
| --------------- | ------------------------------------- | ------------------ |
| `anon`          | 未ログインユーザー（公開APIアクセス） | 適用される         |
| `authenticated` | ログイン済みユーザー                  | 適用される         |
| `service_role`  | サーバー・管理者用（Secret キー）     | **バイパスされる** |

> `service_role` キーは絶対にフロントエンドコードに含めない
> `authenticated`はログイン済みかどうかの判定を行うだけなので、これ単体ではログイン済みの他ユーザーのデータにもアクセス可能。別途`USING (auth.uid() = user_id)`などが必要

---

## Step 0: RLSを有効化する

```sql
-- テーブル作成後に必ず有効化する
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

> **注意**: RLS を有効化してポリシーが何もない状態 = **全行が誰にも見えない（deny all）**

---

## よく使うヘルパー関数

| 関数                    | 返り値 | 用途                              |
| ----------------------- | ------ | --------------------------------- |
| `auth.uid()`            | UUID   | ログイン中のユーザーID            |
| `auth.jwt()`            | JSON   | JWTの中身（role・メタデータなど） |
| `auth.jwt() ->> 'role'` | text   | JWTのroleを取得                   |
| `auth.jwt()->>'email'`  | text   | ユーザーのメールアドレス          |

---

## パターン集

### 1 全員に読み取りを許可（公開データ）

```sql
CREATE POLICY "anyone can read"
  ON posts FOR SELECT
  TO public
  USING (true);
```

---

### 2 ログインユーザーだけが自分のデータを見られる

```sql
CREATE POLICY "users can view own data"
  ON posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

---

### 3 ログインユーザーが自分のデータを作成できる

```sql
CREATE POLICY "users can insert own data"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

### 4 ログインユーザーが自分のデータを更新できる

```sql
CREATE POLICY "users can update own data"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)           -- 更新対象の行を確認
  WITH CHECK (auth.uid() = user_id);     -- 更新後の値を確認
```

> **注意**: UPDATE には対応する SELECT ポリシーも必要

---

### 5 ログインユーザーが自分のデータを削除できる

```sql
CREATE POLICY "users can delete own data"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

### 6 CRUD をまとめて書く（シンプルな自己所有パターン）

```sql
-- 上記①〜⑤のセット例（posts テーブル）
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own posts"   ON posts FOR SELECT   TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own posts"   ON posts FOR INSERT   TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own posts"   ON posts FOR UPDATE   TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own posts"   ON posts FOR DELETE   TO authenticated USING (auth.uid() = user_id);
```

---

### 7 公開記事 or 自分の記事を読める

```sql
CREATE POLICY "read public or own posts"
  ON posts FOR SELECT
  TO authenticated
  USING (
    published = true
    OR auth.uid() = user_id
  );
```

---

### 8 JWTのカスタムクレームでロール判定（管理者パターン）

```sql
-- auth.jwt() の app_metadata に { "role": "admin" } が入っている場合
CREATE POLICY "admins can read all"
  ON posts FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  );
```

> `raw_app_meta_data` はユーザーが変更できないため、認可データの保存場所として適切

---

### 9 マルチテナント（組織ごとにデータ分離）

```sql
CREATE POLICY "tenant isolation"
  ON tenant_data FOR ALL
  TO authenticated
  USING (
    tenant_id = (
      SELECT tenant_id FROM users WHERE users.id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id = (
      SELECT tenant_id FROM users WHERE users.id = auth.uid()
    )
  );
```

---

## パフォーマンスのベストプラクティス

### auth.uid() はキャッシュする

```sql
-- ❌ 毎行評価される（遅い）
USING (auth.uid() = user_id)

-- ✅ initPlan でキャッシュされる（速い）
USING ((SELECT auth.uid()) = user_id)
```

> 1回のクエリ実行時の各行の評価時にサブクエリで書いておくと、その結果をキャッシュ(確保)しておいて以降の処理に使用されるため数万行単位の場合、パフォーマンスの改善が見込める。
> 特に`SELECT * FROM PROJECTS`などの処理において顕著である。

#### initPlanとはなんぞや

クエリ実行時の最初に一度だけ実行される計画のこと。

クエリ実行時に**各行の評価ごとに結果が変わらない値**をプランナーが検出すると、その値を算出するサブクエリをinitPlanに組み込みます。

その結果、その値がキャッシュされ各行評価時の算出をスキップするため、パフォーマンスが向上します。

ここでは、`auth.uid()`はクエリ実行時で固定のためinitPlanに組み込まれます。

### ポリシーで使うカラムにインデックスを張る

```sql
CREATE INDEX ON posts(user_id);
CREATE INDEX ON tenant_data(tenant_id);
```

---

## よくあるミス

| ミス                              | 対処法                                                            |
| --------------------------------- | ----------------------------------------------------------------- |
| RLS を有効化し忘れる              | マイグレーションと同時に書く習慣にする                            |
| ポリシーを1つも作らずに有効化     | RLS 有効化直後はすべてのリクエストがブロックされる                |
| UPDATE だけ書いて SELECT がない   | UPDATE には SELECT ポリシーも必要                                 |
| service_role key をフロントで使う | service_role は RLS を完全バイパスするためサーバー専用            |
| SQL Editor でテストする           | SQL Editor は RLS をバイパスするのでクライアント SDK でテストする |

---

## ポリシーの確認・削除

```sql
-- 現在のポリシーを確認
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- ポリシーを削除
DROP POLICY "select own posts" ON posts;

-- RLS を無効化（緊急時のみ）
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
```

---

参考リンク:

- [Row Level Security - Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Securing your API - Supabase Docs](https://supabase.com/docs/guides/api/securing-your-api)
- [RLS AI Prompt - Supabase Docs](https://supabase.com/docs/guides/getting-started/ai-prompts/database-rls-policies)

## おわりに

今まで触ってきたDB類似システムにはRLS設定などなかったため、今回はかなり挑戦の実装でした。
PostgreSQLを扱う際は必ずRLSを設定することを忘れないでください！
