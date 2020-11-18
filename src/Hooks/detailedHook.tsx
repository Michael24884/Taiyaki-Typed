import {useEffect, useRef, useState} from 'react';
import {LayoutAnimation} from 'react-native';
import {SourceBase} from '../Classes/SourceBase';
import {SimklEpisodes} from '../Models/SIMKL';
import {DetailedDatabaseModel} from '../Models/taiyaki';
import {useSimklRequests} from './useRequest';

export function useDetailedHook(
  id: number,
  database?: DetailedDatabaseModel,
  idMal?: string,
) {
  const timer = useRef<NodeJS.Timeout>();
  const [rawLinks, setLinks] = useState<string[]>([]);
  const [fullData, setFullData] = useState<SimklEpisodes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setError] = useState<string>();

  const {
    query: {data: SimklEpisodeData},
    controller,
  } = useSimklRequests<SimklEpisodes[]>(
    'simkl' + id,
    '/anime/episodes/',
    idMal,
    rawLinks.length > 0,
  );

  const _mixer = () => {
    let items: SimklEpisodes[] = [];
    for (let i = 0; i < rawLinks.length; i++) {
      const episode = SimklEpisodeData![i];
      const raw = rawLinks[i];
      episode.link = raw;
      items.push(episode);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFullData(items);
  };

  useEffect(() => {
    if (
      SimklEpisodeData &&
      SimklEpisodeData.length > 0 &&
      rawLinks.length > 0
    ) {
      _mixer();
    }
    return () => {
      controller.abort();
    };
  }, [SimklEpisodeData, rawLinks]);
  useEffect(() => {
    if (database && database.source) {
      findTitles();
      timer.current = setTimeout(
        () => setError('Waited 12 seconds but did not obtain any results'),
        12000,
      );
    }
  }, [database]);

  if (!database || !database.link) return null;

  const source = new SourceBase(database.source);

  const findTitles = async () => {
    setIsLoading(true);
    source.scrapeAvailableEpisodes(database.link!).then((results) => {
      setIsLoading(false);
      setLinks(results);
    });
  };
  return {
    isLoading,
    data: fullData,
    error: hasError,
  };
}
