FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY next.config.ts ./
COPY tsconfig.json ./
COPY next-env.d.ts ./
COPY public ./public
COPY src ./src
COPY data ./data
COPY config.example.json ./config.example.json
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/data ./data
COPY --from=build /app/config.example.json ./config.example.json
EXPOSE 3847
CMD ["node", "server.js"]
