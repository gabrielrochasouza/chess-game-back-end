import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { env } from 'process';

@Injectable()
export class HealthcheckService {
    private readonly logger = new Logger(HealthcheckService.name);

    constructor(private readonly httpService: HttpService) {}

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron() {
        this.logger.debug('Running healthcheck...');

        try {
            const response = await firstValueFrom(this.httpService.get(`${env['API_URL']}/healthcheck`));
            if (response.status === 200) {
                this.logger.debug('Healthcheck passed.');
            } else {
                this.logger.error('Healthcheck failed with status: ' + response.status);
            }
        } catch (error) {
            this.logger.error('Healthcheck failed with error: ' + error.message);
        }
    }
}
