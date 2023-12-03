import React from 'react'
import { type Topic as TopicType, TopicMin } from 'gayporn/out/model/topic'
import { parse } from 'node-html-parser'
import cx from 'classnames'
import { useHotkeys } from 'react-hotkeys-hook'
import { createPortal } from 'react-dom'
import { IconButton } from '@/shared/ui/icon-button'
import { MdClose, MdFullscreen } from 'react-icons/md'
import { SaveButton } from '@/features/save-button'
import { OpenButton } from '@/features/open-button'

export function ForumTopics({ topics }: {
  topics: TopicMin[] | null
}) {

  if(topics === null) return null

  return (
    <div className='grid grid-cols-2 p-4 gap-4'>
      {topics.slice(0, 5).map(topic => (
        <Topic topic={topic} key={topic.id} />
      ))}
    </div>
  )
}

function Topic({ topic }: {
  topic: TopicMin
}) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [topicInfo, setTopicInfo] = React.useState<null | TopicType>(null)
  const [topicImages, setTopicImages] = React.useState<{ src: string, fullsizeSrc?: string }[] | null>(null)

  React.useEffect(() => {
    fetchTopic()
  }, [])

  const fetchTopic = async () => {
    try {
      const response = await window.api.getTopic(topic.id)
      setTopicInfo(response)
      parseImages(response.htmlContent)
    } catch(e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const parseImages = (htmlContent: string) => {
    const imgs: { src: string, fullsizeSrc?: string }[] = []
    parse(htmlContent).querySelectorAll('.postImg').map(img => {
      const src = img.getAttribute('title')
      let fullsizeSrc
      if(img.parentNode.tagName === 'A') {
        fullsizeSrc = img.parentNode.getAttribute('href')
      }
      src && imgs.push({ src, fullsizeSrc })
    })
    setTopicImages(imgs)
  }

  return (
    <div className='px-2 pt-2 text-white border rounded-md border-neutral-400 flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <h3 className='font-semibold text-sm'>{topic.title}</h3>
        <div className='flex flex-col gap-2'>
          {topicInfo?.type === 'file' && (
            <OpenButton 
              topicId={topic.id}
            />
          )}
          {topicInfo?.type === 'file' && (
            <SaveButton 
              topicId={topic.id}
            />
          )}
        </div>
      </div>
      {isLoading ? (
        <div className='flex items-center justify-center h-96'>
          <span className='text-sm font-bold'>Загрузка...</span>
        </div>
      ) : (
        topicInfo === null ? (
          <div className='flex items-center justify-center h-96'>
            <span className='text-sm font-bold text-red-600'>Ошибка</span>
          </div>
        ) : (
          <div className='grid grid-cols-4 h-96 overflow-auto gap-2 py-2'>
            {topicImages?.map((imgSrc, i) => (
              <TopicImage key={`${imgSrc}_${i}`} src={imgSrc.src} fullsizeSrc={imgSrc.fullsizeSrc} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

function TopicImage({ src, fullsizeSrc }: {
  src: string
  fullsizeSrc?: string
}) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [isFullsize, setIsFullsize] = React.useState(false)
  const [isHover, setIsHover] = React.useState(false)
  useHotkeys('esc', () => isFullscreen && setIsFullscreen(false), [isFullscreen, setIsFullscreen])

  return (
    <>
      <div className='w-full h-full aspect-video relative'
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
      >
        <img
          src={src}
          alt=''
          className={cx('bg-neutral-700 h-full w-full object-contain cursor-pointer', {
            'fixed top-0 left-0 w-screen h-screen z-50 cursor-auto': isFullscreen
          })}
          onClick={() => isFullscreen ? setIsFullscreen(false) : setIsFullsize(true)}
        />
        <IconButton
          className={cx('absolute right-1 bottom-1', { 'opacity-100': isHover, 'opacity-0': !isHover })}
          onClick={() => setIsFullscreen(true)}
        >
          <MdFullscreen />
        </IconButton>
      </div>
      {isFullsize && fullsizeSrc && (
        createPortal((
          <FullSizeImage src={fullsizeSrc} onClose={() => setIsFullsize(false)} />
        ), document.querySelector('#portal')!, fullsizeSrc)
      )}
    </>
  )
}

function FullSizeImage({ src, onClose }: {
  src: string
  onClose: () => void
}) {
  const [scrollPosition, setScrollPosition] = React.useState(0)
  React.useEffect(() => {
    setScrollPosition(window.scrollY)
  }, [scrollPosition])
  useHotkeys('esc', onClose, [onClose])
  
  React.useEffect(() => {
    window.document.body.style.overflow = 'hidden'

    return () => {
      window.document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      <iframe
        src={src}
        className='w-screen h-screen fixed top-0 left-0 z-[100]'
        sandbox=''
      />
      <IconButton
        onClick={onClose}
        className='fixed top-2 right-2 z-[101]'
      >
        <MdClose />
      </IconButton>
    </>
  )
}