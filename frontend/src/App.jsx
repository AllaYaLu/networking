import { useState } from 'react'
import './App.css'

function App() {
  // Стейты для авторизации
  const [loginEmail, setLoginEmail] = useState('')      // Что вводим в поле логина
  const [currentUser, setCurrentUser] = useState(null)  // Данные вошедшего пользователя

  // Стейт для редактирования поля "О себе"
  const [newAbout, setNewAbout] = useState('')

  const API_URL = 'http://localhost:8000/api/v1/users'

  // --- 1. Функция "Входа" в личный кабинет ---
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginEmail.trim()) return

    try {
      // Делаем запрос на твой эндпоинт GET /api/v1/users/{email}
      const response = await fetch(`${API_URL}/${encodeURIComponent(loginEmail.trim())}`)
      
      if (!response.ok) {
        throw new Error('Пользователь с таким Email не найден в базе данных')
      }

      const userData = await response.json()
      setCurrentUser(userData)       // Сохраняем пользователя в память (мы вошли!)
      setNewAbout(userData.about || '') // Сразу заполняем поле "О себе" для редактирования
    } catch (err) {
      alert(err.message)
    }
  }

  // --- 2. Функция изменения данных "О себе" (PATCH) ---
  const handleUpdateAbout = async (e) => {
    e.preventDefault()
    
    try {
      // Твой эндпоинт: PATCH /api/v1/users/{email}?about=текст
      // Судя по твоему коду users.py (строка 47), about идет как query-параметр в URL
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(currentUser.email)}?about=${encodeURIComponent(newAbout)}`, 
        { method: 'PATCH' }
      )

      if (!response.ok) throw new Error('Не удалось обновить данные')

      // Обновляем данные на экране
      setCurrentUser({ ...currentUser, about: newAbout })
      alert('Профиль успешно обновлен!')
    } catch (err) {
      alert(err.message)
    }
  }

  // --- 3. Функция выхода из кабинета ---
  const handleLogout = () => {
    setCurrentUser(null)
    setLoginEmail('')
  }

  // --- ИНТЕРФЕЙС ---
  return (
    <div className="container">
      <h1>Networking Space</h1>

      {/* ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ ВОШЕЛ — ПОКАЗЫВАЕМ ФОРМУ ВХОДА */}
      {!currentUser ? (
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Вход в личный кабинет</h2>
          <p>Введите свой Email, чтобы войти в профиль</p>
          <input 
            type="email" 
            placeholder="your-email@example.com" 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <button type="submit">Войти</button>
        </form>
      ) : (
        /* ЕСЛИ ПОЛЬЗОВАТЕЛЬ ВОШЕЛ — ПОКАЗЫВАЕМ ЛИЧНЫЙ КАБИНЕТ */
        <div className="profile-card">
          <div className="profile-header">
            <h2>Личный кабинет</h2>
            <button className="btn-logout" onClick={handleLogout}>Выйти</button>
          </div>

          <div className="profile-info">
            <p><strong>Имя:</strong> {currentUser.name}</p>
            <p><strong>Фамилия:</strong> {currentUser.surname}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>ID в системе:</strong> <small>{currentUser.id}</small></p>
          </div>

          {/* ФОРМА РЕДАКТИРОВАНИЯ "О СЕБЕ" (Твой эндпоинт PATCH) */}
          <form onSubmit={handleUpdateAbout} className="update-about-form">
            <label><strong>О себе:</strong></label>
            <textarea 
              value={newAbout} 
              onChange={(e) => setNewAbout(e.target.value)}
              placeholder="Расскажите о своих навыках или проектах..."
            />
            <button type="submit">Сохранить изменения</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App

