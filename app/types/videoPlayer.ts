type NameId = {
  Name: string;
  Id: string;
};

/*
 * https://github.com/react-native-video/react-native-video/blob/master/API.md#texttracks
 */
interface TextTracks {
  title: string;
  language: string;
  type: TextTrackType;
  uri: string;
}

type TextTrackType = 'application/x-subrip' | 'text/vtt' | 'text/plain';

export type {NameId, TextTracks, TextTrackType};
