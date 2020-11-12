// import React, {FC, useEffect, useState} from 'react';
// import {ActivityIndicator, FlatList, LogBox, StyleSheet} from 'react-native';
// import {useInifiniteAnilistRequest} from '../../Hooks';
// import {
//   AnilistPagedData,
//   AnilistRequestTypes,
//   Media,
// } from '../../Models/Anilist';
// import {ListRow, ThemedSurface} from '../Components';

// interface Props {
//   route: {params: {key: AnilistRequestTypes; path: string}};
// }

// LogBox.ignoreLogs(['Encountered two']);

// const MoreItemsScreen: FC<Props> = (props) => {
//   const {key, path} = props.route.params;
//   const [page, setPageNumber] = useState<number>(0);
//   const {
//     query: {data, isLoading, fetchMore},
//   } = useInifiniteAnilistRequest<{
//     data: {
//       Page: {
//         pageInfo: {currentPage: number; hasNextPage: boolean};
//         media: Media[];
//       };
//     };
//   }[]>(key);

//   const renderItem = ({item}: {item: Media}) => {
//     return (
//       <ListRow image={item.coverImage.extraLarge} title={item.title.romaji} />
//     );
//   };

//   useEffect(() => {
//     fetchMore(page);
//   }, [page]);

//   if (!data || isLoading)
//     return (
//       <ThemedSurface style={styles.empty.view}>
//         <ActivityIndicator />
//       </ThemedSurface>
//     );

//   console.log(data, 'any data?');
//   const list: Media[] = ([] as Media[]).concat.apply(
//     [],
//     Array.isArray(data)
//       ? data.map((group) => {
//           if (!group) return {} as Media;
//           return group?.data?.Page?.media ?? [];
//         })
//       : data.data.Page.media,
//   );

//   const onEnd = () => setPageNumber((page) => page + 1);

//   return (
//     <FlatList
//       data={list}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id.toString()}
//       onEndReached={onEnd}
//       onEndReachedThreshold={0.25}
//     />
//   );
// };

// const styles = {
//   empty: StyleSheet.create({
//     view: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//   }),
// };

// export default MoreItemsScreen;
