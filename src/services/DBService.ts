import { Connection, createConnection } from 'typeorm';
import PlayerData from '../orm/PlayerData';

class DBService {
  conn: Connection;

  async getConnection() {
    if (this.conn) {
      return this.conn;
    }

    const conn = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities: [
        PlayerData,
      ],
      migrations: ['migration/*.ts'],
    });
    this.conn = conn;
    console.log('Connected to the database.');
    return conn;
  }
}

const serv = new DBService();
export default serv;
