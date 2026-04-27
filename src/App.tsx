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
    title: 'Собрать структуру проекта',
    details: 'Настроить папки, базовые компоненты и README для GitHub.',
    priority: 'high',
    done: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Добавить локальное сохранение',
    details: 'Сохранять задачи в localStorage, чтобы они не пропадали после перезагрузки.',
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
        <p className="eyebrow">React + TypeScript Project</p>
        <h1>TaskFlow</h1>
        <p className="subtitle">
          Мини-проект для GitHub: управление задачами с фильтрами, приоритетами и сохранением данных в браузере.
        </p>
      </header>

      <section className="panel stats" aria-label="Статистика">
        <article>
          <span>Всего задач</span>
          <strong>{total}</strong>
        </article>
        <article>
          <span>Выполнено</span>
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
            placeholder="Например: Подготовить README"
          />

          <label htmlFor="task-details">Описание</label>
          <textarea
            id="task-details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={3}
            placeholder="Добавь короткое описание задачи"
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

          <button type="submit">Добавить задачу</button>
        </form>
      </section>

      <section className="panel list-panel" aria-label="Список задач">
        <div className="list-head">
          <h2>Задачи</h2>
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
              Активные
            </button>
            <button
              type="button"
              className={filter === 'done' ? 'active' : ''}
              onClick={() => setFilter('done')}
            >
              Готово
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="empty">По текущему фильтру задач нет.</p>
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
                    <time dateTime={task.createdAt}>
                      {new Date(task.createdAt).toLocaleDateString('ru-RU')}
                    </time>
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

        <button type="button" className="ghost" onClick={clearCompleted}>
          Очистить выполненные
        </button>
      </section>
    </main>
  )
}

export default App

