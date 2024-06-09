# I18n Push Action

This action push i18n keysets to [localang.com](https://localang.com) service.

## Inputs

### `api-key`

**Required** API Key to update translations on [localang.com](https://localang.com).

### `file-extension`

**Required** The file extension to look for ("i18n.js" or "i18n.ts").

### `master-branch`

**Required** Name of the master branch (e.g. "master" or "main").

## Example usage

```yaml
uses: actions/localang-i18n-push@123qwe123eqw
with:
  api-key: ${{ secrets.LocalangApiKey }}
  file-extension: i18n.js
  master-branch: main
```