import {
  Entity, Column, PrimaryColumn, BaseEntity,
} from 'typeorm';
import { ProfileType } from '../enum/ProfileType';
import { PlayerDataValue } from '../types/PlayerDataValue';

@Entity('player_data_json')
export default class PlayerDataJson extends BaseEntity {
  @PrimaryColumn()
    username: string;

  @PrimaryColumn({
    type: 'enum',
    enum: ProfileType,
  })
    profile: ProfileType;

  @Column({
    type: 'json',
  })
    value: PlayerDataValue;
}
