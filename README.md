# WOFF Simple app

## Article
[Qiita article]()

## Setup
Create `params.js`.

```params.js
export const woffId = 'Your WOFF ID'
```

Refer to `params.template.js`.


## Deploy
Deploy files to a public location where static contents can be published like AWS S3.

## (For test) Run with Ngrok

### Run on local with python `http.server`
Requirements
- Python >= 3.6

```sh
python -v http.server 8000
```

### Expose to public by Ngrok

```sh
ngrok http 8000
```
