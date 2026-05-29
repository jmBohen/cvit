# Prompt: Frontend — edytor CV (Etap 7)

## Kontekst projektu

Frontend po Etapach 5–6: routing działa, użytkownik może się zalogować.
`@tanstack/react-query` zainstalowany.
API funkcje: dodaj do `frontend/src/api/cv.ts` i `frontend/src/api/dataItems.ts`.

---

## Zadanie 1: API functions

### `frontend/src/api/cv.ts`

```typescript
import apiClient from './client'
import type { Cv } from '../types/api'

export const getCvList = () => apiClient.get<Cv[]>('/cv').then((r) => r.data)

export const getCvFull = (id: number) => apiClient.get(`/cv/${id}/full`).then((r) => r.data)

export const createCv = (data: { name: string; targetCompany?: string; jobOfferUrl?: string }) =>
  apiClient.post<Cv>('/cv', data).then((r) => r.data)

export const deleteCv = (id: number) => apiClient.delete(`/cv/${id}`)
```

### `frontend/src/api/dataItems.ts`

```typescript
// Generyczny helper dla data-items (experience, education, technology, itp.)
export const getDataItems = (resource: string) => apiClient.get(`/${resource}`).then((r) => r.data)

export const createDataItem = (resource: string, data: unknown) =>
  apiClient.post(`/${resource}`, data).then((r) => r.data)

export const deleteDataItem = (resource: string, id: number) =>
  apiClient.delete(`/${resource}/${id}`)

// Dodaj/usuń element z CV
export const addItemToCv = (cvId: number, resource: string, itemId: number) =>
  apiClient.post(`/cv/${cvId}/${resource}`, { [`${resource}Id`]: itemId }).then((r) => r.data)

export const removeItemFromCv = (cvId: number, resource: string, itemId: number) =>
  apiClient.delete(`/cv/${cvId}/${resource}/${itemId}`)
```

---

## Zadanie 2: Dashboard (lista CV)

### `frontend/src/pages/DashboardPage.tsx`

```typescript
// useQuery do pobrania listy CV
// Wyświetl: lista kart CV (nazwa, firma docelowa, data utworzenia)
// Przycisk "Nowe CV" → otwiera modal lub formularz inline z polem "nazwa CV"
// Klik na kartę CV → navigate(`/cv/${cv.id}`)
// Przycisk usunięcia CV z potwierdzeniem
```

Wymagania wizualne:

- Lista kart z: nazwa CV, `targetCompany` (jeśli istnieje), data
- Stan pusty: "Nie masz jeszcze żadnego CV. Utwórz pierwsze!"
- Loading state podczas pobierania

---

## Zadanie 3: Edytor CV

### `frontend/src/pages/CvEditorPage.tsx`

Strona podzielona na zakładki/sekcje:

```
[Informacje] [Technologie] [Doświadczenie] [Edukacja] [Projekty] [Certyfikaty] [Języki]
```

Ogólny układ:

```
┌─────────────────────────────────────────────────────┐
│ Nazwa CV: "Backend Dev @ Allegro"    [Edytuj nazwę] │
├─────────────────────────────────────────────────────┤
│ [Technologie] [Doświadczenie] [Edukacja] ...        │
├──────────────────────┬──────────────────────────────┤
│  Moje dane           │  Zawartość CV                │
│  (wszystkie elementy │  (wybrane do tego CV)        │
│  użytkownika)        │                              │
│                      │                              │
│  [+ Dodaj nowe]      │                              │
│  ○ React (advanced)  │  ✓ TypeScript (expert)      │
│  ○ Node.js (expert)  │  ✓ React (advanced)         │
│  ○ Docker (inter..)  │                              │
└──────────────────────┴──────────────────────────────┘
```

### Implementacja zakładki Technologie (wzorzec dla pozostałych)

```typescript
function TechnologiesTab({ cvId }: { cvId: number }) {
  // Query 1: wszystkie technologie użytkownika
  const { data: allTechnologies } = useQuery({
    queryKey: ['technologies'],
    queryFn: () => getDataItems('technology'),
  });

  // Query 2: technologie w tym CV
  const { data: cvTechnologies } = useQuery({
    queryKey: ['cv-technologies', cvId],
    queryFn: () => getCvItems(cvId, 'technology'),
  });

  const cvTechIds = new Set(cvTechnologies?.map((t) => t.technology.id));

  const mutation = useMutation({
    mutationFn: ({ techId, inCv }: { techId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'technology', techId)
        : addItemToCv(cvId, 'technology', techId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-technologies', cvId] }),
  });

  return (
    <div>
      {/* Formularz dodawania nowej technologii do banku danych */}
      <AddTechnologyForm />

      {/* Lista z checkboxami */}
      {allTechnologies?.map((tech) => (
        <label key={tech.id}>
          <input
            type="checkbox"
            checked={cvTechIds.has(tech.id)}
            onChange={() => mutation.mutate({ techId: tech.id, inCv: cvTechIds.has(tech.id) })}
          />
          {tech.name} ({tech.level})
        </label>
      ))}
    </div>
  );
}
```

Zastosuj ten wzorzec dla: `experience`, `education`, `project`, `certificate`, `language`.

---

## Zadanie 4: Formularze dodawania danych

Dla każdego typu utwórz prosty formularz modal lub inline:

### AddExperienceForm

Pola: firma, stanowisko, data od, data do (lub checkbox "aktualnie"), opis, miasto

### AddEducationForm

Pola: uczelnia, stopień, kierunek, data od, data do

### AddTechnologyForm

Pola: nazwa (text), poziom (select: beginner/intermediate/advanced/expert), kategoria

### AddProjectForm

Pola: nazwa, opis, stack technologiczny, URL GitHub, URL live

### AddCertificateForm

Pola: nazwa, wystawca, data wydania, URL certyfikatu

### AddLanguageForm

Pola: język, poziom (select: A1/A2/B1/B2/C1/C2/native)

---

## Zadanie 5: Podgląd CV (opcjonalny bonus)

Prosta strona `/cv/:id/preview` renderująca CV jako statyczny HTML przeznaczony do druku:

- Dane profilu na górze
- Sekcje w kolejności: bio, technologie, doświadczenie, edukacja, projekty, certyfikaty, języki
- CSS `@media print` do ukrycia nawigacji

---

## Uwagi

- Używaj `useQueryClient()` + `invalidateQueries` po każdej mutacji
- Stany loading/error obsługuj w każdym query
- Nie duplikuj logiki — jeden hook `useCvItems(cvId, resource)` dla wszystkich zakładek
