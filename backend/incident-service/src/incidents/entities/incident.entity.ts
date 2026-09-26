import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IncidentStatus } from '../enums/incident-status.enum';
import { IncidentSeverity } from '../enums/incident-severity.enum';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: IncidentStatus.OPEN,
  })
  status: IncidentStatus;

  @Column({
    type: 'varchar',
    length: 50,
    default: IncidentSeverity.MEDIUM,
  })
  severity: IncidentSeverity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
