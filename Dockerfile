FROM centos:8

# Create app directory
WORKDIR /usr/src/template-svc

ADD . ./pakage.json
RUN dnf install -y gcc-c++ make
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf install -y nodejs

RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN dnf install -y yarn

RUN yarn install
ADD . .

RUN yarn build

EXPOSE 8001
CMD [ "yarn", "start" ]

# Prepare nginx
# FROM nginx:1.16.0-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
