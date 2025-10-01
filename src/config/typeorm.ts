import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from "dotenv";
import { registerAs } from "@nestjs/config";
//npm install dotenv
//    npm run migration:create src/migrations/prueba (manuales)
//    npm run build
//    npm run migration:run
// p/sincronizar la base de datos a nuestra entidades:
// npm run migration:generate src/migrations/initial


dotenvConfig({ path: ".env.development" });

const config = {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT as unknown as number,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true, //true  para crear la base de datos automaticamente
        logging: true,
        entities: ['dist/**/*.entity{.ts,.js}'],
        migrations: ['dist/migrations/*{.ts,.js}'],
        
      };
      export default registerAs('typeorm', () => config);

      export const conectionSource = new DataSource(config as DataSourceOptions);