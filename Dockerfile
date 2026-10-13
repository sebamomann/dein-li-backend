# BUILDER
FROM node:12-alpine as builder
LABEL stage=intermediate

WORKDIR /app

# Copy the lockfile too: without it every build resolves fresh transitive versions,
# which is how a new @types/babel__traverse broke the TS 3.7 build.
COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY . .

# testing
#RUN npm run test:cov
# build
RUN npm run prebuild
RUN npm run build
RUN npm prune --production

# ACTUAL IMAGE
FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN apk --no-cache add curl

HEALTHCHECK --interval=10s --timeout=5s --retries=3 CMD curl -fs localhost:3000/healthcheck || exit 1

CMD ["node", "./dist/main.js"]
