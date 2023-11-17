import React from 'react'
import { Forum } from 'gayporn/out/model/forum'

export const ForumContext = React.createContext<{ forum: Forum | null }>({ forum: null })