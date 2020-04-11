FROM node:10.15.3-stretch-slim as intermediate

ARG NPM_TOKEN
RUN test -n "$NPM_TOKEN"

RUN mkdir /app
WORKDIR /app

RUN printf '@businesswire:registry=https://registry.businesswire.npme.io/\n//registry.businesswire.npme.io/:_authToken=${NPM_AUTH_TOKEN}' > /root/.npmrc

COPY . /app
RUN export NPM_AUTH_TOKEN=$NPM_TOKEN && yarn install

# build final image without NPM config
FROM node:10.15.3-stretch-slim

ARG IMAGE_BUILD_NUM
RUN test -n "$IMAGE_BUILD_NUM"

ENV BUILD_NUM="${IMAGE_BUILD_NUM}"
ENV THIS_SERVICE_NAME=bwI18nPlatform
ENV NODE_PORTS='1343'
ENV BW_NODE_AUTHENTICATOR_RELATIVE_CACHE_PATH='./cache'

EXPOSE 1343

COPY --from=intermediate /app /app
WORKDIR /app

LABEL build_num="${IMAGE_BUILD_NUM}"

CMD ["node", "server/platform.js"]
