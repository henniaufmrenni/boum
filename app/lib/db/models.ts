// Audio with id
type singleItem = {
  id: string;
  parentId: string;
  fileLocation: string;
  imageLocation: string;
  metaData: string;
  status: string;
};

// Album | Playlist
type parentItem = {
  id: number;
  metaData: string;
};

export {singleItem, parentItem};
