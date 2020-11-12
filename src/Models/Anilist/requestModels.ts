import {AnilistRequestTypes} from '.';

export type AnilistPagedData = {
  data: {
    Page: {
      pageInfo: PageInfo;
      media: Media[];
    };
  };
  type: AnilistRequestTypes;
};

export type PageInfo = {
  hasNextPage: boolean;
  currentPage: number;
};

export type Media = {
  id: number;
  isAdult: boolean;
  title: {
    romaji: string;
    english?: string;
  };
  coverImage: {
    extraLarge: string;
  };
  bannerImage?: string;
};
