import {storeEncryptedValue} from '@boum/lib/encryptedStorage/encryptedStorage';

const useStoreEncryptedValue = async (key: string, value: string) => {
  storeEncryptedValue(key, value);
};

export default useStoreEncryptedValue;
export {useStoreEncryptedValue};
