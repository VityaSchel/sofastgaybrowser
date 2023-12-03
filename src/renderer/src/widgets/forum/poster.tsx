import React from 'react'
import { forums } from '@/shared/model/forums'
import { ForumContext } from '@/shared/context/forum'
import { useParams } from 'react-router-dom'
import { useWindowScroll } from 'react-use'
import { useComponentSize } from 'react-use-size'

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2
}
function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

export function ForumPoster() {
  const { id } = useParams()
  const { forum } = React.useContext(ForumContext)
  const { y } = useWindowScroll()
  const { ref, width } = useComponentSize()
  if (forum === null) return null

  const poster = id ? forums[id].poster : ''

  const blockHeight = React.useMemo(() => width * 600 / 1920, [width])
  const minHeight = 80
  const maxScroll = blockHeight - minHeight
  const scroll = Math.min(y, maxScroll)

  return (
    <div 
      className='w-full'
      style={{ height: blockHeight }}
      ref={ref}
    >
      <div 
        className='w-full h-auto aspect-[1920/600] fixed z-10 top-0 overflow-hidden bg-center bg-cover bg-neutral-800'
        style={{ 
          height: blockHeight - y,
          minHeight: minHeight
        }}
      >
        <img 
          src={poster} 
          className='w-full h-full absolute pointer-events-none object-cover select-none'
          style={{
            filter: `blur(${scroll / maxScroll * 5}px)`,
            transform: `scale(${scroll / maxScroll * 0.01 + 1})`,
            transformOrigin: 'center',
          }}
        />
        <h1 
          className='absolute bottom-5 left-8 z-10 text-white font-black text-5xl text-shadow-forum-headline shadow-neutral-800'
          style={{
            transform: `scale(${1 - easeInOutSine(scroll / maxScroll) * 0.2})`,
            left: `${32 - scroll / maxScroll * 16}px`,
            bottom: `${20 - scroll / maxScroll * 5}px`,
            transformOrigin: 'left'
          }}
        >
          {forum.name}
        </h1>
        <span className='w-full h-px bg-neutral-600 bottom-0 absolute' />
      </div>
    </div>
  )
}