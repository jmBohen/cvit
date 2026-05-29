# Prompt: Encje TypeORM (Etap 1)

## Kontekst projektu

Projekt: **cvit** — aplikacja do tworzenia CV IT.
Backend: NestJS 11, TypeORM 0.3, PostgreSQL.
Jedyna istniejąca, w pełni zdefiniowana encja to `User`:

```typescript
// backend/src/core/users/entities/user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number
  @Column({ unique: true }) email: string
  @Exclude() @Column() password: string
  @Column() firstName: string
  @Column({ nullable: true }) lastName: string
  @Column({ default: true }) isActive: boolean
  @CreateDateColumn() createdAt: Date
}
```

Wszystkie pozostałe pliki encji to puste klasy (np. `export class Cv {}`).
`autoLoadEntities: true` i `synchronize: true` są włączone — TypeORM automatycznie wykryje zmiany schematu.

---

## Zadanie

Zaimplementuj TypeORM entities dla wszystkich modułów. Stosuj dekoratory TypeORM: `@Entity`, `@Column`, `@ManyToOne`, `@OneToMany`, `@OneToOne`, `@JoinColumn`, `@PrimaryGeneratedColumn`, `@CreateDateColumn`, `@UpdateDateColumn`.

---

## Encje do zaimplementowania

### `backend/src/core/profile/entities/profile.entity.ts`

Profil użytkownika (dane kontaktowe). Relacja 1:1 z `User`.
Pola: `phone` (nullable), `city` (nullable), `country` (nullable), `githubUrl` (nullable), `linkedinUrl` (nullable), `websiteUrl` (nullable), `avatarUrl` (nullable).

### `backend/src/core/cv/entities/cv.entity.ts`

Wersja CV. Relacja ManyToOne z `User`. OneToMany z `CvSetting`.
Pola: `name` (string, np. "Backend Dev @ Allegro"), `targetCompany` (nullable, string), `jobOfferUrl` (nullable, string), `isDefault` (boolean, default false), `createdAt`, `updatedAt`.

### `backend/src/core/cv-setting/entities/cv-setting.entity.ts`

Ustawienia CV (1:1 z `Cv`).
Pola: `template` (string, default 'default'), `language` (string, default 'pl'), `accentColor` (nullable, string).

### `backend/src/core/group/entities/group.entity.ts`

Grupowanie sekcji w CV (np. "Projekty open-source"). ManyToOne z `Cv`.
Pola: `title` (string), `order` (integer, default 0).

---

## Encje data-items (backend/src/data-items/)

Każda encja: ManyToOne → `User`, pola `createdAt`, `updatedAt`.

### `bio/entities/bio.entity.ts`

Pola: `summary` (text — krótkie bio/podsumowanie zawodowe).

### `experience/entities/experience.entity.ts`

Pola: `company` (string), `position` (string), `startDate` (date), `endDate` (date, nullable), `isCurrent` (boolean, default false), `description` (text, nullable), `city` (nullable), `country` (nullable).

### `education/entities/education.entity.ts`

Pola: `school` (string), `degree` (string, nullable), `fieldOfStudy` (string, nullable), `startDate` (date), `endDate` (date, nullable), `isCurrent` (boolean, default false), `description` (text, nullable).

### `certificate/entities/certificate.entity.ts`

Pola: `name` (string), `issuer` (string), `issueDate` (date), `expiryDate` (date, nullable), `credentialUrl` (nullable), `credentialId` (nullable).

### `technology/entities/technology.entity.ts`

Pola: `name` (string), `level` (enum: 'beginner' | 'intermediate' | 'advanced' | 'expert'), `category` (string, nullable — np. "Frontend", "DevOps").

### `language/entities/language.entity.ts`

Pola: `name` (string), `level` (enum: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native').

### `project/entities/project.entity.ts`

Pola: `name` (string), `description` (text, nullable), `techStack` (text, nullable), `githubUrl` (nullable), `liveUrl` (nullable), `startDate` (date, nullable), `endDate` (date, nullable).

### `activity/entities/activity.entity.ts`

Pola: `name` (string), `description` (text, nullable), `startDate` (date, nullable), `endDate` (date, nullable).

### `interest/entities/interest.entity.ts`

Pola: `name` (string), `description` (text, nullable).

### `link/entities/link.entity.ts`

Pola: `label` (string), `url` (string), `icon` (nullable — np. "github", "linkedin").

---

## Encje cv-items (backend/src/cv-items/)

Każda encja łączy konkretne CV z konkretnym data-item. ManyToOne → `Cv`. ManyToOne → odpowiedni data-item. Dodatkowe pole: `order` (integer, default 0) do sortowania w obrębie CV.

Utwórz po jednej encji dla każdego z 10 typów:
`BioCv`, `ExperienceCv`, `EducationCv`, `CertificateCv`, `TechnologyCv`, `LanguageCv`, `ProjectCv`, `ActivityCv`, `InterestCv`, `LinkCv`.

---

## Wymagania dodatkowe

- Każda encja `data-item` i `cv-item` musi mieć `@PrimaryGeneratedColumn()`.
- Importy: używaj ścieżek względnych.
- Nie zmieniaj `User` entity.
- Po zaimplementowaniu encji upewnij się, że każdy moduł importuje swoją encję przez `TypeOrmModule.forFeature([EntityName])` w pliku `*.module.ts`.
