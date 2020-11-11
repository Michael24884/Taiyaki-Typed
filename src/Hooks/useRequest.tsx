import {LayoutAnimation, Platform, UIManager} from 'react-native';
import useSwr, {ConfigInterface} from 'swr';

if (Platform.OS === 'android')
  if (UIManager.setLayoutAnimationEnabledExperimental)
    UIManager.setLayoutAnimationEnabledExperimental(true);

type RequestConfig = {
  animated: boolean;
};

const defaultConfigs: RequestConfig = {animated: true};

export function useAnilistRequest(
  path: string,
  requestConfig: RequestConfig = defaultConfigs,
) {
  const {animated} = requestConfig;
  const baseUrl = 'https://graphql.anilist.co';
  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  const fetcher = (graphql: string) => {
    const json = JSON.stringify(graphql);
    const headers = {
      'Content-Type': 'application/json',
    };
    fetch(baseUrl, {
      method: 'POST',
      body: json,
      headers,
      signal: controller.signal,
    });
  };
  const config: ConfigInterface = {
    refreshInterval: Platform.OS === 'android' ? 0 : 60 * 1000,
    onSuccess: () => {
      if (animated)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
  };
  return {
    swr: useSwr(path, fetcher, config),
    controller,
  };
}
