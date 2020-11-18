export type SimklEpisodes = {
  title: string;
  description?: string;
  episode: number;
  aired: boolean;
  img: string | undefined;
  ids: {
    simkl_id: number;
  };
  link: string;
};

export type SimklIDConversionModel = {
  type: string;
  ids: {
    simkl: number;
    slug: string;
  };
};
