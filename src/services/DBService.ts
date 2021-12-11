import { Connection, createConnection } from 'typeorm';

class DBService {
  conn: Connection;

  async getConnection() {
    if (this.conn) {
      return this.conn;
    }

    const conn = await createConnection();
    this.conn = conn;
    console.log('Connected to the database.');
    return conn;
  }
}

const serv = new DBService();
export default serv;
