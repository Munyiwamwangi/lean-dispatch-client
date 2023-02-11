# build stage
FROM node:14-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --location=global @vue/cli
RUN npm install

ENV VUE_APP_API_BASE_URL=http://167.99.214.37:1338
ENV VUE_APP_API_BACKEND_SERVICE=167.99.214.37:1338
ENV VUE_APP_STAGE=development
ENV VUE_APP_AD_CLIENT_ID=706606b2-5d65-453b-82fc-1802d39018d6
ENV VUE_APP_AD_SUCCESS_REDIRECT_URL=http://localhost:8080/success
ENV VUE_APP_AD_LOGOUT_REDIRECT_URL=http://localhost:8080/login
ENV VUE_APP_AD_ACCESS_TOKEN_SCOPES=https://bmsorg.onmicrosoft.com/User.Read.All

COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80


CMD ["nginx", "-g", "daemon off;"] 