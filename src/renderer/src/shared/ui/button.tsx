export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className='text-white bg-indigo-500 py-2 px-4 rounded-md font-semibold shadow-lg shadow-indigo-500/50 disabled:shadow-none disabled:bg-indigo-500/50 disabled:cursor-not-allowed'
      {...props}
    >
      {children}
    </button>
  )
}