import {
  Entity, Column, PrimaryColumn, BaseEntity,
} from 'typeorm';

@Entity('runescape_player_data_json')
export class RunescapePlayerDataJson extends BaseEntity {
  @PrimaryColumn()
    username: string;

  @PrimaryColumn()
    profile: string;

  @Column({
    type: 'json',
  })
    value: {
      varp: object,
      varc: object,
      varbit: object,
      level: object
    };
}
