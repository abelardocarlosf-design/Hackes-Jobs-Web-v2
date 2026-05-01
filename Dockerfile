FROM node:18-alpine AS base

# Dependencias necesarias para algunos paquetes de node (ej. prisma, bcrypt)
RUN apk add --no-cache libc6-compat openssl

# Dependencias
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Para instalar prisma CLI
COPY prisma ./prisma/
RUN npm ci

# Compilación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generar Prisma Client
RUN npx prisma generate
# Compilar Next.js (esto generará la carpeta standalone gracias a next.config.mjs)
RUN npm run build

# Imagen final de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar public y standalone
COPY --from=builder /app/public ./public
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# server.js es generado por Next.js standalone
CMD ["node", "server.js"]
