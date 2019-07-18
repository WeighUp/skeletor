#node, npm...
FROM node:12.4-alpine


RUN apk add --no-cache make gcc g++ python linux-headers udev
#directory for our app
WORKDIR /weighup-hub-node

#copy package.json and run npm install
#before the rest of the files, because these
#change less often and docker will cache these steps
COPY package.json package-lock.json ./
RUN npm install
COPY . .

#these dont do anything, but document
#intended mount points
VOLUME /weighup-hub-node/src
VOLUME /weighup-hub-node/build

#default command to run when container starts
CMD npm start
