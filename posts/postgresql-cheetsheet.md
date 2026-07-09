---
title: PostgreSQLのDDLチートシート
createdAt: "2026-07-06"
category: tech
published: true
---

## はじめに

この記事では、PostgreSQL（Supabase）のマイグレーションファイルに書く内容、いわゆる**DDL（Data Definition Language）**の書き方をまとめます。

テーブルの作成・変更・削除、制約、インデックス、権限周りなど、マイグレーションで頻出する構文を一通り網羅しています。

データ型については[Supabaseのデータ型チートシート](/posts/supabase-data-type)、RLS（Row Level Security）については[SupabaseのRLSチートシート](/posts/supabase-rls-cheatsheet)をご覧ください。DML（SELECT/INSERTなどのデータ操作）はまた別記事で扱う予定です。

> 出典: [PostgreSQL 公式ドキュメント - Data Definition](https://www.postgresql.org/docs/current/ddl.html)

---

## 基本構文

### テーブル作成・削除

```sql
CREATE TABLE IF NOT EXISTS テーブル名 (
  列名 型 制約,
  ...
);

DROP TABLE IF EXISTS テーブル名 CASCADE;
```

> **ポイント**
>
> - `IF NOT EXISTS` / `IF EXISTS` → 対象が既に存在する/しない場合でもエラーにせずスキップする。マイグレーションの再実行に強くなる
> - `CASCADE` → 削除対象に依存する外部キーやビューなども一緒に削除する。付けないと依存オブジェクトがある場合エラーになる
> - 逆に依存関係を壊したくない場合は `RESTRICT`（デフォルト）のまま

### 列の追加・変更・削除

```sql
ALTER TABLE テーブル名 ADD COLUMN 列名 型 制約;
ALTER TABLE テーブル名 ALTER COLUMN 列名 TYPE 型;
ALTER TABLE テーブル名 ALTER COLUMN 列名 SET DEFAULT 値;
ALTER TABLE テーブル名 RENAME COLUMN 旧列名 TO 新列名;
ALTER TABLE テーブル名 DROP COLUMN IF EXISTS 列名 CASCADE;
```

> **ポイント**
>
> - `ALTER COLUMN ... TYPE` は既存データが変換できない型だとエラーになる（例: `text` → `integer` で数値以外の文字列が入っている場合）
> - 列の削除も `CASCADE` を付けないと、その列を参照するビュー・制約があるとエラーになる

---

## パターン集

### 1 テーブル作成（主キー・外部キー・デフォルト値込み）

```sql
CREATE TABLE IF NOT EXISTS posts (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text        NOT NULL,
  is_public  boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

> `REFERENCES ... ON DELETE CASCADE` → 参照元(`auth.users`)の行が消えたら、この行も自動で削除される

---

### 2 既存テーブルへNOT NULL列を安全に追加する

```sql
-- ❌ いきなりNOT NULLを付けると、既存行がある場合エラーになる
ALTER TABLE posts ADD COLUMN status text NOT NULL;

-- ✅ デフォルト値を指定すれば既存行にも値が入るためエラーにならない
ALTER TABLE posts ADD COLUMN status text NOT NULL DEFAULT 'draft';

-- 以降は挙動を変えたくない場合、デフォルトだけ外すことも可能
ALTER TABLE posts ALTER COLUMN status DROP DEFAULT;
```

---

### 3 列の型変更・リネーム

```sql
-- 型変更（USING で既存値の変換方法を明示できる）
ALTER TABLE posts ALTER COLUMN view_count TYPE bigint USING view_count::bigint;

-- リネーム
ALTER TABLE posts RENAME COLUMN is_public TO published;
```

---

### 4 列の削除

```sql
ALTER TABLE posts DROP COLUMN IF EXISTS legacy_flag CASCADE;
```

---

### 5 制約の追加・削除

```sql
-- UNIQUE制約
ALTER TABLE posts ADD CONSTRAINT posts_title_unique UNIQUE (title);

-- CHECK制約
ALTER TABLE posts ADD CONSTRAINT posts_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

-- 外部キー制約（後付け）
ALTER TABLE posts ADD CONSTRAINT posts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 制約の削除
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_title_unique;
```

---

### 6 インデックスの作成・削除

```sql
-- 通常のインデックス（検索・JOIN高速化）
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id);

-- UNIQUEインデックス（重複禁止 + 高速化を同時に行う）
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

-- インデックスの削除
DROP INDEX IF EXISTS idx_posts_user_id;
```

---

### 7 権限の付与・剥奪（GRANT / REVOKE）

PostgreSQLの権限（privilege）は、テーブルに対するデータCRUD系だけでなく、構造・運用に関わるもの、テーブル以外のオブジェクト（スキーマ・シーケンス・関数・データベースなど）に対するものまで多岐にわたります。実務でよく使うものを一覧にまとめます。

| 権限         | 対象オブジェクト       | 分類                             | 意味                                                                  |
| ------------ | ---------------------- | -------------------------------- | --------------------------------------------------------------------- |
| `SELECT`     | テーブル/ビュー        | データCRUD系                     | 行の読み取り                                                          |
| `INSERT`     | テーブル               | データCRUD系                     | 行の追加                                                              |
| `UPDATE`     | テーブル               | データCRUD系                     | 行の更新                                                              |
| `DELETE`     | テーブル               | データCRUD系                     | 行の削除                                                              |
| `TRUNCATE`   | テーブル               | 構造・運用系                     | テーブル内の全行を高速削除                                            |
| `REFERENCES` | テーブル               | 構造・運用系                     | 外部キー制約でこのテーブルを参照することを許可                        |
| `TRIGGER`    | テーブル               | 構造・運用系                     | トリガーの作成を許可                                                  |
| `MAINTAIN`   | テーブル               | 構造・運用系                     | VACUUM/ANALYZE/REINDEXなどのメンテナンス操作を許可                    |
| `USAGE`      | スキーマ/シーケンス/型 | オブジェクト権限系（非テーブル） | スキーマ内オブジェクトの参照・シーケンスのnextval実行・型の利用を許可 |
| `EXECUTE`    | 関数/プロシージャ      | オブジェクト権限系（非テーブル） | 関数・プロシージャの実行を許可                                        |
| `CONNECT`    | データベース           | オブジェクト権限系（非テーブル） | データベースへの接続を許可                                            |
| `CREATE`     | データベース/スキーマ  | オブジェクト権限系（非テーブル） | 新しいオブジェクト（テーブル・スキーマなど）の作成を許可              |
| `TEMPORARY`  | データベース           | オブジェクト権限系（非テーブル） | 一時テーブルの作成を許可                                              |

```sql
-- authenticatedロールにSELECT/INSERT/UPDATE/DELETEを許可
GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO authenticated;

-- anonロールには読み取りのみ許可
GRANT SELECT ON posts TO anon;

-- 権限の剥奪
REVOKE INSERT, UPDATE, DELETE ON posts FROM anon;
```

> `anon` / `authenticated` などロールの詳細は[SupabaseのRLSチートシート](/posts/supabase-rls-cheatsheet)を参照。`GRANT`はテーブルへのアクセス可否そのものを決め、`RLS`は行単位の絞り込みを行うという役割分担のため、両方を組み合わせて初めて意図通りのアクセス制御になる

---

## よくあるミス

| ミス                                             | 対処法                                                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `DROP TABLE`/`DROP COLUMN`でCASCADEを付け忘れる  | 依存する外部キーやビューがあるとエラーになる。意図した削除か確認した上で`CASCADE`を付ける |
| 既存テーブルへNOT NULL列をデフォルト値なしで追加 | 既存行がある場合エラーになる。`DEFAULT`を指定するか、事前にUPDATEしてから制約を追加する   |
| `GRANT`を忘れる                                  | RLSポリシーを設定しても、テーブル自体へのアクセス権がないと弾かれる                       |
| マイグレーションのロールバック手順を用意しない   | 本番適用前に、逆操作（`DROP TABLE`/`DROP COLUMN`など）も一緒に用意しておく                |
| インデックスを貼らずに外部キー列で検索           | 外部キー列には自動でインデックスが張られないため、必要に応じて明示的に作成する            |

---

参考リンク:

- [Data Definition - PostgreSQL Docs](https://www.postgresql.org/docs/current/ddl.html)
- [ALTER TABLE - PostgreSQL Docs](https://www.postgresql.org/docs/current/sql-altertable.html)
- [GRANT - PostgreSQL Docs](https://www.postgresql.org/docs/current/sql-grant.html)
- [Managing Database Migrations - Supabase Docs](https://supabase.com/docs/guides/deployment/database-migrations)

関連記事:

- [Supabaseのデータ型チートシート](/posts/supabase-data-type)
- [SupabaseのRLSチートシート](/posts/supabase-rls-cheatsheet)

## おわりに

今まで難しく感じて`supabase db diff`ばかり使っていましたが、改めて構文を学び直してみるとそれぞれ簡単な構文で成り立っており、心のハードルが下がりました。

特に「制約」と「RLS」は役割が別物ということを意識できたのは大きな収穫でした。

次はDML（SELECT/INSERT/UPDATE/DELETE）編もまとめる予定です。もしよかったら他の記事も見ていってください！
