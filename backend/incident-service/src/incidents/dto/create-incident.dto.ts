import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IncidentStatus } from '../enums/incident-status.enum';
import { IncidentSeverity } from '../enums/incident-severity.enum';

export class CreateIncidentDto {
  @ApiProperty({ description: 'Title of the incident', example: 'High CPU utilization on DB server' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed description of the incident', example: 'CPU usage spiked to 98% following migration' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: IncidentSeverity, description: 'Severity level', example: IncidentSeverity.HIGH })
  @IsNotEmpty()
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiProperty({ enum: IncidentStatus, description: 'Initial status', example: IncidentStatus.OPEN, required: false })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus = IncidentStatus.OPEN;
}
