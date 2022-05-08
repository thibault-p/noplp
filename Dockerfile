FROM node:16 AS client_builder

WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install

COPY client/ .
RUN rm .env \
    && npm run build


FROM node:16

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY server ./

COPY --from=client_builder /app/build public

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["npm", "start"]
