FROM node:12-alpine as build

# Specify where our app will live in the container
WORKDIR /app

# Copy the React App to the contain`er
COPY . /app/

# Prepare the container for building React
RUN npm install
# We want the production version
RUN npm run build

# Prepare nginx
FROM nginx:1.16.0-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d

# Fire up nginx
EXPOSE 80
CMD [ "yarn", "start" ]
