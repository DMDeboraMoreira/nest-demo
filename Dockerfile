# docker build . -t nest-demo-docker
# docker run -p 3001:3000 --network nestnetwork nest-demo-docker

#docker run --name postgresdb -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=demo_nest --network nestnetwork -v pgdata:/var/lib/postgresql/data -d postgres


FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]