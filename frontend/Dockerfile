FROM node:18.18.0 AS build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install --force
COPY . /app/
RUN npm run build


FROM nginx:alpine AS client-browser
COPY --from=build /app/dist/client/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf



FROM node:18.18.0-alpine AS ssr-server
COPY --from=build /app/dist /app/dist/
COPY package.json /app/
WORKDIR /app
EXPOSE 4000
CMD npm run serve:ssr:chatApp
