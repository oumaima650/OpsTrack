import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { FilterIncidentDto } from './dto/filter-incident.dto';

@Injectable()
export class IncidentsService {
  private readonly logger = new Logger(IncidentsService.name);

  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(createIncidentDto: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentRepository.create(createIncidentDto);
    const savedIncident = await this.incidentRepository.save(incident);

    // Trigger Notification Service
    await this.notifyService(
      savedIncident.id,
      'INCIDENT_CREATED',
      `New incident created: "${savedIncident.title}" [Severity: ${savedIncident.severity}]`,
    );

    return savedIncident;
  }

  async findAll(filterDto?: FilterIncidentDto): Promise<Incident[]> {
    const { status, severity, search } = filterDto || {};
    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (severity) {
      where.severity = severity;
    }

    if (search) {
      return this.incidentRepository.find({
        where: [
          { ...where, title: Like(`%${search}%`) },
          { ...where, description: Like(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }

    return this.incidentRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException(`Incident with ID "${id}" not found`);
    }
    return incident;
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto): Promise<Incident> {
    const incident = await this.findOne(id);
    const oldStatus = incident.status;

    Object.assign(incident, updateIncidentDto);
    const updatedIncident = await this.incidentRepository.save(incident);

    // Trigger notification if status changed
    if (updateIncidentDto.status && updateIncidentDto.status !== oldStatus) {
      await this.notifyService(
        updatedIncident.id,
        'INCIDENT_STATUS_CHANGED',
        `Incident "${updatedIncident.title}" status changed from ${oldStatus} to ${updatedIncident.status}`,
      );
    }

    return updatedIncident;
  }

  async remove(id: string): Promise<void> {
    const incident = await this.findOne(id);
    await this.incidentRepository.remove(incident);
  }

  private async notifyService(incidentId: string, type: string, message: string): Promise<void> {
    const notificationUrl =
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') ||
      'http://localhost:3002/notifications';

    try {
      await firstValueFrom(
        this.httpService.post(notificationUrl, {
          incidentId,
          type,
          message,
        }),
      );
      this.logger.log(`Notification sent to ${notificationUrl} for incident ${incidentId}`);
    } catch (error) {
      this.logger.warn(
        `Failed to send notification to ${notificationUrl}: ${error.message}`,
      );
    }
  }
}
