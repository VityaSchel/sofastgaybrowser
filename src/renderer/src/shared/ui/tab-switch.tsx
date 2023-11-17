import React from 'react'
import { useComponentSize } from 'react-use-size'

export function TabSwitch({ values, value, onChange }: {
  values: { label: string, value: string }[]
  value: string
  onChange: (value: string) => void
}) {
  const tabIndex = values.findIndex(v => v.value === value)
  const tabsRefs = React.useRef<HTMLButtonElement[]>([])
  const { ref, width } = useComponentSize()
  const [indicatorWidth, setIndicatorWidth] = React.useState(0)
  const [indicatorLeft, setIndicatorLeft] = React.useState(0)

  React.useEffect(() => {
    setIndicatorWidth(tabsRefs.current[tabIndex]?.offsetWidth)
    setIndicatorLeft(tabsRefs.current[tabIndex]?.offsetLeft)
  }, [width, tabIndex])

  return (
    <div className='bg-neutral-800 rounded-lg relative p-1 h-10 flex' ref={ref}>
      {values.map((value, i) => (
        <button 
          key={value.value} 
          onClick={() => onChange(value.value)} 
          className='font-semibold relative z-10 text-white flex items-center justify-center flex-1'
          ref={el => tabsRefs.current[i] = el!}
        >
          {value.label}
        </button>
      ))}
      <div 
        className='absolute bg-neutral-900 h-8 w-40 top-1/2 -translate-y-1/2 rounded-md' 
        style={{ 
          width: indicatorWidth,
          left: indicatorLeft,
          transition: 'left 200ms cubic-bezier(0.4, 0, 0.2, 1), width 0s linear'
        }}
      />
    </div>
  )
}