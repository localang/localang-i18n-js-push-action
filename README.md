# I18n Push Action

This action pushes i18n keysets to [localang.xyz](https://localang.xyz) service.

## Inputs

### `api-key`

**Required** API Key to update translations on [localang.xyz](https://localang.xyz). [See documentation](https://docs.localang.xyz/docs/localang/api#obtaining-a-token)

### `project-id`

**Required** ID of project on [localang.xyz](https://localang.xyz). [See documentation](https://docs.localang.xyz/docs/localang/api#project-id)

### `file-extension`

**Required** The file extension to look for ("i18n.js" or "i18n.ts").

## Example workflow

**.github/workflows/push-translations.yaml**:

```yaml
name: Push Translations to Localang

on:
  push:
    branches:
      - master

jobs:
  push-translations:
    runs-on: ubuntu-latest

    steps:
      - name: Check out the repository
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Push translations
        uses: localang/localang-i18n-js-push-action@v0.0.2
        with:
          api-key: ${{ secrets.LOCALANG_API_KEY }}
          project-id: 1
          file-extension: i18n.js
```