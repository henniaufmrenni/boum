import {NameId} from '@boum/types';

interface MediaItem {
  Album: string;
  AlbumId: string;
  Name: string;
  ServerId: string;
  Id: string;
  SortName: string;
  PremiereDate: string;
  ChannelId: string | null;
  RunTimeTicks: number;
  ProductionYear: number;
  IsFolder: boolean;
  Type: string;
  ParentBackdropItemId: string;
  ParentBackdropImageTags: Array<string>;
  UserData: UserData;
  PrimaryImageAspectRatio: number;
  Artists: Array<string>;
  ArtistsItems: Array<NameId>;
  AlbumArtist: string;
  AlbumArtists: Array<NameId>;
  ImageTags: Object;
  BackdropImageTags: Array<any>;
  ImageBlurHashes: Object;
  LocationType: string;
}

type LibraryItemList = {
  Items: Array<MediaItem>;
  StartIndex: number;
  TotalRecordCount: number;
};

type favoriteAction = 'POST' | 'DELETE';
type Filters = 'IsFavorite' | '';
type ItemTypes = 'Audio' | 'MusicAlbum' | 'Movie';
type MediaType = 'Album' | 'Song' | 'Playlist' | 'Folder';
type SortBy = 'SortName' | 'Random' | 'DateCreated' | 'PlayCount';
type SortOrder = 'Ascending' | 'Descending';

type UserData = {
  PlaybackPositionTicks: number;
  PlayCount: number;
  IsFavorite: boolean;
  Played: boolean;
  Key: string;
};

interface ProgressUpdateBody {
  VolumeLevel: 100;
  IsMuted: false;
  IsPaused: boolean;
  RepeatMode: 'RepeatNone';
  ShuffleMode: 'Sorted';
  MaxStreamingBitrate: number;
  PositionTicks: number;
  PlaybackRate: 1;
  SubtitleStreamIndex: 1;
  AudioStreamIndex: 1;
  BufferedRanges: Array<BufferedRanges>;
  PlayMethod: PlayMethod;
  PlaySessionId: string;
  PlaylistItemId: string;
  MediaSourceId: string;
  CanSeek: boolean;
  ItemId: string;
  EventName: 'timeupdate';
}

interface BufferedRanges {
  start: number;
  end: number;
}

type PlayMethod = 'Direct' | 'Transcode';

/*
 * Request data for /PlaybackInfo
 */
interface PlaybackInfoRequest {
  DeviceProfile: DeviceProfile;
}

interface DeviceProfile {
  MaxStreamingBitrate: number;
  MaxStaticBitrate: number;
  MusicStreamingTranscodingBitrate: number;
  DirectPlayProfiles: [
    {
      Container: 'webm';
      Type: 'Video';
      VideoCodec: 'vp8,vp9,av1';
      AudioCodec: 'vorbis,opus';
    },
    {
      Container: 'mp4,m4v';
      Type: 'Video';
      VideoCodec: 'h264,vp8,vp9,av1';
      AudioCodec: 'aac,mp3,opus,flac,alac,vorbis';
    },
  ];
  TranscodingProfiles: [
    {
      Container: 'ts';
      Type: 'Audio';
      AudioCodec: 'aac';
      Context: 'Streaming';
      Protocol: 'hls';
      MaxAudioChannels: '2';
      MinSegments: '2';
      BreakOnNonKeyFrames: true;
    },
  ];
  ContainerProfiles: [];
  CodecProfiles: [
    {
      Type: 'VideoAudio';
      Codec: 'aac';
      Conditions: [
        {
          Condition: 'Equals';
          Property: 'IsSecondaryAudio';
          Value: 'false';
          IsRequired: false;
        },
      ];
    },
    {
      Type: 'VideoAudio';
      Conditions: [
        {
          Condition: 'Equals';
          Property: 'IsSecondaryAudio';
          Value: 'false';
          IsRequired: false;
        },
      ];
    },
    {
      Type: 'Video';
      Codec: 'h264';
      Conditions: [
        {
          Condition: 'NotEquals';
          Property: 'IsAnamorphic';
          Value: 'true';
          IsRequired: false;
        },
        {
          Condition: 'EqualsAny';
          Property: 'VideoProfile';
          Value: 'high|main|baseline|constrained baseline';
          IsRequired: false;
        },
        {
          Condition: 'EqualsAny';
          Property: 'VideoRangeType';
          Value: 'SDR';
          IsRequired: false;
        },
        {
          Condition: 'LessThanEqual';
          Property: 'VideoLevel';
          Value: '52';
          IsRequired: false;
        },
        {
          Condition: 'NotEquals';
          Property: 'IsInterlaced';
          Value: 'true';
          IsRequired: false;
        },
      ];
    },
    {
      Type: 'Video';
      Codec: 'hevc';
      Conditions: [
        {
          Condition: 'NotEquals';
          Property: 'IsAnamorphic';
          Value: 'true';
          IsRequired: false;
        },
        {
          Condition: 'EqualsAny';
          Property: 'VideoProfile';
          Value: 'main';
          IsRequired: false;
        },
        {
          Condition: 'EqualsAny';
          Property: 'VideoRangeType';
          Value: 'SDR';
          IsRequired: false;
        },
        {
          Condition: 'LessThanEqual';
          Property: 'VideoLevel';
          Value: '120';
          IsRequired: false;
        },
        {
          Condition: 'NotEquals';
          Property: 'IsInterlaced';
          Value: 'true';
          IsRequired: false;
        },
      ];
    },
    {
      Type: 'Video';
      Codec: 'vp9';
      Conditions: [
        {
          Condition: 'EqualsAny';
          Property: 'VideoRangeType';
          Value: 'SDR|HDR10|HLG';
          IsRequired: false;
        },
      ];
    },
    {
      Type: 'Video';
      Codec: 'av1';
      Conditions: [
        {
          Condition: 'EqualsAny';
          Property: 'VideoRangeType';
          Value: 'SDR|HDR10|HLG';
          IsRequired: false;
        },
      ];
    },
  ];
  SubtitleProfiles: SubtitleProfiles;
  ResponseProfiles: Array<ResponseProfiles>;
}

interface PlayProfileBase {
  Container: string;
  Type: ItemTypes;
  VideoCodec: string;
  AudioCodec: string;
}

interface SubtitleProfiles {
  Format: SubtitleFormat;
  Method: 'External';
}

type SubtitleFormat = 'vtt' | 'ass' | 'ssa';

interface ResponseProfiles {
  Type: 'Video';
  Container: 'm4v';
  MimeType: 'video/mp4';
}

interface CodecProfiles {
  Type: 'VideoAudio';
  Codec: 'aac';
  Conditions: Array<CodecProfilesCondition>;
}
interface CodecProfilesCondition {
  Condition: 'Equals';
  Property: 'IsSecondaryAudio';
  Value: 'false';
  IsRequired: false;
}

/*
 * Response data from /PlaybackInfo
 */
interface PlaybackInfo {
  MediaSources: Array<MediaSources>;
  PlaySessionId: string;
}

interface MediaSources {
  Protocol: 'File';
  Id: string;
  Path: string;
  Type: string;
  Container: VideoContainer;
  Size: number;
  Name: string;
  IsRemote: boolean;
  ETag: string;
  RunTimeTicks: number;
  ReadAtNativeFramerate: boolean;
  IgnoreDts: boolean;
  IgnoreIndex: boolean;
  GenPtsInput: boolean;
  SupportsTranscoding: boolean;
  SupportsDirectStream: boolean;
  SupportsDirectPlay: boolean;
  IsInfiniteStream: boolean;
  RequiresOpening: boolean;
  RequiresClosing: boolean;
  RequiresLooping: boolean;
  SupportsProbing: boolean;
  VideoType: 'VideoFile';
  MediaStreams: Array<VideoStream | AudioStream | SubtitleStream>;
  MediaAttachments: [];
  Formats: [];
  Bitrate: number;
  RequiredHttpHeaders: {};
  TranscodingUrl: string;
  TranscodingSubProtocol: TranscodingSubProtocol;
  TranscodingContainer: TranscodingContainer;
  DefaultAudioStreamIndex: number;
  DefaultSubtitleStreamIndex: number;
}

interface VideoStream extends MediaStream {
  AspectRatio: string;
  AverageFrameRate: FrameRate;
  BitDepth: BitDepth;
  BitRate: number;
  ColorPrimaries: ColorSpace;
  ColorSpace: ColorSpace;
  ColorTransfer: ColorSpace;
  Height: number;
  IsAVC: boolean;
  IsInterlaced: boolean;
  NalLengthSize: string;
  PixelFormat: PixelFormat;
  Profile: TranscodingProfile;
  RealFrameRate: FrameRate;
  RefFrames: 1;
  VideoRange: VideoRange;
  Width: number;
  Type: 'Video';
}

interface AudioStream extends MediaStream {
  BitRate: number;
  ChannelLayout: string;
  Channels: number;
  SampleRate: number;
  Type: 'Audio';
}

interface SubtitleStream extends MediaStream {
  DeliveryMethod: string;
  DeliveryUrl: string;
  LocalizedDefault: string;
  LocalizedExternal: string;
  LocalizedForced: string;
  LocalizedUndefined: string;
  Type: 'Subtitle';
}

interface MediaStream {
  Codec: MediaCodec;
  DisplayTitle: string;
  Index: number;
  IsDefault: boolean;
  IsExternal: boolean;
  IsExternalUrl: boolean;
  IsForced: boolean;
  IsTextSubtitleStream: boolean;
  Language: string;
  Level: number;
  SupportsExternalStream: boolean;
  TimeBase: TimeBase;
  VideoRangeType: VideoRange;
}

type VideoContainer = 'webm' | 'mkv';

type TranscodingSubProtocol = 'hls';

type TranscodingContainer = 'ts';

type MediaCodec = AudioCodec | VideoCodec;

type AudioCodec =
  | 'eac3'
  | 'subrip'
  | 'aac'
  | 'ac3'
  | 'flac'
  | 'dts'
  | 'PCM_S16LE'
  | 'PCM_S24LE';

type VideoCodec = 'h264' | 'h265' | 'vp8' | 'vp9' | 'av1';

type ColorSpace = 'bt709' | 'bt470bg';

type TimeBase = '1/1000';

type VideoRange = 'SDR' | 'HDR';

type BitDepth = 8 | 10 | 12 | 16 | 24;

type FrameRate = 23.976025 | 24 | 25 | 30 | 59.940063;

type PixelFormat = 'yuv420p';

type TranscodingProfile = 'High';

interface VideoMediaItem extends MediaItem {
  People: Array<VideoPerson>;
  CriticRating?: number;
  CommunityRating?: number;
}

interface VideoPerson {
  Name: string;
  Id: string;
  Role: string;
  Type: string;
}

type progressUpdateType = 'Start' | 'Update' | 'Stop';

export type {
  favoriteAction,
  Filters,
  ItemTypes,
  MediaType,
  PlaybackInfo,
  PlayMethod,
  ProgressUpdateBody,
  SortBy,
  SortOrder,
  VideoMediaItem,
  progressUpdateType,
};
