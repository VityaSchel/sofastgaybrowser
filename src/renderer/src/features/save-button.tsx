import { IconButton } from '@/shared/ui/icon-button'
import { MdSave } from 'react-icons/md'

export function SaveButton({ topicId }: {
  topicId: number
}) {
  const handleSave = async () => {
    const result = await window.api.saveTorrentFile(topicId)
    if(!result.ok) {
      if(result.error) {
        alert('Ошибка при скачивании файла. ' + result.error)
      } else {
        alert('Ошибка при скачивании файла')
      }
    }
  }

  return (
    <IconButton onClick={handleSave}>
      <MdSave />
    </IconButton>
  )
}
