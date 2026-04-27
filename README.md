# TaskFlow (React + TypeScript)

TaskFlow - это учебный, но полноценный pet-проект для GitHub.

Приложение помогает вести список задач:
- создавать задачи с описанием и приоритетом;
- отмечать выполненные;
- фильтровать задачи (все, активные, выполненные);
- удалять задачи и очищать выполненные;
- сохранять данные в `localStorage`.

## Стек

- React 19
- TypeScript
- Vite
- CSS

## Быстрый старт

```bash
npm install
npm run dev
```

Открой `http://localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```text
src/
  App.tsx      # Логика приложения
  App.css      # Стили интерфейса
  main.tsx     # Точка входа
  index.css    # Глобальные стили
```

## Как залить на GitHub

```bash
git init
git add .
git commit -m "feat: create TaskFlow react project"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Идеи для улучшения

- Добавить дедлайны и сортировку по дате.
- Добавить drag-and-drop для задач.
- Подключить backend (например, Firebase/Supabase).
