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

export enum DatePeriodType {
  LAST_ONE_WEEK = 'LAST_ONE_WEEK',
  LAST_TWO_WEEKS = 'LAST_TWO_WEEKS',
  LAST_ONE_MONTH = 'LAST_ONE_MONTH',
  ALL_TIME = 'ALL_TIME'
}
