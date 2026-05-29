# Prompt: data-items CRUD (Etap 3)

## Kontekst projektu

Backend: NestJS 11, TypeORM 0.3.
Po wykonaniu Etapu 1 wszystkie encje `data-items` są zdefiniowane.
Po wykonaniu Etapu 2 dostępne są `JwtAuthGuard` i dekorator `@CurrentUser()`.

Wzorcowa implementacja gotowa to `UsersService` — stosuj analogiczny styl.

---

## Zadanie

Zaimplementuj pełne CRUD serwisy i kontrolery dla wszystkich 10 modułów `data-items`.
Każdy zasób jest prywatny — użytkownik widzi i modyfikuje tylko swoje dane.

---

## Wzorzec implementacji

Poniżej wzorzec dla **ExperienceService** — zastosuj go analogicznie do pozostałych 9 modułów.

### `backend/src/data-items/experience/experience.service.ts`

```typescript
@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  create(userId: number, createDto: CreateExperienceDto) {
    const entity = this.experienceRepository.create({
      ...createDto,
      user: { id: userId },
    })
    return this.experienceRepository.save(entity)
  }

  findAll(userId: number) {
    return this.experienceRepository.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    })
  }

  async findOne(id: number, userId: number) {
    const entity = await this.experienceRepository.findOne({
      where: { id, user: { id: userId } },
    })
    if (!entity) throw new NotFoundException(`Experience #${id} not found`)
    return entity
  }

  async update(id: number, userId: number, updateDto: UpdateExperienceDto) {
    const entity = await this.findOne(id, userId)
    return this.experienceRepository.save({ ...entity, ...updateDto })
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId)
    return this.experienceRepository.remove(entity)
  }
}
```

### `backend/src/data-items/experience/experience.controller.ts`

```typescript
@UseGuards(JwtAuthGuard)
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateExperienceDto) {
    return this.experienceService.create(userId, dto)
  }

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.experienceService.findAll(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser('id') userId: number) {
    return this.experienceService.findOne(id, userId)
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(id, userId, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser('id') userId: number) {
    return this.experienceService.remove(id, userId)
  }
}
```

---

## DTOs do zaimplementowania

Dla każdego modułu utwórz `create-*.dto.ts` z walidacją `class-validator`:

### `create-experience.dto.ts`

```typescript
@IsString() @IsNotEmpty() company: string;
@IsString() @IsNotEmpty() position: string;
@IsDateString() startDate: string;
@IsDateString() @IsOptional() endDate?: string;
@IsBoolean() @IsOptional() isCurrent?: boolean;
@IsString() @IsOptional() description?: string;
@IsString() @IsOptional() city?: string;
@IsString() @IsOptional() country?: string;
```

### `create-education.dto.ts`

```typescript
@IsString() @IsNotEmpty() school: string;
@IsString() @IsOptional() degree?: string;
@IsString() @IsOptional() fieldOfStudy?: string;
@IsDateString() startDate: string;
@IsDateString() @IsOptional() endDate?: string;
@IsBoolean() @IsOptional() isCurrent?: boolean;
@IsString() @IsOptional() description?: string;
```

### `create-technology.dto.ts`

```typescript
@IsString() @IsNotEmpty() name: string;
@IsEnum(['beginner','intermediate','advanced','expert']) level: string;
@IsString() @IsOptional() category?: string;
```

### `create-language.dto.ts`

```typescript
@IsString() @IsNotEmpty() name: string;
@IsEnum(['A1','A2','B1','B2','C1','C2','native']) level: string;
```

### `create-project.dto.ts`

```typescript
@IsString() @IsNotEmpty() name: string;
@IsString() @IsOptional() description?: string;
@IsString() @IsOptional() techStack?: string;
@IsUrl() @IsOptional() githubUrl?: string;
@IsUrl() @IsOptional() liveUrl?: string;
@IsDateString() @IsOptional() startDate?: string;
@IsDateString() @IsOptional() endDate?: string;
```

### `create-certificate.dto.ts`

```typescript
@IsString() @IsNotEmpty() name: string;
@IsString() @IsNotEmpty() issuer: string;
@IsDateString() issueDate: string;
@IsDateString() @IsOptional() expiryDate?: string;
@IsUrl() @IsOptional() credentialUrl?: string;
@IsString() @IsOptional() credentialId?: string;
```

### `create-bio.dto.ts`

```typescript
@IsString() @IsNotEmpty() @MaxLength(1000) summary: string;
```

### `create-activity.dto.ts`

```typescript
@IsString() @IsNotEmpty() name: string;
@IsString() @IsOptional() description?: string;
@IsDateString() @IsOptional() startDate?: string;
@IsDateString() @IsOptional() endDate?: string;
```

### `create-interest.dto.ts`

```typescript
@IsString() @IsNotEmpty() name: string;
@IsString() @IsOptional() description?: string;
```

### `create-link.dto.ts`

```typescript
@IsString() @IsNotEmpty() label: string;
@IsUrl() url: string;
@IsString() @IsOptional() icon?: string;
```

---

## Moduły do uzupełnienia

Dla każdego modułu w `*.module.ts` dodaj:

```typescript
imports: [TypeOrmModule.forFeature([EntityName])],
providers: [ServiceName],
controllers: [ControllerName],
```

---

## Wymagania

- `UpdateDto` generuj przez `PartialType(CreateDto)` z `@nestjs/mapped-types`
- Zawsze filtruj po `userId` — nigdy nie zwracaj danych innych użytkowników
- Rzucaj `NotFoundException` gdy zasób nie istnieje lub należy do innego użytkownika
