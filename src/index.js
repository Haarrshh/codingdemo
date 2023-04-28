import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment/moment';

const parentHeight = Dimensions.get('screen').height;
const parentWidth = Dimensions.get('screen').width;

const App = () => {
  const BASE_URL = 'https://randomuser.me/api';
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const response = await fetch(`${BASE_URL}?page=${page}&results=5`);
    const result = await response.json();
    setData(result.results);
    setPage(result.info.page);
    setTotalPages(result.info.results);
    setIsLoading(false);
  };

  const getMore = async () => {
    setIsLoading(true);
    const response = await fetch(`${BASE_URL}?page=${page + 1}&results=5`);
    const result = await response.json();
    setData([...data, ...result.results]);
    setPage(result.info.page);
    setTotalPages(result.info.results);
    setIsLoading(false);
  };

  const renderItem = ({item}) => {
    const {
      dob: {date},
      login: {username},
      picture: {medium},
      email,
      name: {first, last, title},
      phone,
    } = item;

    return (
      <View style={styles.renderFlatList}>
        <View style={styles.imgView}>
          <Image source={{uri: medium}} style={styles.img} onLoadEnd={setImgLoading(false)}/>
          {imgLoading && loading()}
        </View>
        <View style={styles.userView}>
          <Text numberOfLines={2} style={styles.txtUserName}>
            {title} {first} {last}
          </Text>
          <Text  style={styles.txtEmail}>
            {email}
          </Text>
          <Text numberOfLines={2} style={styles.txtEmail}>
            {moment(date).format('DD/MM/YYYY')}
          </Text>
          <Text numberOfLines={2} style={styles.txtEmail}>
            {phone}
          </Text>
          <Text numberOfLines={2} style={styles.txtEmail}>
            {username}
          </Text>
        </View>
      </View>
    );
  };

  const loading = () => (
    <ActivityIndicator size="small" color="#0000ff" />
  )
  return (
    <View style={styles.parentContainer}>
      <View style={styles.innerView}>
        <Text style={styles.txtUserList}>User List</Text>
        <FlatList
          data={data}
          keyExtractor={e => e.login.uuid}
          renderItem={renderItem}
          ListFooterComponent={loading}
          onEndReachedThreshold={0.5}
          onEndReached={getMore}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    height: parentHeight,
    width: parentWidth,
    padding: 10,
  },
  innerView: {
    borderWidth: 1,
    borderColor: 'black',
    height: '100%',
    width: '100%',
  },
  txtUserList: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  renderFlatList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    minHeight: 150,
    borderWidth: 1,
    borderColor: 'black',
  },
  imgView: {
    width: '35%',
    marginLeft: 30,
    marginRight: 10,
  },
  img: {
    height: 110,
    width: 110,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  userView: {
    flexDirection: 'column',
    width: '65%',
  },
  txtUserName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    width:"90%",
  },
  txtEmail: {
    fontSize: 14,
    color: 'gray',
    flexWrap:'wrap',
    width:"90%",
    paddingVertical:2
  },
});

export default App;
