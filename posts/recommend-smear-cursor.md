---
title: NeoVim Smear-Cursorプラグインのすすめ
createdAt: "2026-06-05"
category: tech
published: true
updatedAt: "2026-06-09"
---

## はじめに

この記事では、NeoVim初心者から使えるカーソルエフェクト追加プラグイン**Smear-Cursor**を紹介します。

この記事を読めば、おしゃれなカーソルエフェクトの追加方法を知ることができます。

## Smear-Cursorとは？

[smear-cursor](https://github.com/sphamba/smear-cursor.nvim)のことで。
NeoVimのプラグインの一つで、執筆時点で1800スターを獲得しています。
[NeoVide](https://neovide.dev)のようなカーソルアニメーションを追加することができます。
かなり細かくカスタマイズできるので、通常のNeoVimの見た目に飽きた人にもおすすめ！

### 導入時の注意点

- [mini-animate](https://github.com/nvim-mini/mini.animate)とは動作が似てて競合するのでどちらかにする必要があります。
  (mini-animateはスクロールの際にページの下側でスタックすることがあったので、smear-cursorのほうが個人的にはおすすめです。)
- アニメーションなので、グラフィック性能に余裕がない環境だと重くなるかもしれないです汗

## 設定ファイルの書き方

`nvim/lua/plugins/smear-cursor.lua`に以下のように記述します。
※ ファイル名はなんでもOK

```lua
return {
  "sphamba/smear-cursor.nvim",
  opts = {
  -- ここに設定を書く
  },
}

```

## 筆者のカスタム

### smear-cursor.nvimの記述

```lua
-- nvim/lua/plugins/smear-cursor.lua
return {
  "sphamba/smear-cursor.nvim",
  opts = {
    cursor_color = "#01d6e4",
    particles_enabled = true,
    stiffness = 0.5,
    trailing_stiffness = 0.2,
    trailing_exponent = 5,
    damping = 0.6,
    gradient_exponent = 0,
    gamma = 1,
    never_draw_over_target = true, -- if you want to actually see under the cursor
    hide_target_hack = true, -- same
    particle_spread = 0.4,
    particles_per_second = 500,
    particles_per_length = 50,
    particle_max_lifetime = 1000,
    particle_max_initial_velocity = 20,
    particle_velocity_from_cursor = 0.5,
    particle_damping = 0.15,
    particle_gravity = -20,
    particles_over_text = false,
    min_distance_emit_particles = 0,
    smear_insert_mode = false,
  },
}
```

### 筆者のカスタム例

![筆者の設定のサンプル画像](/recommend-smear-cursor-particles-custom.png)

### 追加設定

Insertモードでparticlesが文字に被って見えにくいため以下も設定しています。

```lua
-- nvim/lua/autocmds.lua
-- smear-cursor insertモードではparticlesをオフに、ノーマルモードではオンに
vim.api.nvim_create_autocmd("InsertEnter", {
  callback = function()
    require("smear_cursor.config").particles_enabled = false
  end,
})
vim.api.nvim_create_autocmd("InsertLeave", {
  callback = function()
    require("smear_cursor.config").particles_enabled = true
  end,
})
```

## smear-cursor.nvim オプション一覧

---

### 🔧 General — 基本動作のON/OFF

| オプション                      | デフォルト | 役割                                                                 |
| ------------------------------- | ---------- | -------------------------------------------------------------------- |
| `smear_between_buffers`         | `true`     | バッファ・ウィンドウ切り替え時にスメアするか                         |
| `smear_between_neighbor_lines`  | `true`     | 行内移動・隣行移動時にスメアするか                                   |
| `min_horizontal_distance_smear` | `0`        | この水平距離以上移動した時だけスメアする                             |
| `min_vertical_distance_smear`   | `0`        | この垂直距離以上移動した時だけスメアする                             |
| `smear_horizontally`            | `true`     | 水平方向のスメアを有効にするか                                       |
| `smear_vertically`              | `true`     | 垂直方向のスメアを有効にするか                                       |
| `smear_diagonally`              | `true`     | 斜め方向（水平でも垂直でもない）のスメアを有効にするか               |
| `smear_to_cmd`                  | `true`     | コマンドラインモードへの出入りでスメアするか                         |
| `scroll_buffer_space`           | `true`     | スクロール時にスクリーン座標ではなくバッファ座標でスメアを描画するか |

---

### 🔤 フォント・カーソル形状

| オプション                                       | デフォルト | 役割                                                                                                                   |
| ------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `legacy_computing_symbols_support`               | `false`    | Unicodeのレガシーブロック文字（Cascadia Codeなど）対応フォントを使っているか。`true`にするとスメアがよりなめらかになる |
| `legacy_computing_symbols_support_vertical_bars` | `false`    | 縦バーカーソル向けに上記を適用するか                                                                                   |
| `use_diagonal_blocks`                            | `true`     | `legacy_computing_symbols_support` が `true` のとき、斜めブロック文字を使うか                                          |
| `vertical_bar_cursor`                            | `false`    | ノーマルモードのカーソルが縦バー（`\|`）の場合は `true` に                                                             |
| `vertical_bar_cursor_insert_mode`                | `true`     | インサートモードのカーソルが縦バーの場合は `true` に                                                                   |
| `horizontal_bar_cursor_replace_mode`             | `true`     | リプレイスモードのカーソルが横バー（`_`）の場合は `true` に                                                            |

---

### 🎨 描画・レンダリング制御

| オプション               | デフォルト | 役割                                                                                                                 |
| ------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `never_draw_over_target` | `false`    | スメアがターゲット文字に重ならないようにするか（アニメーション中にその文字を隠さない）                               |
| `hide_target_hack`       | `false`    | `termguicolors` なし環境向けに、実カーソルをキャラクター描画で隠す裏技。`never_draw_over_target = true` と一緒に使う |
| `max_kept_windows`       | `50`       | レンダリング用に維持するフローティングウィンドウ数の上限                                                             |
| `windows_zindex`         | `300`      | スメア用フローティングウィンドウの zindex（他のフローティングより上に来るかどうか）                                  |
| `filetypes_disabled`     | `{}`       | プラグインを無効にするファイルタイプのリスト                                                                         |

---

### ⏱️ タイミング・パフォーマンス

| オプション             | デフォルト | 役割                                                                         |
| ---------------------- | ---------- | ---------------------------------------------------------------------------- |
| `time_interval`        | `17` ms    | アニメーションのフレームレート（ミリ秒）。小さくするとなめらかになるが負荷増 |
| `delay_disable`        | `nil`      | アニメーションがこの時間（ms）以上止まった場合に自動無効化。`nil` で無効     |
| `delay_event_to_smear` | `1` ms     | カーソルが止まってからアニメーション開始するまでの遅延                       |
| `delay_after_key`      | `5` ms     | キー入力後の `vim.on_key` 遅延。`smear_terminal_mode` 使用時に調整           |

---

### 🌊 スメアのダイナミクス（物理感）

バネ＆ダンパー系の物理モデルでスメアの動きを制御します。

| オプション                | デフォルト | 範囲     | 役割                                                                   |
| ------------------------- | ---------- | -------- | ---------------------------------------------------------------------- |
| `stiffness`               | `0.6`      | `[0, 1]` | スメアの**頭**の硬さ。1 に近いほど素早くターゲットへ追いつく           |
| `trailing_stiffness`      | `0.45`     | `[0, 1]` | スメアの**尾**の硬さ。`stiffness` より小さいと尾を引く                 |
| `anticipation`            | `0.2`      | —        | 移動前に逆方向へ少し予備動作するファクター（スプリング感）             |
| `damping`                 | `0.85`     | `[0, 1]` | 速度の減衰率。小さく（0.65 など）すると行き過ぎてバウンスする          |
| `trailing_exponent`       | `3`        | —        | 中間点が頭寄り・尾寄りどちらに分布するか。1 未満で尾寄り、1 超で頭寄り |
| `distance_stop_animating` | `0.1`      | `> 0`    | 尾がターゲットからこの距離（文字単位）内に入ったらアニメーション終了   |
| `max_length`              | `25`       | —        | スメアの最大長（文字数）                                               |

### インサートモード専用パラメータ

| オプション                             | デフォルト |
| -------------------------------------- | ---------- |
| `stiffness_insert_mode`                | `0.5`      |
| `trailing_stiffness_insert_mode`       | `0.5`      |
| `damping_insert_mode`                  | `0.9`      |
| `trailing_exponent_insert_mode`        | `1`        |
| `distance_stop_animating_vertical_bar` | `0.875`    |
| `max_length_insert_mode`               | `1`        |

---

### 🖼️ ラスタライズ・描画品質

スメアをどのようなブロック文字で描画するかを制御する細かい設定群です。

| オプション                            | デフォルト  | 役割                                                                           |
| ------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `color_levels`                        | `16`        | 色のグラデーション段階数（最小 1）。`cterm_cursor_colors` 使用時は手動設定不要 |
| `gamma`                               | `2.2`       | 色ブレンド時のガンマ値                                                         |
| `gradient_exponent`                   | `1.0`       | 縦方向グラデーション。0 で均一、1 で線形減衰                                   |
| `max_shade_no_matrix`                 | `0.75`      | 0 に近いほどはみ出し表現が増え、1 に近いほどマトリクス表現が増える             |
| `matrix_pixel_threshold`              | `0.7`       | マトリクス描画でのピクセル閾値。0 で全ピクセル、1 でピクセルなし               |
| `matrix_pixel_threshold_vertical_bar` | `0.25`      | 縦バーカーソル向けの同閾値                                                     |
| `matrix_pixel_min_factor`             | `0.5`       | マトリクスピクセルの最小輝度係数                                               |
| `volume_reduction_exponent`           | `0.3`       | スメアの体積（太さ）の減衰具合。0 で減衰なし、1 で完全減衰                     |
| `minimum_volume_factor`               | `0.7`       | 体積減衰の下限係数。0 で制限なし、1 で減衰なし                                 |
| `max_slope_horizontal`                | `(1/3)/1.5` | 水平描画に切り替える傾きの閾値                                                 |
| `min_slope_vertical`                  | `2*1.5`     | 垂直描画に切り替える傾きの閾値                                                 |
| `max_angle_difference_diagonal`       | `π/16` rad  | 斜め描画に切り替える角度差の閾値                                               |
| `max_offset_diagonal`                 | `0.2`       | 斜め描画の最大オフセット（セル幅単位）                                         |
| `min_shade_no_diagonal`               | `0.2`       | 斜めブロックを使わない最小シェード。0 で少なく、1 で多く                       |
| `min_shade_no_diagonal_vertical_bar`  | `0.5`       | 縦バーカーソル向けの同設定                                                     |

---

### ✨ パーティクル（炎エフェクト系）

`particles_enabled = true` にすると火花が散るエフェクトが追加されます。  
README の 🔥 Fire Hazard セクションで紹介されている設定はこれを活用しています。

| オプション                                | デフォルト | 役割                                                                                         |
| ----------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| `particles_enabled`                       | `false`    | パーティクルエフェクトを有効にするか。`true` の場合は `never_draw_over_target = true` も推奨 |
| `particle_max_num`                        | `100`      | 最大パーティクル数                                                                           |
| `particle_spread`                         | `0.5`      | パーティクルの広がり幅（0: 点、1: カーソル全幅）                                             |
| `particles_per_second`                    | `200`      | 1 秒あたりの放出数                                                                           |
| `particles_per_length`                    | `1.0`      | カーソル移動距離（文字幅）あたりの放出数                                                     |
| `particle_max_lifetime`                   | `300` ms   | パーティクルの最大寿命                                                                       |
| `particle_lifetime_distribution_exponent` | `5`        | 寿命の分布の偏り                                                                             |
| `particle_max_initial_velocity`           | `10`       | 初速の最大値（文字幅/秒）                                                                    |
| `particle_velocity_from_cursor`           | `0.2`      | カーソルの速度をパーティクルに受け継ぐ割合（0: なし、1: 全量）                               |
| `particle_random_velocity`                | `100`      | ランダムな速度の最大値（文字幅/秒）                                                          |
| `particle_damping`                        | `0.2`      | パーティクルの速度減衰                                                                       |
| `particle_gravity`                        | `20`       | 重力加速度（文字幅/秒²）。正で下向き、負で上向き                                             |
| `min_distance_emit_particles`             | `1.5`      | この距離以上移動した時だけパーティクルを放出（文字幅単位）                                   |
| `particle_switch_octant_braille`          | `0.3`      | 点字記号を使う寿命割合（`legacy_computing_symbols_support = true` 時のみ有効）               |
| `particles_over_text`                     | `false`    | パーティクルをテキスト上にも描画するか                                                       |

---

### 🎭 モード別スメア ON/OFF

| オプション            | デフォルト | 役割                                                                            |
| --------------------- | ---------- | ------------------------------------------------------------------------------- |
| `smear_insert_mode`   | `true`     | インサートモードでスメアするか                                                  |
| `smear_replace_mode`  | `false`    | リプレイスモードでスメアするか                                                  |
| `smear_terminal_mode` | `false`    | ターミナルモードでスメアするか（有効にする場合 `delay_after_key` の調整も推奨） |

---

### 🎨 カラー設定（color.lua より）

| オプション                      | デフォルト                  | 役割                                                                                        |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| `cursor_color`                  | `nil`（Cursor HL から取得） | スメアの色。16進カラーコード、ハイライトグループ名、または `"none"`（テキスト色に合わせる） |
| `cursor_color_insert_mode`      | `nil`                       | インサートモード時のスメアの色                                                              |
| `normal_bg`                     | `nil`（Normal HL から取得） | 背景色（透過背景環境での調整用）                                                            |
| `transparent_bg_fallback_color` | —                           | `legacy_computing_symbols_support = false` の透過背景環境でのシャドウ色                     |
| `cterm_cursor_colors`           | —                           | `termguicolors` 非使用時のグラデーション色リスト（例: `{ 240, 245, 250, 255 }`）            |
| `cterm_bg`                      | —                           | `termguicolors` 非使用時の背景色（例: `235`）                                               |

---

## さいごに

導入手順は、

1. `nvim/lua/plugins/smear-cursor.lua`を作成する
2. お好みのエフェクトを記述する
3. (`nvim/lua/config/autocmds.lua`を設定する)
4. nvimを再起動する

です！

ぜひ試してみてください！
