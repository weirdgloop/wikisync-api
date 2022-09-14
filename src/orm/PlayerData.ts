import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ProfileType } from '../enum/ProfileType';
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

  @PrimaryColumn({
    type: 'enum',
    enum: ProfileType,
  })
    profile: ProfileType;

  @PrimaryColumn()
    data_key: string;

  @Column()
    data_value: string;
}
