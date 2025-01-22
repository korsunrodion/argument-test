import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { Model } from './Model.entity';

@Entity('earthquake')
export class Earthquake extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  magnitude: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  location: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  date: Date;
}
