FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY index.js ./

ENV PORT=3000
EXPOSE 3000

USER node

CMD ["node", "index.js"]
