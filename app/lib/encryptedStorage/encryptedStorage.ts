import EncryptedStorage from 'react-native-encrypted-storage';

const storeEncryptedValue = async (key: string, value: string) => {
  try {
    await EncryptedStorage.setItem(key, value);
    console.log('Success storing encrypted value.');
  } catch (error) {
    console.log('Error storing encrypted value.');
    return new Error(error);
  }
};

const retrieveEncryptedValue = async (key: string) => {
  try {
    const session = await EncryptedStorage.getItem(key);
    if (session !== undefined) {
      return session;
    }
  } catch (error) {
    return new Error(error);
  }
};

const removeEncryptedValue = async (key: string) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};

const clearAllEncryptedValues = async () => {
  try {
    await EncryptedStorage.clear();
    return null;
  } catch (error) {
    return new Error(error);
  }
};

export {
  storeEncryptedValue,
  retrieveEncryptedValue,
  clearAllEncryptedValues,
  removeEncryptedValue,
};
