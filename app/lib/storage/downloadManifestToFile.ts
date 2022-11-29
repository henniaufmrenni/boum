import {FFmpegKit} from 'ffmpeg-kit-react-native';
import {path} from '@boum/lib/storage';

const downloadManifestToFile = (
  uri: string,
  name: string,
  downloadPath?: string,
) => {
  FFmpegKit.execute(`-i ${uri} -c:v copy -c:a copy ${downloadPath}`).then(
    async session => {
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        return {success: true, path: downloadDirPath};
      } else if (ReturnCode.isCancel(returnCode)) {
        return {success: false, path: ''};
      } else {
        return {success: false, path: ''};
      }
    },
  );
};

export {downloadManifestToFile};
