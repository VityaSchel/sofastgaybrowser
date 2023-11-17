import React from 'react'
import { useParams } from 'react-router-dom'
import type { Forum } from 'gayporn/out/model/forum'
import { ForumContext } from '@/shared/context/forum'
import { ForumPoster } from '@/widgets/forum/poster'
import { ForumTopics } from '@/widgets/forum/topics'

export function ForumPage() {
  const { id } = useParams()
  const [forumInfo, setForumInfo] = React.useState<Forum | null>(null)

  if (!id || !Number.isSafeInteger(Number(id))) {
    console.error('Invalid forum ID', id)
    return null
  }

  React.useEffect(() => {
    fetchForum()
  }, [id])

  const fetchForum = async () => {
    const forum = await window.api.getForum(Number(id))
    setForumInfo(forum)
  }

  if (forumInfo === null) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <span className='text-white font-bold text-lg'>Загрузка форума...</span>
      </div>
    )
  }

  return (
    <ForumContext.Provider value={{ forum: forumInfo }}>
      <main className='w-full min-h-screen'>
        <ForumPoster />
        <ForumTopics />
      </main>
    </ForumContext.Provider>
  )
}