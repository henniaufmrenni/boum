const removeDuplicates = array => {
  return array.arr.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      array.arr.findIndex(obj => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
};

export default removeDuplicates;
