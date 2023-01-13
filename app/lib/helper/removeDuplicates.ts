const removeDuplicates = (array: Array<any>) => {
  return array.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      array.findIndex(obj => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
};

export default removeDuplicates;
