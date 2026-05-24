export type MediaFormat = 'MP4_1080P' | 'MP4_720P' | 'MP3_320K' | 'MP3_192K' | 'IMAGE_HD';

export interface MediaItem {
  id: string;
  type: 'video' | 'image' | 'audio' | 'carousel' | 'story';
  url: string; // Direct stream or proxy link
  thumbnailUrl: string;
  width?: number;
  height?: number;
  duration?: number; // for video/audio (in seconds)
  title?: string;
}

export interface CarouselItem {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl: string;
}

export interface InstagramMediaDetails {
  url: string;
  type: 'reel' | 'post' | 'carousel' | 'story' | 'audio';
  id: string;
  title: string;
  caption: string;
  author: {
    username: string;
    fullName: string;
    avatarUrl: string;
    isVerified: boolean;
    followersCount?: string;
  };
  metrics: {
    likes?: string;
    comments?: string;
    views?: string;
  };
  mediaItems: MediaItem[];
  carouselItems?: CarouselItem[];
  audioExtractUrl?: string; // Specific extracted MP3 stream
  durationText?: string;
  isFallbackGenerated?: boolean;
}

export interface DownloadHistoryItem {
  id: string;
  timestamp: number;
  url: string;
  title: string;
  username: string;
  avatarUrl: string;
  type: string;
  format: string;
  fileSize: string;
  thumbnailUrl: string;
}
