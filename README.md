# Static site (param mode)

Use `?csv=URL_ENCODED` para informar a URL publicada do Google Sheets (output=csv), sem editar arquivos.

Exemplo:
```
https://SEU_USUARIO.github.io/lists/?csv=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F...%2Fpub%3Foutput%3Dcsv
```

Dicas:
- Publique sua aba correta no formato CSV (Arquivo → Publicar na Web).
- Se preferir fixar a URL no código, edite `assets/app.js` e coloque em `SHEET_CSV_URL_DEFAULT`.
