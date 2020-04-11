# Winston Retail Web Client

## Local Dev

```bash
yarn demo
```

## Deployment

```bash
yarn build
pm2 serve webclient/build 3000
```

## SSH 
If you need to rotate local SSH keys, simply generate a `ssl.pem` file 
from the `winston-platform` project and copy it to this project root. 
