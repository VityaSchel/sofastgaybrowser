import { TabSwitch } from '@/shared/ui/tab-switch'
import React from 'react'

export function Login({ onSubmit }: {
  onSubmit: (token: string) => void
}) {
  const [tab, setTab] = React.useState<'login' | 'token'>('login')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [captcha, setCaptcha] = React.useState('')
  const [token, setToken] = React.useState('')
  const [captchaURL, setCaptchaURL] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSaveToken = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    e.stopPropagation()
    try {
      const isCorrect = await window.api.setToken(token)
      if (isCorrect) {
        onSubmit(token)
      } else {
        alert('Неверный токен')
      }
      setIsLoading(false)
    } catch(e) {
      alert('Неверный токен')
      setIsLoading(false)
    }fet
  }

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    e.stopPropagation()
    const response = await window.api.login(username, password, captchaURL ? captcha : undefined)
    if(response.ok) {
      if(response.captcha) {
        setCaptchaURL(response.captchaURL)
      } else {
        onSubmit(response.token)
      }
    } else {
      alert(response.error)
      setCaptchaURL('')
      setCaptcha('')
    }
    setIsLoading(false)
  }

  return (
    <main className='w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-6 w-96'>
        <h1 className='font-black text-3xl text-white'>Вход в аккаунт</h1>
        <TabSwitch
          values={[
            { label: 'Логин и пароль', value: 'login' },
            { label: 'Токен bb_data', value: 'token' }
          ]}
          value={tab}
          onChange={newTab => setTab(newTab as typeof tab)}
        />
        <div className='relative h-48 w-full'>
          <div className='transition-all duration-200 absolute w-full top-0' style={{ 
            opacity: tab === 'login' ? 0 : 1,
            marginLeft: tab === 'login' ? 50 : 0,
            pointerEvents: tab === 'login' ? 'none' : 'all'
          }}>
            <form onSubmit={handleSaveToken} className='flex flex-col items-start gap-3'>
              <input 
                type="text" 
                placeholder="Введите значение bbData" 
                className='p-2 w-full bg-neutral-800 text-white rounded'
                value={token} 
                onChange={e => setToken(e.target.value)} 
              />
              <button type="submit" className='text-white bg-indigo-500 py-2 px-4 rounded-md font-semibold shadow-lg shadow-indigo-500/50'>Сохранить</button>
            </form>
          </div>
          <div className='transition-all duration-200 absolute w-full top-0' style={{
            opacity: tab === 'token' ? 0 : 1,
            marginLeft: tab === 'token' ? -50 : 0,
            pointerEvents: tab === 'token' ? 'none' : 'all'
          }}>
            <form onSubmit={handleAuth} className='flex flex-col items-start gap-3'>
              <input 
                type="text" 
                placeholder="Имя пользователя" 
                className='p-2 w-full bg-neutral-800 text-white rounded'
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                disabled={isLoading}
              />
              <input 
                type="password" 
                placeholder="Пароль" 
                className='p-2 w-full bg-neutral-800 text-white rounded'
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                disabled={isLoading}
              />
              {captchaURL && (
                <div className='flex items-center gap-3 w-full'>
                  <img src={captchaURL} />
                  <input 
                    type="text"
                    placeholder="Капча" 
                    className='p-2 w-full bg-neutral-800 text-white rounded'
                    value={captcha} 
                    onChange={e => setCaptcha(e.target.value)} 
                    disabled={isLoading}
                  />
                </div>
              )}
              <button
                type="submit"
                className='text-white bg-indigo-500 py-2 px-4 rounded-md font-semibold shadow-lg shadow-indigo-500/50 disabled:shadow-none disabled:bg-indigo-500/50 disabled:cursor-not-allowed'
                disabled={isLoading || !username || !password || (Boolean(captchaURL) && !captcha)}
              >
                Войти
              </button>
            </form>  
          </div>
        </div>
      </div>
    </main>
  )
}