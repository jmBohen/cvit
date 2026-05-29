# Prompt: Moduł CV (Etap 4)

## Kontekst projektu

Backend: NestJS 11, TypeORM 0.3.
Po Etapach 1–3: encje zdefiniowane, CRUD data-items działa, JWT guard aktywny.

Główna idea: użytkownik ma **dane bazowe** (data-items) i tworzy **wersje CV** (Cv),
do których dobiera konkretne elementy z data-items przez `cv-items`.

---

## Zadanie 1: CvService i CvController

### `backend/src/core/cv/cv.service.ts`

```typescript
@Injectable()
export class CvService {
  constructor(@InjectRepository(Cv) private cvRepository: Repository<Cv>) {}

  create(userId: number, dto: CreateCvDto) {
    const cv = this.cvRepository.create({ ...dto, user: { id: userId } })
    return this.cvRepository.save(cv)
  }

  findAll(userId: number) {
    return this.cvRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: number, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: { id, user: { id: userId } },
    })
    if (!cv) throw new NotFoundException(`CV #${id} not found`)
    return cv
  }

  async update(id: number, userId: number, dto: UpdateCvDto) {
    const cv = await this.findOne(id, userId)
    return this.cvRepository.save({ ...cv, ...dto })
  }

  async remove(id: number, userId: number) {
    const cv = await this.findOne(id, userId)
    return this.cvRepository.remove(cv)
  }
}
```

### `backend/src/core/cv/dto/create-cv.dto.ts`

```typescript
@IsString() @IsNotEmpty() name: string;                        // np. "Backend Dev @ Allegro"
@IsString() @IsOptional() targetCompany?: string;
@IsUrl() @IsOptional() jobOfferUrl?: string;
@IsBoolean() @IsOptional() isDefault?: boolean;
```

### `backend/src/core/cv/cv.controller.ts`

```typescript
@UseGuards(JwtAuthGuard)
@Controller('cv')
export class CvController {
  // CRUD analogiczny do data-items
  // GET /cv — lista CV zalogowanego użytkownika
  // GET /cv/:id — szczegóły CV (z relacjami cv-items)
  // POST /cv — utwórz nowe CV
  // PATCH /cv/:id — edytuj
  // DELETE /cv/:id — usuń
}
```

---

## Zadanie 2: cv-items serwisy

Każdy moduł `cv-items` łączy CV z data-itemem. Implementuj wzorzec:

### Przykład: `ExperienceCvService`

```typescript
@Injectable()
export class ExperienceCvService {
  constructor(
    @InjectRepository(ExperienceCv)
    private repo: Repository<ExperienceCv>,
  ) {}

  // Dodaj experience do CV (sprawdź czy CV należy do userId)
  async addToCv(cvId: number, experienceId: number, userId: number) {
    // 1. Zweryfikuj że Cv(cvId) należy do userId — inject CvService lub CvRepository
    // 2. Sprawdź czy ExperienceCv już istnieje (unikalność cv+experience)
    // 3. Utwórz i zapisz ExperienceCv
  }

  findByCv(cvId: number) {
    return this.repo.find({
      where: { cv: { id: cvId } },
      relations: ['experience'],
      order: { order: 'ASC' },
    })
  }

  async remove(id: number, userId: number) {
    // Weryfikuj własność przez relację cv.user
    const item = await this.repo.findOne({
      where: { id },
      relations: ['cv', 'cv.user'],
    })
    if (!item || item.cv.user.id !== userId) throw new NotFoundException()
    return this.repo.remove(item)
  }

  async updateOrder(id: number, order: number, userId: number) {
    // Zmiana kolejności elementu w CV
  }
}
```

### Endpointy cv-items (przykład dla experience-cv)

```
POST   /cv/:cvId/experience      → addToCv(cvId, body.experienceId, userId)
GET    /cv/:cvId/experience      → findByCv(cvId)
DELETE /cv/:cvId/experience/:id  → remove(id, userId)
PATCH  /cv/:cvId/experience/:id  → updateOrder(id, body.order, userId)
```

Zastosuj ten wzorzec dla wszystkich 10 typów cv-items.

---

## Zadanie 3: Pełny widok CV

Dodaj endpoint `GET /cv/:id/full` zwracający CV ze wszystkimi powiązanymi elementami:

```typescript
async findFull(id: number, userId: number) {
  return this.cvRepository.findOne({
    where: { id, user: { id: userId } },
    relations: [
      'experienceItems', 'experienceItems.experience',
      'educationItems', 'educationItems.education',
      'technologyItems', 'technologyItems.technology',
      'projectItems', 'projectItems.project',
      'certificateItems', 'certificateItems.certificate',
      'languageItems', 'languageItems.language',
      'bioItems', 'bioItems.bio',
      'activityItems', 'activityItems.activity',
      'interestItems', 'interestItems.interest',
      'linkItems', 'linkItems.link',
      'setting',
    ],
  });
}
```

---

## Zadanie 4: ProfileService

### `backend/src/core/profile/profile.service.ts`

```typescript
@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {}

  // Upsert — utwórz lub zaktualizuj profil użytkownika
  async upsert(userId: number, dto: UpdateProfileDto) {
    let profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    })
    if (!profile) {
      profile = this.profileRepository.create({ user: { id: userId } })
    }
    return this.profileRepository.save({ ...profile, ...dto })
  }

  findByUser(userId: number) {
    return this.profileRepository.findOne({ where: { user: { id: userId } } })
  }
}
```

Endpointy: `GET /profile` (własny profil), `PUT /profile` (upsert).

---

## DTO dla CvSetting

```typescript
// create-cv-setting.dto.ts
@IsString() @IsOptional() template?: string;   // 'default' | 'minimal' | 'modern'
@IsString() @IsOptional() language?: string;   // 'pl' | 'en'
@IsString() @IsOptional() @IsHexColor() accentColor?: string;
```

Endpoint: `PUT /cv/:id/settings`
