export function Login() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation()
  }

  return (
    <main className='w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-6 w-96'>
        <h1 className='font-black text-3xl'>Вход по токену</h1>
        <form onSubmit={handleSubmit} className='flex flex-col items-start gap-3'>
          <input type="text" placeholder="Введите значение bbData" className='p-2 w-full' />
          <button type="submit" className='text-white bg-indigo-500 py-2 px-4 rounded-md font-semibold shadow-lg shadow-indigo-500/50'>Сохранить</button>
        </form>
      </div>
    </main>
  )
}