import { useState, useEffect } from 'react'
import './App.css' 

function App() {
  // --- 1. Стейты для данных с сервера ---
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // --- 2. Стейты для полей формы (CreateUser) ---
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [about, setAbout] = useState('')

  // Стейт для отслеживания: редактируем ли мы кого-то прямо сейчас?
  const [editingEmail, setEditingEmail] = useState(null)

  const API_URL = 'http://localhost:8000/api/v1/users'

  // --- Функция получения всех пользователей (GET /) ---
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/`)
      if (!response.ok) throw new Error('Ошибка при загрузке пользователей')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // --- Функция создания нового пользователя (POST /) ---
  const handleCreateUser = async (e) => {
    e.preventDefault()
    
    // name и surname обязательны по твоей схеме CreateUser
    if (!name.trim() || !surname.trim()) {
      alert('Имя и Фамилия обязательны для заполнения!')
      return
    }

    try {
      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Передаем ровно те поля, которые требует схема CreateUser
        body: JSON.stringify({
          name: name,
          surname: surname,
          email: email.trim() === '' ? null : email, // Если пусто — шлем null
          about: about.trim() === '' ? null : about
        })
      })

      if (!response.ok) throw new Error('Не удалось создать пользователя')

      // Очищаем форму после успеха
      setName('')
      setSurname('')
      setEmail('')
      setAbout('')
      
      fetchUsers() // Обновляем список на экране
    } catch (err) {
      alert(err.message)
    }
  }

  // --- Функция удаления пользователя (DELETE /{email}) ---
  const handleDeleteUser = async (userEmail) => {
    if (!userEmail) {
      alert('У этого пользователя нет Email, удалить через API нельзя (в роутере привязка к email)')
      return
    }

    if (!window.confirm(`Вы уверены, что хотите удалить пользователя ${userEmail}?`)) return

    try {
      const response = await fetch(`${API_URL}/${userEmail}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Ошибка при удалении')
      
      fetchUsers() 
    } catch (err) {
      alert(err.message)
    }
  }

  // --- Функция обновления поля "О себе" (PATCH /{email}) ---
  const handleUpdateAbout = async (userEmail) => {
    const newAbout = prompt('Введите новый текст "О себе":')
    if (newAbout === null) return // Нажали отмену

    try {
      const response = await fetch(`${API_URL}/${userEmail}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // эндпоинт принимает строку about как query-параметр или body. 
        // Передаем строку в формате JSON, если эндпоинт ждет тело:
        body: JSON.stringify(newAbout) 
      })

      // Примечание: Если на бекенде прилетает ошибка 422, значит FastAPI ждал `about` в строке URL. 
      // Тогда адрес запроса нужно изменить на: `${API_URL}/${userEmail}?about=${encodeURIComponent(newAbout)}` c методом PATCH.

      if (!response.ok) throw new Error('Ошибка при обновлении профиля')
      
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="container">
      <h1>Участники Сети (Networking)</h1>

      {/* ФОРМА СОЗДАНИЯ (Соответствует CreateUser) */}
      <form onSubmit={handleCreateUser} className="user-form">
        <h3>Регистрация нового пользователя</h3>
        
        <input 
          type="text" 
          placeholder="Имя (Обязательно)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        
        <input 
          type="text" 
          placeholder="Фамилия (Обязательно)" 
          value={surname} 
          onChange={(e) => setSurname(e.target.value)} 
          required 
        />
        
        <input 
          type="email" 
          placeholder="Email (Опционально)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <textarea 
          placeholder="О себе (Опционально)" 
          value={about} 
          onChange={(e) => setAbout(e.target.value)} 
        />

        <button type="submit">Добавить в базу</button>
      </form>

      {/* СПИСОК ПОЛЬЗОВАТЕЛЕЙ (Соответствует User) */}
      <div className="users-section">
        <h3>Зарегистрированные пользователи</h3>

        {loading && <p className="status">Загрузка данных из БД...</p>}
        {error && <p className="status error">Ошибка: {error}</p>}
        
        <div className="users-list">
          {users.map((user) => (
            <div key={user.id || user.email} className="user-card">
              <div className="user-info">
                <h4>{user.name} {user.surname}</h4>
                <p className="email-text"><strong>Email:</strong> {user.email || 'Не указан'}</p>
                <p className="about-text"><strong>О себе:</strong> {user.about || 'Ничего не указано'}</p>
                <small className="id-text">ID: {user.id}</small>
              </div>
              
              <div className="card-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleUpdateAbout(user.email)}
                  disabled={!user.email}
                >
                  Изменить "О себе"
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteUser(user.email)}
                  disabled={!user.email}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
