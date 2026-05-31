# Sprawozdanie z Projektu: CViT (CV Generator)

**Data:** 1 czerwca 2026 r.  
**Autor:** Jan Bocheński

---

## 1. Wstęp i Cel Projektu

Projekt **CViT** to zaawansowany generator dokumentów Curriculum Vitae (CV) w formie aplikacji webowej. Głównym celem było stworzenie narzędzia, które pozwala użytkownikowi na zarządzanie "bazą danych" swoich osiągnięć (doświadczenia, projektów, umiejętności) i elastyczne składanie z nich wielu wersji dokumentów dopasowanych pod konkretne oferty pracy.

## 2. Stos Technologiczny

Aplikacja została oparta na nowoczesnym stacku **Fullstack TypeScript**:

- **Backend:** NestJS (Node.js), TypeORM, PostgreSQL.
- **Frontend:** React.js, Vite, TailwindCSS, Headless UI.
- **Zarządzanie stanem i API:** @tanstack/react-query (pobieranie danych, cache'owanie, optimistic updates).
- **Inne:** Docker (konteneryzacja bazy i aplikacji), JWT (autoryzacja).

## 3. Przegląd Funkcjonalności

### 3.1. Dashboard i Zarządzanie Dokumentami

Dashboard pozwala na błyskawiczny przegląd wszystkich stworzonych wersji CV. Zaimplementowano funkcję grupowania dokumentów według:

- **Firmy docelowej** (ułatwia zarządzanie procesami rekrutacyjnymi),
- **Stanowiska/Nazwy** (grupowanie podobnych wariantów kompetencyjnych).

![Dashboard - Zarządzanie CV](./dashboard.png)
_Rysunek 1: Widok główny z opcjami grupowania i szybkiego tworzenia dokumentu._

### 3.2. Edytor Modułowy (Sekcje)

Edytor podzielony jest na logiczne zakładki odpowiadające elementom składowym CV. Użytkownik najpierw zarządza swoją bazą (np. dodaje wszystkie projekty), a następnie za pomocą checkboxów decyduje, które z nich mają pojawić się w aktualnie edytowanym dokumencie.

**Zaimplementowane sekcje:**

- **Bio / Podsumowanie:** Krótki opis sylwetki zawodowej.
- **Doświadczenie:** Historia zatrudnienia z obsługą stanowisk archiwalnych i trwających.
- **Projekty:** Portfolio z linkami do GitHub/Live Demo.
- **Technologie:** Skategoryzowane umiejętności z poziomem zaawansowania.
- **Certyfikaty, Języki, Linki, Zainteresowania i Aktywności dodatkowe.**

![Edytor - Sekcja Technologii](./edit-cv-technologies.png)
_Rysunek 2: Interfejs wyboru i dodawania technologii do CV._

![Edytor - Sekcja Doświadczenia](./edit-cv-expierience.png)
_Rysunek 3: Formularz edycji doświadczenia zawodowego._

### 3.3. Personalizacja i Ustawienia (Layout)

Zgodnie z wymaganiami, użytkownik ma pełną kontrolę nad tym, jak dokument wygląda. W zakładce **"Ustawienia"** zaimplementowano mechanizm **Drag & Drop (Move Up/Down)**, który pozwala zmieniać kolejność sekcji na gotowym wydruku. Dodatkowo można ukrywać/pokazywać zdjęcie, e-mail czy numer telefonu.

![Ustawienia - Kolejność Sekcji](./edit-cv-settings.png)
_Rysunek 4: Panel konfiguracji kolejności wyświetlania modułów w PDF._

### 3.4. Profil Użytkownika

Dane osobowe są scentralizowane w zakładce "Mój Profil". Raz wprowadzone imię, nazwisko czy zdjęcie profilowe (Avatar) są automatycznie propagowane do wszystkich wersji dokumentów.

![Mój Profil](./my-profile.png)
_Rysunek 5: Centralny panel zarządzania danymi osobowymi._

### 3.5. Podgląd i Generowanie PDF

Dokument renderowany jest dynamicznie na podstawie bazy danych. Zastosowano style CSS dedykowane dla mediów drukowanych (`@media print`), co pozwala na czysty eksport do pliku PDF w formacie A4 bezpośrednio z poziomu przeglądarki.

![Podgląd dokumentu](./cv-preview.png)
_Rysunek 6: Renderowanie końcowego dokumentu CV._

![Wydruk PDF](./print.png)
_Rysunek 7: Systemowe okno drukowania/zapisu do PDF._

---

## 4. Wyzwania Techniczne i Rozwiązania

Podczas prac nad projektem rozwiązano szereg problemów inżynierskich:

1. **Deduplikacja i Agregacja API:** Aby uniknąć "floodingu" zapytaniami podczas ładowania 10 zakładek edytora, wdrożono endpoint `/data/aggregated` i mechanizm cache'owania po stronie frontendu.
2. **Optimistic Saving:** Zaimplementowano natychmiastowe aktualizowanie UI po kliknięciu checkboxa, zanim serwer potwierdzi zapis. Poprawia to płynność pracy (brak "zacięć").
3. **Circular Dependency:** Rozwiązano błąd krążących zależności między encjami `User` i `Profile` poprzez zastosowanie typu referencyjnego string w TypeORM.
4. **Walidacja Dat:** Wdrożono transformatory DTO, które mapują formaty `YYYY-MM` (używane przez wygodne kalendarze na frontendzie) na pełne daty akceptowane przez PostgreSQL.

## 5. Podsumowanie

Aplikacja CViT jest kompletnym narzędziem spełniającym założenia projektowe. Zapewnia wysoką wydajność (dzięki optymalizacji zapytań i CSS), spójność danych oraz intuicyjny interfejs użytkownika. Projekt jest gotowy do dalszego rozwoju o nowe szablony graficzne.
