## git管理

ブランチはすべてgit worktree管理を行う
命名方法は以下の通り

```bash
function gitp() {
  if ! git rev-parse --git-dir &>/dev/null; then
    echo "not a git directory"
    return
  elif ! git rev-parse HEAD --git-dir &>/dev/null; then
    echo "commitがありません"
    return
  elif [[ -z "$1" ]]; then
    echo "ブランチ名を指定してください"
    return
  fi

  git pull --rebase origin main

  local repo
  repo=$(basename $(git remote get-url origin) .git) || repo=$(basename $(git rev-parse --show-toplevel)) # ディレクトリではなく、remote repositoryを基準にprefixを決定、remote repositoryがなければディレクトリ名にフォールバック

  local branchdir="../$repo-$1"
  git worktree add -b "$1" "$branchdir" # mainからではなく現ブランチから生成する
  cd "$branchdir"
}
```
