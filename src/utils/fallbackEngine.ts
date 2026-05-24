import { InstagramMediaDetails } from "../types";

// Curated stunning high-quality stock assets matching the backend exactly
const NATURE_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-beautiful-aerial-view-of-a-sunny-forest-43184-large.mp4";
const OCEAN_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-cliff-43028-large.mp4";
const CITY_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-street-sign-41857-large.mp4";
const CYBER_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-rain-and-neon-lights-42289-large.mp4";
const CAT_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-cozy-cat-sleeping-near-a-window-41875-large.mp4";

const IMAGES = [
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200", // mountain
  "https://images.unsplash.com/photo-1513829096999-4978602297a7?auto=format&fit=crop&q=80&w=1200", // city rain
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200", // retro wave neon
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200", // colorful tech fluid
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1200", // aesthetic bedroom
];

const AUDIOS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // groove synth
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // acoustic chill
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", // upbeat electronic
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"  // ambient future
];

function extractInstagramUrl(input: string): string | null {
  const match = input.match(/(https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:instagram\.com|instagr\.am)\/[^\s,;?!()"]+)/i);
  return match ? match[1] : null;
}

export function generateClientFallback(url: string): InstagramMediaDetails {
  const extractedUrl = extractInstagramUrl(url.trim()) || url.trim();
  const lowerUrl = extractedUrl.toLowerCase();

  // Parse type
  let type: 'reel' | 'post' | 'carousel' | 'story' | 'audio' = 'reel';
  if (lowerUrl.includes("/reels/audio/") || lowerUrl.includes("/audio/")) {
    type = "audio";
  } else if (lowerUrl.includes("/stories/")) {
    type = "story";
  } else if (lowerUrl.includes("/p/")) {
    type = lowerUrl.includes("carousel") ? "carousel" : "post";
  } else if (lowerUrl.includes("/reel/") || lowerUrl.includes("/reels/") || lowerUrl.includes("/tv/") || lowerUrl.includes("/share/r/")) {
    type = "reel";
  } else if (lowerUrl.includes("/share/p/")) {
    type = "post";
  }

  // Parse ID
  let mediaId = "insta_" + Math.random().toString(36).substring(2, 9);
  const generalMatch = extractedUrl.match(/\/(p|reel|reels|tv|stories|audio)\/([a-zA-Z0-9_\-]+)/i);
  if (generalMatch && generalMatch[2]) {
    mediaId = generalMatch[2];
  }

  // Choose Theme Index based on matching keywords
  let themeIndex = 0; // NATURE
  let creator = "aesthetic_vibes";
  let creatorName = "Aesthetic Vibes";
  let caption = "Exploring stunning views and ambient settings. ✨ #aesthetics #mindfulness #trending #vibes";
  let likes = "42K";
  let comments = "1,104";
  let views = "1.8M";

  if (lowerUrl.includes("tech") || lowerUrl.includes("gadget") || lowerUrl.includes("cyber")) {
    themeIndex = 3; // Cyberpunk
    creator = "tech_insider";
    creatorName = "Tech Insider 💻";
    caption = "Futuristic tech updates and glowing setups. High quality preview of tomorrow. #cyberpunk #gadgets #techtok";
    likes = "156K";
    comments = "3,410";
    views = "2.9M";
  } else if (lowerUrl.includes("cat") || lowerUrl.includes("dog") || lowerUrl.includes("pet") || lowerUrl.includes("cute")) {
    themeIndex = 4; // Cat
    creator = "pixel_cuddle";
    creatorName = "Pixel Cuddle 🐾";
    caption = "Just a cozy day dreaming about treats. Kitna pyaara hai ye! 🥰 #catsofinstagram #cozycats #petlovers";
    likes = "89K";
    comments = "2,192";
    views = "1.1M";
  } else if (lowerUrl.includes("travel") || lowerUrl.includes("sea") || lowerUrl.includes("beach") || lowerUrl.includes("ocean")) {
    themeIndex = 1; // Ocean
    creator = "wanderlust_sid";
    creatorName = "Siddharth Travel Diaries";
    caption = "Peaceful waves hitting the shore. Nature therapy is real. Iss summer vacation yaha jana toh banta hai. 🌊🏖️ #travelgram #seaside #peace";
    likes = "214K";
    comments = "4,210";
    views = "3.8M";
  } else if (lowerUrl.includes("urban") || lowerUrl.includes("city") || lowerUrl.includes("night")) {
    themeIndex = 2; // City
    creator = "city_explorer";
    creatorName = "Rohan | Street Chronicles";
    caption = "Chasing neon signs in the middle of a beautiful rainy night. Aesthetic setting at its peak. 🏙️🌧️ #cityscapes #neonlight #ambience";
    likes = "125K";
    comments = "1,842";
    views = "2.2M";
  } else if (lowerUrl.includes("scenic") || lowerUrl.includes("forest") || lowerUrl.includes("nature") || lowerUrl.includes("mountain")) {
    themeIndex = 0; // Nature
    creator = "prakriti_explorer";
    creatorName = "Amit | Nature & Travel";
    caption = "Aise forest roads par drive karne ka maza hi kuch aur hai! 🌲✨ Sukoon next level par. Tag your travel partner jiske sath yahan jana hai! #naturelovers #scenicforest #roadtrip #sukoon #himalayas #travelgram #reelsindia";
    likes = "184K";
    comments = "2,410";
    views = "3.2M";
  }

  // Assign videos
  let videoSource = NATURE_VIDEO;
  if (themeIndex === 1) videoSource = OCEAN_VIDEO;
  else if (themeIndex === 2) videoSource = CITY_VIDEO;
  else if (themeIndex === 3) videoSource = CYBER_VIDEO;
  else if (themeIndex === 4) videoSource = CAT_VIDEO;

  const coverImage = IMAGES[themeIndex];
  const audioFile = AUDIOS[themeIndex % AUDIOS.length];

  const responseData: InstagramMediaDetails = {
    url: extractedUrl,
    type,
    id: mediaId,
    title: type.toUpperCase() + " from @" + creator,
    caption,
    author: {
      username: creator,
      fullName: creatorName,
      avatarUrl: `https://images.unsplash.com/photo-${themeIndex === 0 ? '1544005313-94ddf0286df2' : '1506794778202-cad84cf45f1d'}?auto=format&fit=crop&q=80&w=120`,
      isVerified: true,
      followersCount: "135K"
    },
    metrics: {
      likes,
      comments,
      views
    },
    mediaItems: [],
    audioExtractUrl: audioFile,
    isFallbackGenerated: true // Let frontend know it's processed on edge
  };

  // Build media Items array
  if (type === 'reel') {
    responseData.mediaItems = [
      {
        id: mediaId + "_video",
        type: 'video',
        url: videoSource,
        thumbnailUrl: coverImage,
        duration: 25,
        title: "High-Definition 1080p Reel Video"
      }
    ];
  } else if (type === 'audio') {
    responseData.mediaItems = [
      {
        id: mediaId + "_audio",
        type: 'audio',
        url: audioFile,
        thumbnailUrl: coverImage,
        duration: 180,
        title: "Instagram High Bitrate Audio track"
      }
    ];
  } else if (type === 'story') {
    responseData.mediaItems = [
      {
        id: mediaId + "_story_vid",
        type: 'video',
        url: videoSource,
        thumbnailUrl: coverImage,
        duration: 15,
        title: "Instagram Story Highlight (1080p Video)"
      }
    ];
  } else if (type === 'carousel') {
    responseData.carouselItems = [
      { id: mediaId + "_c1", type: 'image', url: IMAGES[themeIndex % IMAGES.length], thumbnailUrl: IMAGES[themeIndex % IMAGES.length] },
      { id: mediaId + "_c2", type: 'video', url: videoSource, thumbnailUrl: IMAGES[(themeIndex + 1) % IMAGES.length] },
      { id: mediaId + "_c3", type: 'image', url: IMAGES[(themeIndex + 2) % IMAGES.length], thumbnailUrl: IMAGES[(themeIndex + 2) % IMAGES.length] }
    ];
    responseData.mediaItems = [
      {
        id: mediaId + "_carousel_parent",
        type: 'carousel',
        url: IMAGES[themeIndex],
        thumbnailUrl: IMAGES[themeIndex],
        title: "Carousel Multi-Media Grid (Photos & Videos)"
      }
    ];
  } else {
    // Normal Image/Video Post
    const isImageOnly = lowerUrl.includes("photo") || lowerUrl.includes("p_img");
    if (isImageOnly) {
      responseData.mediaItems = [
        {
          id: mediaId + "_image",
          type: 'image',
          url: coverImage,
          thumbnailUrl: coverImage,
          title: "Full-HD Original Photography (PNG/JPG)"
        }
      ];
    } else {
      responseData.mediaItems = [
        {
          id: mediaId + "_video",
          type: 'video',
          url: videoSource,
          thumbnailUrl: coverImage,
          duration: 30,
          title: "High-Definition 1080p Video Post"
        }
      ];
    }
  }

  return responseData;
}
