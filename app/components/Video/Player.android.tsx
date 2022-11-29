'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  PanResponder,
  ToastAndroid,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import Video, {VideoDecoderProperties} from 'react-native-video';
import {PlaybackInfo, Session, TextTracks} from '@boum/types';

import Icon from 'react-native-vector-icons/Ionicons';

import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  FadeOutUp,
  FadeOutDown,
} from 'react-native-reanimated';
import {colours} from '@boum/constants';
import {jellyfinClient} from '@boum/lib/api/jellyfinClient';

const width = Dimensions.get('window').width;

interface VideoPlayerProps {
  session: Session;
  playbackInfo: PlaybackInfo;
  sourceList: Array<object> | false;
  textTracks: TextTracks | false;
  bitrate: number;
  setBitrate: (bitrate: number) => void;
  setVideoProgress: (progress: number) => void;
  startTime: number;
}

class VideoPlayer extends Component<VideoPlayerProps> {
  state = {
    rate: 1,
    volume: 1,
    muted: false,
    resizeMode: 'contain',
    duration: 0.0,
    currentTime: this.props.startTime,
    videoWidth: 0,
    videoHeight: 0,
    paused: false,
    fullscreen: true,
    decoration: true,
    isLoading: false,
    seekerFillWidth: 0,
    seekerPosition: 0,
    seekerOffset: 0,
    seeking: false,
    audioTracks: [],
    textTracks: [],
    selectedAudioTrack: undefined,
    selectedTextTrack: undefined,
    srcList: [],
    srcListId: 0,
    loop: false,
    showRNVControls: false,
    selectedBitrate: 0,
    srcList: 0,
    playbackInfo: {},
    secondsPassedSinceProgressUpdate: 0,
  };

  jellyfin = new jellyfinClient();

  ws = new WebSocket(
    `${this.props.session.hostname
      .replace('http://', 'ws://')
      .replace('https://', 'wss://')}/socket?api_key=${
      this.props.session.accessToken
    }&deviceId=${this.props.deviceId}`,
  );

  srcList = this.props.sourceList;

  textTracks = this.props.textTracks;

  seekerWidth = 0;

  video: Video;
  seekPanResponder: PanResponder | undefined;

  popupInfo = () => {
    VideoDecoderProperties.getWidevineLevel().then((widevineLevel: number) => {
      VideoDecoderProperties.isHEVCSupported().then(
        (hevcSupported: boolean) => {
          VideoDecoderProperties.isCodecSupported('video/avc', 1920, 1080).then(
            (avcSupported: boolean) => {
              console.log(
                'Widevine level: ' +
                  widevineLevel +
                  '\n hevc: ' +
                  (hevcSupported ? '' : 'NOT') +
                  'supported' +
                  '\n avc: ' +
                  (avcSupported ? '' : 'NOT') +
                  'supported',
              );
              this.toast(
                true,
                'Widevine level: ' +
                  widevineLevel +
                  '\n hevc: ' +
                  (hevcSupported ? '' : 'NOT') +
                  'supported' +
                  '\n avc: ' +
                  (avcSupported ? '' : 'NOT') +
                  'supported',
              );
            },
          );
        },
      );
    });
  };

  onLoad = (data: any) => {
    this.setState({duration: data.duration, loading: false});
    this.onAudioTracks(data.audioTracks);
    this.onTextTracks(data.textTracks);
    this.setState({
      srcList: this.props.srcList,
    });
    this.setState({
      selectedBitrate: this.props.bitrate,
    });
    this.jellyfin.postProgressUpdate(
      this.props.session,
      {playableDuration: 10, currentTime: 0},
      this.state.paused,
      this.props.playbackInfo.PlaySessionId,
      //FIXME
      'Direct',
      this.props.bitrate,
      this.props.playbackInfo.MediaSources[0].Id,
      'Start',
    );

    this.ws.onmessage = e => {
      console.log(e.data);
    };
  };

  onProgress = (data: any) => {
    if (!this.state.seeking) {
      const position = this.calculateSeekerPosition();
      this.setSeekerPosition(position);
    }
    this.setState({currentTime: data.currentTime});
    this.props.setVideoProgress(data.currentTime);
    this.postProgress(data);
  };

  postProgress = data => {
    if (this.state.secondsPassedSinceProgressUpdate > 20) {
      this.ws.send(`{"MessageType":"KeepAlive"}`);

      this.jellyfin.postProgressUpdate(
        this.props.session,
        data,
        this.state.paused,
        this.props.playbackInfo.PlaySessionId,
        //FIXME
        'Direct',
        this.props.bitrate,
        this.props.playbackInfo.MediaSources[0].Id,
        'Update',
      );
      this.setState({
        secondsPassedSinceProgressUpdate: 0,
      });
    } else {
      this.setState({
        secondsPassedSinceProgressUpdate:
          this.state.secondsPassedSinceProgressUpdate + 1,
      });
    }
  };

  onVideoLoadStart = () => {
    this.setState({isLoading: true});
  };

  onAudioTracks = (data: any) => {
    this.setState({
      audioTracks: data,
    });

    const selectedTrack = data.audioTracks?.find((x: any) => {
      return x.selected;
    });

    if (selectedTrack?.index) {
      this.setState({
        selectedAudioTrack: {
          type: 'index',
          value: selectedTrack?.index,
        },
      });
    }
  };

  onTextTracks = (data: any) => {
    const selectedTrack = data.textTracks?.find((x: any) => {
      return x.selected;
    });

    this.setState({
      textTracks: data,
    });
    if (selectedTrack?.index) {
      this.setState({
        textTracks: data,
        selectedTextTrack: {
          type: 'language',
          value: selectedTrack?.language,
        },
      });
    }
  };

  onAspectRatio = (data: any) => {
    console.log('onAspectRadio called ' + JSON.stringify(data));
    this.setState({
      videoWidth: data.width,
      videoHeight: data.height,
    });
  };

  onVideoBuffer = (param: any) => {
    this.setState({isLoading: param.isBuffering});
  };

  onReadyForDisplay = () => {
    this.setState({isLoading: false});
  };

  onAudioBecomingNoisy = () => {
    this.setState({paused: true});
  };

  onAudioFocusChanged = (event: {hasAudioFocus: boolean}) => {
    this.setState({paused: !event.hasAudioFocus});
  };

  getCurrentTimePercentage = () => {
    if (this.state.currentTime > 0 && this.state.duration !== 0) {
      return this.state.currentTime / this.state.duration;
    }
    return 0;
  };

  renderRateControl(rate: number) {
    const isSelected = this.state.rate === rate;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({rate});
        }}>
        <Text
          style={[
            styles.controlOption,
            {fontWeight: isSelected ? 'bold' : 'normal'},
          ]}>
          {rate}
        </Text>
      </TouchableOpacity>
    );
  }

  toast = (visible: boolean, message: string) => {
    if (visible) {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return null;
    }
    return null;
  };

  onError = (err: any) => {
    console.log(JSON.stringify(err?.error.errorCode));
    this.toast(true, 'error: ' + err?.error.errorCode);
  };

  onEnd = () => {
    return;
    this.channelUp();
  };

  toggleFullscreen() {
    this.setState({fullscreen: !this.state.fullscreen});
  }
  toggleControls() {
    this.setState({showRNVControls: !this.state.showRNVControls});
  }

  toggleDecoration() {
    this.setState({decoration: !this.state.decoration});
    if (this.state.decoration) {
      this.video.dismissFullscreenPlayer();
    } else {
      this.video.presentFullscreenPlayer();
    }
  }

  goToChannel(channel: any) {
    this.setState({
      srcListId: channel,
      duration: 0.0,
      currentTime: 0.0,
      videoWidth: 0,
      videoHeight: 0,
      isLoading: false,
      audioTracks: [],
      textTracks: [],
      selectedAudioTrack: undefined,
      selectedTextTrack: undefined,
    });
  }

  padTo2Digits(number: number) {
    return number.toString().padStart(2, '0');
  }

  convertMsToHourMinutesSeconds(milliseconds: number) {
    let seconds = ~~(milliseconds / 1000);
    let minutes = ~~(seconds / 60);
    let hours = ~~(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(
      minutes,
    )}:${this.padTo2Digits(seconds)}`;
  }
  channelUp() {
    this.goToChannel((this.state.srcListId + 1) % this.props.sourceList.length);
  }

  channelDown() {
    this.goToChannel(
      (this.state.srcListId + this.srcList.length - 1) %
        this.props.sourceList.length,
    );
  }

  componentDidMount() {
    this.initSeekPanResponder();
  }

  renderInfoControl() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.popupInfo();
        }}>
        <Text style={[styles.controlOption]}>{'decoderInfo'}</Text>
      </TouchableOpacity>
    );
  }

  renderFullScreenControl() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.toggleFullscreen();
        }}>
        <Text style={[styles.controlOption]}>{'fullscreen'}</Text>
      </TouchableOpacity>
    );
  }

  renderBitratePicker() {
    return <VideoBitratePicker />;
  }

  renderSkipBack() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setSeekerPosition(this.state.currentTime - 15);
        }}>
        <Text>
          <Icon name="play-circle" size={40} color={colours.white} />
        </Text>
      </TouchableOpacity>
    );
  }

  renderPause() {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <TouchableOpacity
          onPress={() => {
            this.setState({paused: !this.state.paused});
          }}>
          <Text style={[styles.controlOption]}>
            {this.state.paused ? (
              <Text>
                <Icon name="ios-play" size={60} color={colours.white} />
              </Text>
            ) : (
              <Text>
                <Icon name="ios-pause" size={60} color={colours.white} />
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderSkipForward() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setSeekerPosition(this.state.currentTime + 15);
        }}>
        <Text>
          <Icon name="play-circle" size={40} color={colours.white} />
        </Text>
      </TouchableOpacity>
    );
  }

  renderLeftControl() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.channelDown();
          }}>
          <Text style={[styles.leftRightControlOption]}>{'ChDown'}</Text>
        </TouchableOpacity>
      </View>
      // onTimelineUpdated
    );
  }

  renderRightControl() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.channelUp();
          }}>
          <Text style={[styles.leftRightControlOption]}>{'ChUp'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Render the seekbar and attach its handlers
   */

  /**
   * Constrain the location of the seeker to the
   * min/max value based on how big the
   * seeker is.
   *
   * @param {float} val position of seeker handle in px
   * @return {float} constrained position of seeker handle in px
   */
  constrainToSeekerMinMax(val = 0) {
    if (val <= 0) {
      return 0;
    } else if (val >= this.seekerWidth) {
      return this.seekerWidth;
    }
    return val;
  }

  /**
   * Set the position of the seekbar's components
   * (both fill and handle) according to the
   * position supplied.
   *
   * @param {float} position position in px of seeker handle}
   */
  setSeekerPosition(position = 0) {
    const state = this.state;
    position = this.constrainToSeekerMinMax(position);

    state.seekerFillWidth = position;
    state.seekerPosition = position;

    if (!state.seeking) {
      state.seekerOffset = position;
    }

    this.setState(state);
  }

  /**
   * Calculate the position that the seeker should be
   * at along its track.
   *
   * @return {float} position of seeker handle in px based on currentTime
   */
  calculateSeekerPosition() {
    const percent = this.state.currentTime / this.state.duration;
    return this.seekerWidth * percent;
  }

  /**
   * Return the time that the video should be at
   * based on where the seeker handle is.
   *
   * @return {float} time in ms based on seekerPosition.
   */
  calculateTimeFromSeekerPosition() {
    const percent = this.state.seekerPosition / this.seekerWidth;
    return this.state.duration * percent;
  }

  /**
   * Get our seekbar responder going
   */
  initSeekPanResponder() {
    this.seekPanResponder = PanResponder.create({
      // Ask to be the responder.
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      /**
       * When we start the pan tell the machine that we're
       * seeking. This stops it from updating the seekbar
       * position in the onProgress listener.
       */
      onPanResponderGrant: (evt, gestureState) => {
        const state = this.state;
        // this.clearControlTimeout()
        const position = evt.nativeEvent.locationX;
        this.setSeekerPosition(position);
        state.seeking = true;
        this.setState(state);
      },

      /**
       * When panning, update the seekbar position, duh.
       */
      onPanResponderMove: (evt, gestureState) => {
        const position = this.state.seekerOffset + gestureState.dx;
        this.setSeekerPosition(position);
      },

      /**
       * On release we update the time and seek to it in the video.
       * If you seek to the end of the video we fire the
       * onEnd callback
       */
      onPanResponderRelease: (evt, gestureState) => {
        const time = this.calculateTimeFromSeekerPosition();
        const state = this.state;
        if (time >= state.duration && !state.isLoading) {
          state.paused = true;
          this.onEnd();
        } else {
          this.video?.seek(time);
          state.seeking = false;
        }
        this.setState(state);
      },
    });
  }

  renderSeekBar() {
    if (!this.seekPanResponder) {
      return null;
    }
    return (
      <View
        style={styles.seekbarContainer}
        {...this.seekPanResponder.panHandlers}
        {...styles.generalControls}>
        <View
          style={styles.seekbarTrack}
          onLayout={event =>
            (this.seekerWidth = event.nativeEvent.layout.width)
          }
          pointerEvents={'none'}>
          <View
            style={[
              styles.seekbarFill,
              {
                width:
                  this.state.seekerFillWidth > 0
                    ? this.state.seekerFillWidth
                    : 0,
                backgroundColor: '#FFF',
              },
            ]}
            pointerEvents={'none'}
          />
        </View>
        <View
          style={[
            styles.seekbarHandle,
            {
              left:
                this.state.seekerPosition > 0 ? this.state.seekerPosition : 0,
            },
          ]}
          pointerEvents={'none'}>
          <View
            style={[styles.seekbarCircle, {backgroundColor: '#FFF'}]}
            pointerEvents={'none'}
          />
        </View>
      </View>
    );
  }

  IndicatorLoadingView() {
    if (this.state.isLoading)
      return (
        <ActivityIndicator
          color="#3235fd"
          size="large"
          style={styles.IndicatorStyle}
        />
      );
    else return <View />;
  }

  renderTopControl() {
    return (
      <>
        <Text style={[styles.controlOption]}>
          {this.srcList[this.state.srcListId]?.description || 'local file'}
        </Text>
        <View></View>
      </>
    );
  }

  renderOverlay() {
    return (
      <>
        {!this.state.showRNVControls ? (
          <>
            {this.IndicatorLoadingView()}
            <Animated.View
              style={[
                styles.topControls,
                {backgroundColor: 'rgba(10, 10, 10, 0.5)'},
              ]}
              entering={FadeInUp}
              exiting={FadeOutUp}>
              <View style={styles.resizeModeControl}>
                {this.renderTopControl()}
              </View>
              <View style={[styles.generalControls]}>
                {this.state.audioTracks?.length <= 1 ? null : (
                  <>
                    <Text style={styles.controlOption}>Audio</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={this.state.selectedAudioTrack?.value}
                      onValueChange={(itemValue, itemIndex) => {
                        console.log('on audio value change ' + itemValue);
                        this.setState({
                          selectedAudioTrack: {
                            type: 'index',
                            value: itemIndex,
                          },
                        });
                      }}>
                      {this.state.audioTracks.map(track => {
                        return (
                          <Picker.Item
                            label={track.language}
                            value={track.language}
                            key={track.language}
                          />
                        );
                      })}
                    </Picker>
                  </>
                )}
                {this.state.textTracks?.length >= 1 ? (
                  <>
                    <Text style={styles.controlOption}>Subtitles</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={this.state.selectedTextTrack?.value}
                      onValueChange={(itemValue, itemIndex) => {
                        console.log('on value change ' + itemValue);
                        this.setState({
                          selectedTextTrack: {
                            type: 'language',
                            value: itemValue,
                          },
                        });
                      }}>
                      <Picker.Item label={'none'} value={'none'} key={'none'} />
                      {this.state.textTracks.map(track => (
                        <Picker.Item
                          label={track.language}
                          value={track.language}
                          key={track.title}
                        />
                      ))}
                    </Picker>
                  </>
                ) : null}
                <Text style={styles.controlOption}>Quality</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={this.props.bitrate}
                  onValueChange={itemValue => {
                    this.props.setBitrate(itemValue);
                    console.log(
                      'on value change ' + this.props.bitrate,
                      this.props.playbackInfo.MediaSources[0].TranscodingUrl,
                    );
                  }}>
                  <Picker.Item label={'Direct'} value={100000000} />
                  <Picker.Item label={'20 mbp/s'} value={20000000} />
                  <Picker.Item label={'15 mbp/s'} value={15000000} />
                  <Picker.Item label={'10 mbp/s'} value={10000000} />
                  <Picker.Item label={'6 mbp/s'} value={6000000} />
                  <Picker.Item label={'3 mbp/s'} value={3000000} />
                  <Picker.Item label={'1 mbp/s'} value={1000000} />
                </Picker>
              </View>
            </Animated.View>
            {this.renderPause()}
            <Animated.View
              style={styles.bottomControls}
              entering={FadeInDown}
              exiting={FadeOutDown}>
              <View style={styles.seekBarAndTime}>
                <Text style={[styles.controlOption, {paddingRight: 20}]}>
                  {this.convertMsToHourMinutesSeconds(
                    this.state.currentTime * 1000,
                  )}
                </Text>
                {this.renderSeekBar()}
                <Text style={[styles.controlOption, {paddingLeft: 20}]}>
                  {this.convertMsToHourMinutesSeconds(
                    this.props.playbackInfo.MediaSources[0]?.RunTimeTicks /
                      10000,
                  )}
                </Text>
              </View>
            </Animated.View>
          </>
        ) : null}
      </>
    );
  }

  renderVideoView() {
    const viewStyle = this.state.fullscreen
      ? styles.fullScreen
      : styles.halfScreen;
    return (
      <TouchableWithoutFeedback
        style={viewStyle}
        onPress={() => {
          this.toggleControls();
        }}>
        <Video
          ref={(ref: Video) => {
            this.video = ref;
          }}
          poster={`${this.props.session.hostname}/Items/${this.props.playbackInfo.MediaSources[0].Id}/Images/Backdrop?fillHeight=600&fillWidth=400&quality=96`}
          source={this.srcList[this.state.srcListId]}
          style={viewStyle}
          rate={this.state.rate}
          paused={this.state.paused}
          volume={this.state.volume}
          muted={this.state.muted}
          fullscreen={this.state.fullscreen}
          controls={false}
          resizeMode={this.state.resizeMode}
          onLoad={this.onLoad}
          onProgress={this.onProgress}
          onEnd={this.onEnd}
          progressUpdateInterval={1000}
          onError={this.onError}
          onAudioBecomingNoisy={this.onAudioBecomingNoisy}
          onAudioFocusChanged={this.onAudioFocusChanged}
          onLoadStart={this.onVideoLoadStart}
          onVideoAspectRatio={this.onAspectRatio}
          onReadyForDisplay={this.onReadyForDisplay}
          onBuffer={this.onVideoBuffer}
          repeat={this.state.loop}
          selectedTextTrack={this.state.selectedTextTrack}
          selectedAudioTrack={this.state.selectedAudioTrack}
          subtitleStyle={{fontSize: 20}}
          useTextureView={false}
          textTracks={this.textTracks}
        />
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.srcList[this.state.srcListId]?.noView
          ? null
          : this.renderVideoView()}
        {this.renderOverlay()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  halfScreen: {
    position: 'absolute',
    top: 50,
    left: 50,
    bottom: 100,
    right: 100,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bottomControls: {
    backgroundColor: 'rgba(10, 10, 10, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  leftControls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 20,
  },
  rightControls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    top: 20,
    bottom: 20,
    right: 20,
  },
  topControls: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftRightControlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    padding: 10,
    lineHeight: 12,
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    fontFamily: 'Inter-Bold',
    paddingLeft: 2,
    paddingRight: 2,
  },
  IndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  seekbarAnchor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'red',
  },
  seekbarContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    height: 30,
  },
  seekbarTrack: {
    backgroundColor: '#333',
    height: 4,
    position: 'relative',
    top: 14,
    width: '100%',
  },
  seekbarFill: {
    backgroundColor: '#FFF',
    height: 4,
    width: '100%',
  },
  seekbarHandle: {
    position: 'absolute',
    marginLeft: -10,
    height: 28,
    width: 28,
  },
  seekbarCircle: {
    borderRadius: 12,
    position: 'relative',
    top: 10,
    left: 10,
    height: 12,
    width: 12,
  },
  picker: {
    backgroundColor: 'transparent',
    maxWidth: 200,
    width: 200,
    color: colours.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seekBarAndTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyItems: 'center',
  },
});

export {VideoPlayer};
