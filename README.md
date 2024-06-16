# I18n Push Action

This action push i18n keysets to [localang.xyz](https://localang.xyz) service.

## Inputs

### `api-key`

**Required** API Key to update translations on [localang.xyz](https://localang.xyz).

### `project-id`

**Required** ID of project on [localang.xyz](https://localang.xyz).

### `file-extension`

**Required** The file extension to look for ("i18n.js" or "i18n.ts").

### `master-branch`

**Required** Name of the master branch (e.g. "master" or "main").

## Example usage

```yaml
uses: actions/localang-i18n-push@123qwe123eqw
with:
  api-key: ${{ secrets.LocalangApiKey }}
  project-id: 5
  file-extension: i18n.js
  master-branch: main
```