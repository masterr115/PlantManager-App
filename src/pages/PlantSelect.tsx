import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';


import { Header } from '../components/Header'
import { EnviromentButton } from '../components/EnviromentButton'
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import api from '../services/api';


interface EnviromentProps {
  key: string;
  title: string;
}

interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  }
}

export function PlantSelect() {
  const [Enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
  const [Plants, setPlants] = useState<PlantProps[]>([]);
  const [FilteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [EnviromentSelected, setEnviromentSelected] = useState('all');
  const [Loading, setLoading] = useState(true);

  const [Page, setPage] = useState(1)
  const [LoadingMore, setLoadingMore] = useState(false)
  const [LoadedAll, setLoadedAll] = useState(false)

  async function fetchPlants() {
    const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${Page}&_limit=8`)

    if(!data)
      return setLoading(true)

    if (Page > 1) {

      setPlants(oldValue => [...oldValue, ...data])
      setFilteredPlants(oldValue => [...oldValue, ...data])

    } else {

      setPlants(data)
      setFilteredPlants(data)

    }
    
    setLoading(false);
    setLoadingMore(false);
  }



  function handleFetchMore(distance: number) {

    if (distance < 1) 
      return;

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants();

  }

  function handleEnviromentSelected(enviroment: string) {
    setEnviromentSelected(enviroment);

    if (enviroment == 'all')
      return setFilteredPlants(Plants)

    const filtered = Plants.filter(plant => 
      plant.environments.includes(enviroment)
    )
    setFilteredPlants(filtered)

  }

  useEffect(() => {

    async function fetchEnviroment() {
      const { data } = await api.get('plants_environments?_sort=title&_order=asc')
      setEnviroments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...data
      ])
    }

    fetchEnviroment()

  }, [])

  useEffect(() => {

    fetchPlants()

  }, [])

  if (Loading)
    return <Load />
  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Header />

        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList 
          data={Enviroments} 
          renderItem={({ item }) => (
            <EnviromentButton 
              title={item.title}
              active={item.key === EnviromentSelected}
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.EnviromentList}
        />
      </View>
      
      <View style={styles.plants}>
        <FlatList 
          data={FilteredPlants} 
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => 
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
          LoadingMore 
          ? <ActivityIndicator color={colors.green} />
          : <></>
          }
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  header: {
    paddingHorizontal: 30
  },

  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },

  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },

  EnviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32
  },

  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  }

})