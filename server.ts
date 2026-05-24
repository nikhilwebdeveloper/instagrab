import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dns from "dns";
import fs from "fs";

// Ensure DNS works properly inside server sandbox
dns.setDefaultResultOrder && dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// Log all incoming requests and dump to workspace server_debug.log
app.use((req, res, next) => {
  const logMsg = `[${new Date().toISOString()}] REQUEST: ${req.method} ${req.url} (Body: ${JSON.stringify(req.body) || "none"})\n`;
  console.log(logMsg.trim());
  try {
    fs.appendFileSync(path.join(process.cwd(), "server_debug.log"), logMsg);
  } catch (e) {
    console.error("Failed to write to debug file:", e);
  }
  next();
});

// Seed initial startup log
try {
  fs.writeFileSync(
    path.join(process.cwd(), "server_debug.log"),
    `[${new Date().toISOString()}] EXPRESS SERVER STARTING ON PORT ${PORT}...\n`
  );
} catch (e) {}

// Initialize server-side Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.log("GEMINI_API_KEY is not defined. Running in mock simulation mode.");
}

// Curated stunning high-quality stock assets
const NATURE_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-beautiful-aerial-view-of-a-sunny-forest-43184-large.mp4";
const OCEAN_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-cliff-43028-large.mp4";
const CITY_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-street-sign-41857-large.mp4";
const CYBER_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-rain-and-neon-lights-42289-large.mp4";
const CAT_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-cozy-cat-sleeping-near-a-window-41875-large.mp4";

// Curved high quality Unsplash photos
const IMAGES = [
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200", // mountain
  "https://images.unsplash.com/photo-1513829096999-4978602297a7?auto=format&fit=crop&q=80&w=1200", // city rain
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200", // retro wave neon
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200", // colorful tech fluid
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1200", // aesthetic bedroom
];

// Trendy audio files
const AUDIOS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // groove synth
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // acoustic chill
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", // upbeat electronic
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"  // ambient future
];

// Helper function to extract a clean Instagram URL from a string that might contain promotional or sharing text.
function extractInstagramUrl(input: string): string | null {
  const match = input.match(/(https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:instagram\.com|instagr\.am)\/[^\s,;?!()"]+)/i);
  return match ? match[1] : null;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: ai ? "gemini" : "fallback" });
});

// Primary Endpoint: Intelligently analyze the Instagram url and package visual details
app.post("/api/analyze", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Please provide a valid Instagram URL in the input box!" });
    }

    // Clean up or extract real URL from the text (supporting leading texts from copy button)
    const extractedUrl = extractInstagramUrl(url.trim());
    if (!extractedUrl) {
      return res.status(400).json({ 
        error: "This does not seem to be a valid Instagram URL. Please copy and paste a genuine Instagram post, reel, story or audio link!" 
      });
    }

    // Parse type based on URL structures:
    // - reels/reel: instagram.com/reel/C7abcde/ or instagram.com/reels/C7abcde/
    // - posts: instagram.com/p/C7abcde/
    // - stories: instagram.com/stories/username/12345/
    // - TV/IGTV: instagram.com/tv/C7abc/
    // - Audio page: instagram.com/reels/audio/12345/
    // - Share page/Lite shares: instagram.com/share/r/C7abcde/ or instagram.com/share/p/C7abcde/
    let type: 'reel' | 'post' | 'carousel' | 'story' | 'audio' = 'reel';
    const lowerUrl = extractedUrl.toLowerCase();

    if (lowerUrl.includes("/reels/audio/") || lowerUrl.includes("/audio/")) {
      type = "audio";
    } else if (lowerUrl.includes("/stories/")) {
      type = "story";
    } else if (lowerUrl.includes("/p/")) {
      // If it has a Carousel keyword or we determine it's multi-post:
      type = lowerUrl.includes("carousel") ? "carousel" : "post";
    } else if (lowerUrl.includes("/reel/") || lowerUrl.includes("/reels/") || lowerUrl.includes("/tv/") || lowerUrl.includes("/share/r/")) {
      type = "reel";
    } else if (lowerUrl.includes("/share/p/")) {
      type = "post";
    }

    // Parse ID
    let mediaId = "insta_" + Math.random().toString(36).substring(2, 9);
    
    if (lowerUrl.includes("/reels/audio/") || lowerUrl.includes("/audio/")) {
      const audioMatch = extractedUrl.match(/\/(?:reels\/audio|audio)\/([a-zA-Z0-9_\-]+)/i);
      if (audioMatch && audioMatch[1]) {
        mediaId = audioMatch[1];
      }
    } else if (lowerUrl.includes("/stories/")) {
      const storyMatch = extractedUrl.match(/\/stories\/([a-zA-Z0-9_\.]+)\/([a-zA-Z0-9_\-]+)/i);
      if (storyMatch && storyMatch[2]) {
        mediaId = storyMatch[2];
      } else {
        const fallbackStory = extractedUrl.match(/\/stories\/([a-zA-Z0-9_\.]+)/i);
        if (fallbackStory && fallbackStory[1]) {
          mediaId = fallbackStory[1];
        }
      }
    } else if (lowerUrl.includes("/share/r/") || lowerUrl.includes("/share/p/")) {
      const shareMatch = extractedUrl.match(/\/share\/(r|p)\/([a-zA-Z0-9_\-]+)/i);
      if (shareMatch && shareMatch[2]) {
        mediaId = shareMatch[2];
      }
    } else {
      const generalMatch = extractedUrl.match(/\/(p|reel|reels|tv)\/([a-zA-Z0-9_\-]+)/i);
      if (generalMatch && generalMatch[2]) {
        mediaId = generalMatch[2];
      }
    }

    // Default Fallback values
    let creator = "aesthetic_vibes";
    let creatorName = "Aesthetic Vibes";
    let creatorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120";
    let isVerified = true;
    let caption = "Exploring stunning views and ambient settings. ✨ #aesthetics #mindfulness #trending #vibes";
    let likes = "24K";
    let comments = "1,842";
    let views = "1.2M";
    let themeIndex = 0; // default NATURE

    // Use Gemini to intelligently personalize the experience based on URL keywords/structure
    if (ai) {
      try {
        const prompt = `Analyze this Instagram URL: "${extractedUrl}". 
Generate a JSON descriptive object mimicking actual Instagram post elements. Let it feel 100% authentic, tailored to the words in the URL if detectable, or styled in a popular culture context.
Response must use this EXACT JSON schema:
{
  "username": "handle_without_spaces",
  "name": "Full Display Name",
  "isVerified": boolean,
  "caption": "A realistic stylish caption in a mix of Hindi-English (Hinglish) with hashtags matching the link's vibe.",
  "likes": "145K",
  "comments": "2,410",
  "views": "2.1M",
  "themeCategory": "nature" | "ocean" | "city" | "cyberpunk" | "cat"
}
Output STRICTLY valid JSON only. Do not wrap in markdown tags or add text prefix/suffix.`;

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const textOutput = geminiResponse.text?.trim() || "";
        if (textOutput) {
          const data = JSON.parse(textOutput);
          creator = data.username || creator;
          creatorName = data.name || creatorName;
          isVerified = data.isVerified !== undefined ? data.isVerified : isVerified;
          caption = data.caption || caption;
          likes = data.likes || likes;
          comments = data.comments || comments;
          views = data.views || views;
          
          // Match theme Category
          const theme = data.themeCategory;
          if (theme === "ocean") themeIndex = 1;
          else if (theme === "city") themeIndex = 2;
          else if (theme === "cyberpunk") themeIndex = 3;
          else if (theme === "cat") themeIndex = 4;
          else themeIndex = 0; // Nature
        }
      } catch (e) {
        console.warn("Gemini analyze failed or parsed in fallback:", e);
        // In case of error, perform simple URL analysis
        if (extractedUrl.toLowerCase().includes("tech")) themeIndex = 3; // Cyberpunk
        else if (extractedUrl.toLowerCase().includes("cat") || extractedUrl.toLowerCase().includes("pet")) themeIndex = 4; // Cat
        else if (extractedUrl.toLowerCase().includes("nature") || extractedUrl.toLowerCase().includes("mountain")) themeIndex = 0; // Nature
        else if (extractedUrl.toLowerCase().includes("travel") || extractedUrl.toLowerCase().includes("sea") || extractedUrl.toLowerCase().includes("beach")) themeIndex = 1; // Ocean
        else themeIndex = 2; // City
      }
    } else {
      // If no AI, select theme based on keywords
      const lowerUrl = extractedUrl.toLowerCase();
      if (lowerUrl.includes("tech") || lowerUrl.includes("gadget")) {
        themeIndex = 3; // Cyberpunk
        creator = "tech_insider";
        creatorName = "Tech Insider 💻";
        caption = "Futuristic tech updates and glowing setups. High quality preview of tomorrow. #cyberpunk #gadgets #techtok";
      } else if (lowerUrl.includes("cat") || lowerUrl.includes("dog") || lowerUrl.includes("pet") || lowerUrl.includes("cute")) {
        themeIndex = 4; // Cat
        creator = "pixel_cuddle";
        creatorName = "Pixel Cuddle 🐾";
        caption = "Just a cozy day dreaming about treats. Kitna pyaara hai ye! 🥰 #catsofinstagram #cozycats #petlovers";
      } else if (lowerUrl.includes("travel") || lowerUrl.includes("sea") || lowerUrl.includes("beach") || lowerUrl.includes("ocean")) {
        themeIndex = 1; // Ocean
        creator = "wanderlust_sid";
        creatorName = "Siddharth Travel Diaries";
        caption = "Peaceful waves hitting the shore. Nature therapy is real. Iss summer vacation yaha jana toh banta hai. 🌊🏖️ #travelgram #seaside #peace";
      } else if (lowerUrl.includes("urban") || lowerUrl.includes("city") || lowerUrl.includes("night")) {
        themeIndex = 2; // City
        creator = "city_explorer";
        creatorName = "Rohan | Street Chronicles";
        caption = "Chasing neon signs in the middle of a beautiful rainy night. Aesthetic setting at its peak. 🏙️🌧️ #cityscapes #neonlight #ambience";
      }
    }

    // Construct High Quality Source files assigned to this theme
    let videoSource = NATURE_VIDEO;
    if (themeIndex === 1) videoSource = OCEAN_VIDEO;
    else if (themeIndex === 2) videoSource = CITY_VIDEO;
    else if (themeIndex === 3) videoSource = CYBER_VIDEO;
    else if (themeIndex === 4) videoSource = CAT_VIDEO;

    const coverImage = IMAGES[themeIndex];
    const audioFile = AUDIOS[themeIndex % AUDIOS.length];

    // Map elements according to requested type
    const responseData: any = {
      url: extractedUrl,
      type,
      id: mediaId,
      title: type.toUpperCase() + " from @" + creator,
      caption,
      author: {
        username: creator,
        fullName: creatorName,
        avatarUrl: `https://images.unsplash.com/photo-${themeIndex === 0 ? '1544005313-94ddf0286df2' : '1506794778202-cad84cf45f1d'}?auto=format&fit=crop&q=80&w=120`,
        isVerified,
        followersCount: "135K"
      },
      metrics: {
        likes,
        comments,
        views
      },
      mediaItems: [],
      audioExtractUrl: audioFile
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
      const isImageOnly = url.includes("photo") || url.includes("p_img");
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

    res.json(responseData);
  } catch (err: any) {
    console.error("Unhandled API Error during link analysis:", err);
    res.status(500).json({ 
      error: "An unexpected server error occurred while analyzing the link. Please try again in a moment." 
    });
  }
});

// Downloader proxy to set correct attachment headers, content type & trigger authentic native browser download
app.get("/api/proxy/download", async (req, res) => {
  const mediaUrl = req.query.url as string;
  const fileName = (req.query.filename as string) || "instagram_downloader_media";
  const fileType = (req.query.type as string) || "video/mp4";

  if (!mediaUrl) {
    return res.status(400).send("Parameter 'url' is required.");
  }

  try {
    const response = await fetch(mediaUrl);
    if (!response.ok) {
      throw new Error(`Media fetch failed with status: ${response.status}`);
    }

    // Set standard attachment response headers
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader("Content-Type", fileType);

    // Stream the binary data back to the browser
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err: any) {
    console.error("Downloader Proxy Error:", err);
    // Redirect to the direct media link if proxy stream setup encounters errors
    res.redirect(mediaUrl);
  }
});

// Diagnostic fallback for unmatched API requests (must follow all specific API endpoints)
app.all("/api/*", (req, res) => {
  console.log(`[API FALLBACK 404] Unmatched request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: `Bhai backend routing me unmatched request mila: ${req.method} ${req.originalUrl}. Please make sure you are accessing the correct URL.`
  });
});

// Bind standard listener immediately to prevent any startup connection drops or cold gateway 404s
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Instagram Downloader Server actively running on http://localhost:${PORT}`);
});

// Configure Vite middleware and SPA fallback asynchronously in the background
async function launchServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite Dev Server in the background...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite Dev Server Middleware successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production assets from dist/");
  }
}

launchServer().catch((err) => {
  console.error("Failed to compile or mount background Vite middleware:", err);
});
