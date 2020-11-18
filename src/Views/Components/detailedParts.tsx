/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {SourceBase} from '../../Classes/SourceBase';
import {
  TaiyakiArchiveModel,
  TaiyakiScrapedTitleModel,
} from '../../Models/taiyaki';
import {useTheme} from '../../Stores';
import {ThemedButton, ThemedText} from './base';
import {ListRow} from './list_rows';

const {height} = Dimensions.get('window');

interface Props {
  route: {
    params: {title: string; id: number};
  };
}

const SearchBindPage: FC<Props> = (props) => {
  const {title, id} = props.route.params;
  const navigation = useNavigation();
  const [archives, setArchives] = useState<TaiyakiArchiveModel[]>([]);
  const theme = useTheme((_) => _.theme);
  //   const [query, setQuery] = useState<string>(title);
  const query = useRef<string>(title);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [currentArchive, setCurrentArchive] = useState<TaiyakiArchiveModel>();

  const [results, setResults] = useState<TaiyakiScrapedTitleModel[]>([]);

  useEffect(() => {
    navigation.setOptions({title: 'Binding Anime...'});
  }, [navigation]);

  const getItems = useCallback(async () => {
    const file = await AsyncStorage.getItem('my_sources');
    if (file) {
      const archives = JSON.parse(file) as TaiyakiArchiveModel[];
      setArchives(archives);
      setCurrentArchive(archives[0]);
      setLoading(true);
      new SourceBase(archives[0]).scrapeTitle(query.current).then((results) => {
        setResults(results.results);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    getItems();
  }, [getItems]);

  if (archives.length === 0)
    return (
      <View
        style={[
          styles.bindPage.view,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Icon
          name={'newspaper'}
          type={'MaterialCommunityIcons'}
          size={50}
          color="grey"
        />
        <ThemedText
          style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
          No sources installed. You can install them in the Settings
        </ThemedText>
        <ThemedButton
          title={'Open Settings'}
          onPress={() => {
            navigation.goBack();
            navigation.navigate('Settings', {screen: 'ArchivePage'});
          }}
        />
      </View>
    );

  const source = new SourceBase(archives[0]);
  const _findTitles = async () => {
    setLoading(true);
    source
      .scrapeTitle(query.current)
      .then((results) => {
        setResults(results.results);
        setLoading(results.loading);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const _renderItem = ({item}: {item: TaiyakiScrapedTitleModel}) => {
    return (
      <ListRow
        image={item.image}
        title={item.title}
        onPress={async () => {
          await AsyncStorage.mergeItem(
            id.toString(),
            JSON.stringify({link: item.embedLink, source: currentArchive!}),
          );
          console.log(item);
          navigation.navigate('Detail', {embedLink: item.embedLink});
        }}
      />
    );
  };

  return (
    <View style={styles.bindPage.view}>
      <ThemedText style={styles.bindPage.text}>
        This page allows you to bind an anime with a third party source. If
        Taiyaki can't find an anime you can use a custom search title
      </ThemedText>
      <TextInput
        style={[
          styles.bindPage.input,
          {backgroundColor: theme.colors.card, color: theme.colors.text},
        ]}
        autoCapitalize={'none'}
        autoCorrect={false}
        autoCompleteType="off"
        placeholder={'Use a custom search'}
        value={query.current}
        onChangeText={(value) => (query.current = value)}
        onSubmitEditing={_findTitles}
      />
      <ThemedText style={styles.bindPage.sourceName}>
        Current source: {source.source.name}
      </ThemedText>
      {isLoading ? (
        <View
          style={[
            styles.bindPage.view,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <ActivityIndicator />
          <ThemedText style={styles.bindPage.emptyResultsText}>
            Looking for title...
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.embedLink}
          renderItem={_renderItem}
          ListEmptyComponent={
            <View
              style={[
                styles.bindPage.view,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: height * 0.2,
                },
              ]}>
              <Icon
                name={'error'}
                type={'MaterialIcons'}
                size={50}
                color={'red'}
              />
              <ThemedText style={styles.bindPage.emptyResultsText}>
                No results
              </ThemedText>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = {
  bindPage: StyleSheet.create({
    view: {
      flex: 1,
    },
    text: {
      fontSize: 15,
      fontWeight: '600',
      margin: 8,
    },
    input: {
      height: height * 0.05,
      width: '90%',
      alignSelf: 'center',
      marginTop: 5,
      borderRadius: 6,
    },
    emptyResultsText: {
      fontSize: 21,
      fontWeight: '400',
    },
    sourceName: {
      textAlign: 'center',
      marginTop: height * 0.015,
      fontSize: 17,
      fontWeight: '600',
    },
  }),
};

export default SearchBindPage;
