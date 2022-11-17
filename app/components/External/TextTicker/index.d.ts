/*
MIT License

Copyright (c) 2018 Dean Hetherington

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/deanhet/react-native-text-ticker
*/

declare module 'react-native-text-ticker' {
  import React from 'react';
  import {StyleProp, TextProps, TextStyle, EasingFunction} from 'react-native';

  export interface TextTickerProps extends TextProps {
    duration?: number;
    onMarqueeComplete?: () => void;
    onScrollStart?: () => void;
    style?: StyleProp<TextStyle>;
    loop?: boolean;
    bounce?: boolean;
    scroll?: boolean;
    marqueeOnMount?: boolean;
    marqueeDelay?: number;
    bounceDelay?: number;
    isInteraction?: boolean;
    useNativeDriver?: boolean;
    repeatSpacer?: number;
    easing?: EasingFunction;
    animationType?: 'auto' | 'scroll' | 'bounce';
    scrollSpeed?: number;
    bounceSpeed?: number;
    shouldAnimateTreshold?: number;
    isRTL?: boolean;
    bouncePadding?: {
      left?: number;
      right?: number;
    };
    disabled?: boolean;
  }

  export interface TextTickerRef {
    startAnimation(): void;
    stopAnimation(): void;
  }

  export default class TextTicker extends React.Component<TextTickerProps> {}
}
