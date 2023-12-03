import { IconButton } from '@/shared/ui/icon-button'
import { MdDownload } from 'react-icons/md'

export function OpenButton({ topicId }: {
  topicId: number
}) {
  const handleOpen = async () => {
    const result = await window.api.openTorrentFile(topicId)
    if(!result.ok) {
      if(result.error) {
        alert('Ошибка при скачивании файла. ' + result.error)
      } else {
        alert('Ошибка при скачивании файла')
      }
    }
  }

  return (
    <IconButton onClick={handleOpen}>
      <MdDownload />
    </IconButton>
  )
}
