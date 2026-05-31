import { Controller, Get } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('data')
export class DataController {
  constructor(private readonly entityManager: EntityManager) {}

  @Get('aggregated')
  async getAggregatedData(@CurrentUser('id') userId: number) {
    const resources = [
      { key: 'bio', entity: 'Bio' },
      { key: 'experience', entity: 'Experience' },
      { key: 'education', entity: 'Education' },
      { key: 'project', entity: 'Project' },
      { key: 'technology', entity: 'Technology' },
      { key: 'certificate', entity: 'Certificate' },
      { key: 'language', entity: 'Language' },
      { key: 'link', entity: 'Link' },
      { key: 'interest', entity: 'Interest' },
      { key: 'activity', entity: 'Activity' },
    ];

    const result: Record<string, any[]> = {};

    await Promise.all(
      resources.map(async ({ key, entity }) => {
        try {
          const items = await this.entityManager.find(entity, {
            where: { user: { id: userId } },
            order: { id: 'DESC' }
          });
          result[key] = items;
        } catch (e) {
          result[key] = []; // fallback if entity not found or error
        }
      })
    );

    return result;
  }
}
