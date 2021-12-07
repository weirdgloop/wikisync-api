import { Entity, Column, PrimaryColumn } from 'typeorm';
import PlayerDataType from '../enum/PlayerDataType';

@Entity()
export default class PlayerData {
  @PrimaryColumn({
    type: 'enum',
    enum: PlayerDataType,
  })
    type: PlayerDataType;

  @PrimaryColumn()
    username: string;

  @PrimaryColumn()
    data_key: string;

  @Column()
    data_value: string;
}
