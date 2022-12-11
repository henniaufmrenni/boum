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

type FavoriteAction = 'POST' | 'DELETE';
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
  NowPlayingQueue: Array<NowPlayingQueue>;
  PlayMethod: PlayMethod;
  PlaySessionId: string;
  PlaylistItemId: string;
  MediaSourceId: string;
  CanSeek: boolean;
  ItemId: string;
  EventName: 'timeupdate' | '';
}

interface NowPlayingQueue {
  Id: string;
  PlaylistItemId: string;
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
  DirectPlayProfiles: Array<PlayProfileBase>;
  TranscodingProfiles: Array<TranscodingPlayProfile>;
  ContainerProfiles: [];
  CodecProfiles: Array<CodecProfiles>;
  SubtitleProfiles: SubtitleProfiles;
  ResponseProfiles: Array<ResponseProfiles>;
}

interface PlayProfileBase {
  Container: string;
  Type: ItemTypes;
  VideoCodec: string;
  AudioCodec: string;
}

interface TranscodingPlayProfile extends PlayProfileBase {
  Context: 'Streaming';
  Protocol: 'hls';
  MaxAudioChannels: string;
  MinSegments: string;
  BreakOnNonKeyFrames: boolean;
}

interface SubtitleProfiles {
  Format: SubtitleFormat;
  Method: 'External';
}

interface CodecProfiles {
  Type: CodecProfilesType;
  Codec: string;
  Conditions: Array<CodecProfilesCondition>;
}

interface CodecProfilesCondition {
  Condition: string;
  Property: string;
  Value: string;
  IsRequired: false;
}

type CodecProfilesType = 'VideoAudio' | 'Video';

type SubtitleFormat = 'vtt' | 'ass' | 'ssa';

interface ResponseProfiles {
  Type: 'Video';
  Container: 'm4v';
  MimeType: 'video/mp4';
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

type ProgressUpdateType = 'Start' | 'Update' | 'Stop';

export type {
  FavoriteAction,
  Filters,
  ItemTypes,
  LibraryItemList,
  MediaItem,
  MediaType,
  PlaybackInfo,
  PlaybackInfoRequest,
  PlayMethod,
  ProgressUpdateBody,
  ProgressUpdateType,
  SortBy,
  SortOrder,
  VideoMediaItem,
  VideoPerson,
};
