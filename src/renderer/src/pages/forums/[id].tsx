import React from 'react'
import { useParams } from 'react-router-dom'
import { ForumMin, type Forum } from 'gayporn/out/model/forum'
import { type TopicMin } from 'gayporn/out/model/topic'
import { ForumContext } from '@/shared/context/forum'
import { ForumPoster } from '@/widgets/forum/poster'
import { ForumTopics } from '@/widgets/forum/topics'
import { ForumSubforums } from '@/widgets/forum/subforums'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'

export function ForumPage() {
  const { id } = useParams()
  const [forumInfo, setForumInfo] = React.useState<Forum | null>(null)
  const [subforumInfo, setSubforumInfo] = React.useState<ForumMin | null>(null)
  const [topics, setTopics] = React.useState<TopicMin[] | null>(null)
  const [page, setPage] = React.useState(1)

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
    setTopics(forum.topics)
  }

  React.useEffect(() => {
    fetchSubforum()
  }, [subforumInfo])

  const fetchSubforum = async () => {
    if (subforumInfo === null) return
    setTopics(null)
    const subforum = await window.api.getForum(Number(subforumInfo.id))
    setTopics(subforum.topics)
  }

  const handleLoadMoreTopics = async () => {
    if (subforumInfo === null || topics === null) return
    const response = await window.api.getForum(subforumInfo.id, page)
    setPage(page + 1)
    setTopics([...topics, ...response.topics])
  }

  if (forumInfo === null) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <span className='text-white font-bold text-lg'>Загрузка форума...</span>
      </div>
    )
  }

  return (
    <ForumContext.Provider value={{ forum: forumInfo, subforum: subforumInfo, onChangeSubforum: setSubforumInfo }}>
      <main className='w-full min-h-screen'>
        <ForumPoster />
        {subforumInfo !== null && (
          <Breadcrumbs
            items={[
              { link: `/forums/${forumInfo.id}`, label: forumInfo.name },
              { label: subforumInfo.name }
            ]}
            onNavigate={() => {
              setSubforumInfo(null)
              setTopics(forumInfo.topics)
            }}
          />
        )}
        {subforumInfo === null && <ForumSubforums />}
        {topics === null && (
          <div className='flex items-center justify-center h-64'>
            <span className='text-white font-bold text-lg'>Загрузка тем...</span>
          </div>
        )}
        {subforumInfo !== null && (
          <ForumTopics 
            topics={topics} 
            onLoadMore={handleLoadMoreTopics}
          />
        )}
      </main>
    </ForumContext.Provider>
  )
}