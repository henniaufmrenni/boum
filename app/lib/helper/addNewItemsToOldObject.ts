const addNewItemsToOldObject = (
  index: number,
  oldObject: any,
  newObject: any,
) => {
  if (index > 0 && oldObject) {
    const old = oldObject.Items;
    const fetched = newObject.Items;
    let newObj = oldObject;
    newObj['Items'] = old.concat(fetched);
    return newObj;
  } else {
    return newObject;
  }
};

export default addNewItemsToOldObject;
