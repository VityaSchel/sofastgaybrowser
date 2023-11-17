import React from 'react'
import { forums } from '@/shared/model/forums'
import { ForumContext } from '@/shared/context/forum'
import { useParams } from 'react-router-dom'

export function ForumTopics() {
  const { id } = useParams()
  const { forum } = React.useContext(ForumContext)
  if (forum === null) return null

  return (
    <div>
      {forum.topics.map(topic => (
        <div key={topic.id} className='px-2 pt-2 text-white'>
          <h3 className='font-bold'>{topic.title}</h3>
        </div>
      ))}
    </div>
  )
}