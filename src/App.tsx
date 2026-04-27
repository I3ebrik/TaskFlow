import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Priority = 'low' | 'medium' | 'high'
type Filter = 'all' | 'active' | 'done'

type Task = {
  id: string
  title: string
  details: string
  priority: Priority
  done: boolean
  createdAt: string
}

const STORAGE_KEY = 'taskflow-github-project-v1'

const starterTasks: Task[] = [
  {
    id: crypto.randomUUID(),
    title: 'Обновить README перед пушем',
    details: 'Коротко описать проект и команды для запуска.',
    priority: 'high',
    done: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Сверстать аккуратную мобильную версию',
    details: 'Проверить отступы и кнопки на маленьком экране.',
    priority: 'medium',
    done: false,
    createdAt: new Date().toISOString(),
  },
]

const priorityLabel: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

const getInitialTasks = (): Task[] => {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return starterTasks
  }

  try {
    const parsed: Task[] = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : starterTasks
  } catch {
    return starterTasks
  }
}

const formatTaskDate = (dateISO: string): string => {
  const date = new Date(dateISO)

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const todayLabel = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

function App() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.done)
    }

    if (filter === 'done') {
      return tasks.filter((task) => task.done)
    }

    return tasks
  }, [filter, tasks])

  const total = tasks.length
  const completed = tasks.filter((task) => task.done).length
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
  const hasCompleted = completed > 0

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    const nextTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      details: details.trim(),
      priority,
      done: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [nextTask, ...prev])
    setTitle('')
    setDetails('')
    setPriority('medium')
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task,
      ),
    )
  }

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.done))
  }

  return (
    <main className="layout">
      <header className="panel hero">
        <p className="eyebrow">Pet-проект на React</p>
        <h1>Мой список дел</h1>
        <p className="subtitle">
          Небольшой трекер задач для повседневных дел. Без регистрации, просто открыл и записал.
        </p>
        <p className="today">План на {todayLabel}</p>
      </header>

      <section className="panel stats" aria-label="Статистика">
        <article>
          <span>Всего задач</span>
          <strong>{total}</strong>
        </article>
        <article>
          <span>Сделано</span>
          <strong>{completed}</strong>
        </article>
        <article>
          <span>Прогресс</span>
          <strong>{completionRate}%</strong>
        </article>
      </section>

      <section className="panel form-panel" aria-label="Создание задачи">
        <h2>Новая задача</h2>
        <form onSubmit={addTask}>
          <label htmlFor="task-title">Название</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: купить домен для портфолио"
          />

          <label htmlFor="task-details">Комментарий</label>
          <textarea
            id="task-details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={3}
            placeholder="Можно оставить пустым"
          />

          <label htmlFor="task-priority">Приоритет</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>

          <button type="submit">Добавить</button>
        </form>
      </section>

      <section className="panel list-panel" aria-label="Список задач">
        <div className="list-head">
          <h2>Что в работе</h2>
          <div className="filters" role="tablist" aria-label="Фильтр задач">
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Все
            </button>
            <button
              type="button"
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              В процессе
            </button>
            <button
              type="button"
              className={filter === 'done' ? 'active' : ''}
              onClick={() => setFilter('done')}
            >
              Сделано
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="empty">Сейчас пусто. Самое время добавить первую задачу.</p>
        ) : (
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id} className={task.done ? 'done' : ''}>
                <div className="task-main">
                  <div className="task-title-row">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Отметить задачу ${task.title}`}
                    />
                    <h3>{task.title}</h3>
                  </div>
                  {task.details ? <p>{task.details}</p> : null}
                  <div className="meta">
                    <span className={`priority ${task.priority}`}>
                      {priorityLabel[task.priority]}
                    </span>
                    <time dateTime={task.createdAt}>{formatTaskDate(task.createdAt)}</time>
                  </div>
                </div>

                <button
                  type="button"
                  className="danger"
                  onClick={() => removeTask(task.id)}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="ghost"
          onClick={clearCompleted}
          disabled={!hasCompleted}
        >
          Очистить выполненные
        </button>
      </section>

      <footer className="panel note">
        <p>Данные хранятся в браузере (localStorage), поэтому список остается после перезагрузки.</p>
      </footer>
    </main>
  )
}

export default App
