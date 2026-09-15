import { create } from 'zustand'
import { BookmarkType, State } from './types';

export const useStore = create<State>((set) => ({
  activeBookmarkType: BookmarkType.DesignArtMusic,
  setActiveBookmarkType: (activeBookmarkType: BookmarkType) => set({ activeBookmarkType })
}))
