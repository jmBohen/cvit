import { Injectable } from '@nestjs/common';
import { CreateProjectCvDto } from './dto/create-project-cv.dto';
import { UpdateProjectCvDto } from './dto/update-project-cv.dto';

@Injectable()
export class ProjectCvService {
  create(createProjectCvDto: CreateProjectCvDto) {
    return 'This action adds a new projectCv';
  }

  findAll() {
    return `This action returns all projectCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectCv`;
  }

  update(id: number, updateProjectCvDto: UpdateProjectCvDto) {
    return `This action updates a #${id} projectCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectCv`;
  }
}
