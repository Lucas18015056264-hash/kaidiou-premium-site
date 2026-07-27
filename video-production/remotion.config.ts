import { Config } from '@remotion/cli/config';

Config.setPublicDir('public');
Config.setOverwriteOutput(true);
Config.setVideoImageFormat('jpeg');
Config.setStillImageFormat('png');
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setConcurrency(4);
