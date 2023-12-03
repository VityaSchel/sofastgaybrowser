import React from 'react'
import { ForumContext } from '@/shared/context/forum'
import { ForumMin } from 'gayporn/out/model/forum'
import { Link, useParams } from 'react-router-dom'
import { ArchiveIcon, BookImageIcon, FilmIcon, GroupIcon, VideoIcon } from 'lucide-react'
import { MdHd } from 'react-icons/md'

export function ForumSubforums() {
  const { forum } = React.useContext(ForumContext)
  if (forum === null) return null

  return (
    <div className='flex justify-center w-full'>
      <div className='columns-1 sm:columns-2 gap-4 p-4 space-y-4'>
        {forum.subforums.map(subforum => (
          <Subforum 
            key={subforum.id} 
            forumMin={subforum} 
          />
        ))}
      </div>
    </div>
  )
}

function Subforum({ forumMin }: {
  forumMin: ForumMin
}) {
  const { id } = useParams()
  const { onChangeSubforum } = React.useContext(ForumContext)

  const formattedName = /^[^/]+ \/ [^/]+$/.test(forumMin.name)
    ? forumMin.name.split(' / ')[0]
    : forumMin.name

  const subforumInfo = subforums[forumMin.id]
  const icon = subforumInfo?.icon ?? null

  if (subforumInfo?.hidden) return null

  const handleOpenSubforum = () => {
    onChangeSubforum(forumMin)
  }

  return (
    <button
      onClick={handleOpenSubforum}
      className='pl-4 h-[52px] font-extrabold bg-neutral-800 hover:bg-neutral-700 hover:shadow-zinc-800 hover:shadow-md rounded-md text-sm max-h-[52px] max-w-[472px] flex gap-3 items-center w-full text-neutral-300 hover:text-white transition-all'
    >
      {icon}
      <span className='line-clamp-1 text-ellipsis text-left flex-1'>
        {formattedName.trim()}
      </span>
      <div className='bg-neutral-900 bg-opacity-50 h-full flex items-center px-4 tabular-nums font-medium text-neutral-200'>
        {Intl.NumberFormat().format(forumMin.topics)}
      </div>
    </button>
  )
}

const subforums: {
  [key: number]: {
    hidden?: boolean
    icon?: React.ReactNode
  }
} = {
  1689: {
    hidden: true
  },
  903: {
    icon: <FilmIcon />
  },
  1765: {
    icon: <FilmIcon />
  },
  1767: {
    icon: <FilmIcon />
  },
  1755: {
    icon: <FilmIcon />
  },
  1787: {
    icon: <FilmIcon />
  },
  1763: {
    icon: <GroupIcon />
  },
  1777: {
    icon: <MdHd size={24} />
  },
  1691: {
    icon: <VideoIcon />
  },
  1692: {
    icon: <BookImageIcon />
  },
  1720: {
    icon: <ArchiveIcon />
  },
}