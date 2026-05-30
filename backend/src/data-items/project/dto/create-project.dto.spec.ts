import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto } from './create-project.dto';

describe('CreateProjectDto', () => {
  it('should transform YYYY-MM to YYYY-MM-01', async () => {
    const plain = {
      name: 'Test Project',
      startDate: '2026-05',
      endDate: '2026-06'
    };
    
    // transform plain object to instance, applying @Transform decorators
    const instance = plainToInstance(CreateProjectDto, plain);
    
    expect(instance.startDate).toBe('2026-05-01');
    expect(instance.endDate).toBe('2026-06-01');

    // ensure it passes validation
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with valid full dates', async () => {
    const plain = {
      name: 'Test Project',
      startDate: '2026-05-15',
    };
    
    const instance = plainToInstance(CreateProjectDto, plain);
    expect(instance.startDate).toBe('2026-05-15');

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should pass validation without dates', async () => {
    const plain = {
      name: 'Test Project',
    };
    
    const instance = plainToInstance(CreateProjectDto, plain);
    
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });
});
