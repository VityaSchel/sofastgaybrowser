export function Breadcrumbs({ items, onNavigate }: {
  items: {
    link?: string
    label: string
  }[]
  onNavigate: (link: string) => void
}) {
  return (
    <div className='border-b border-neutral-600 py-2 px-3 sticky z-10 bg-neutral-900 top-[79px]'>
      {items.map((item, i, ar) => (
        <span key={`${item.label}_${i}_${item.link}`} className='inline-block text-neutral-400'>
          {item.link
            ? (
              <span 
                className='hover:text-neutral-200 font-semibold cursor-pointer' 
                onClick={() => onNavigate(item.link!)}
              >
                {item.label}
              </span>
            ) : (
              <span className='text-neutral-400'>{item.label}</span>
            )
          }
          {i !== ar.length - 1 && <span className='text-neutral-600 font-extrabold mx-2'>&rarr;</span>}
        </span>
      ))}
    </div>
  )
}