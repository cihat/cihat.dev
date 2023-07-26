const technicalID = '36052893';
const designArtMusicID = '36052966';
const otherID = '36051708';

export enum BookmarkType {
  Technical = technicalID,
  DesignArtMusic = designArtMusicID,
  Other = otherID
}

export type State = {
  activeBookmarkType: BookmarkType
}