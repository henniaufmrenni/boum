import AsyncStorage from '@react-native-async-storage/async-storage';

const storeAsyncData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return null;
  } catch (e) {
    console.log(e);
    return new Error(e);
  }
};

const readAsyncData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      throw 'No such key';
    }
  } catch (e) {
    throw e;
  }
};

export {storeAsyncData, readAsyncData};
