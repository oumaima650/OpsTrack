import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IncidentStatus } from '../enums/incident-status.enum';
import { IncidentSeverity } from '../enums/incident-severity.enum';

export class UpdateIncidentDto {
  @ApiProperty({ description: 'Updated title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: IncidentStatus, description: 'Updated status', required: false })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiProperty({ enum: IncidentSeverity, description: 'Updated severity level', required: false })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;
}
