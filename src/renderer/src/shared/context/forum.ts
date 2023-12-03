import React from 'react'
import { Forum, ForumMin } from 'gayporn/out/model/forum'

export const ForumContext = React.createContext<{ 
  forum: Forum | null
  subforum: ForumMin | null
  onChangeSubforum: (subforum: ForumMin | null) => void
    }>({ forum: null, subforum: null, onChangeSubforum: () => {} })