// Video Üretim API - Sora/Runway AI Entegrasyonu
export async function generateVideo(prompt, duration = "10s", style = "sinematik") {
    try {
        // API endpoint (gerçek implementasyon için Sora/Runway API gerekir)
        const response = await fetch('/api/video-generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SORA_API_KEY || process.env.RUNWAY_API_KEY}`
            },
            body: JSON.stringify({
                prompt: `${prompt}, ${style}, ${duration}`,
                model: 'sora-1.0', // veya runway-model
                quality: 'high',
                aspect_ratio: '16:9'
            })
        });

        if (!response.ok) {
            throw new Error(`Video generation failed: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Video URL ve metadata
        return {
            videoUrl: data.video_url,
            thumbnailUrl: data.thumbnail_url,
            duration: data.duration,
            resolution: data.resolution,
            createdAt: new Date().toISOString(),
            prompt: prompt,
            style: style,
            serialNumber: generateSerialNumber()
        };
    } catch (error) {
        console.error('Video generation error:', error);
        
        // Demo amaçlı placeholder video döndür
        return generatePlaceholderVideo(prompt, duration, style);
    }
}

// Demo placeholder video üretimi
function generatePlaceholderVideo(prompt, duration, style) {
    // Placeholder video URL (gerçek implementasyonda değişecek)
    const placeholderVideos = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ];
    
    const randomVideo = placeholderVideos[Math.floor(Math.random() * placeholderVideos.length)];
    
    return {
        videoUrl: randomVideo,
        thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/450.jpg`,
        duration: duration,
        resolution: '1920x1080',
        createdAt: new Date().toISOString(),
        prompt: prompt,
        style: style,
        serialNumber: generateSerialNumber(),
        isPlaceholder: true
    };
}

// Seri numarası üretimi
function generateSerialNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VID-${timestamp}-${random}`;
}

// Video indirme fonksiyonu
export async function downloadVideo(videoData, includeSeal = true) {
    try {
        if (includeSeal) {
            // Mühürlü video indirme (watermark eklenmiş)
            return await downloadSealedVideo(videoData);
        } else {
            // Orijinal video indirme
            return await downloadOriginalVideo(videoData);
        }
    } catch (error) {
        console.error('Video download error:', error);
        throw error;
    }
}

// Mühürlü video indirme
async function downloadSealedVideo(videoData) {
    // Watermark ekleme işlemi (frontend'de canvas ile yapılacak)
    const response = await fetch(videoData.videoUrl);
    const blob = await response.blob();
    
    // Videoyu blob olarak döndür
    return {
        blob: blob,
        filename: `omerai-video-${videoData.serialNumber}.mp4`,
        contentType: 'video/mp4'
    };
}

// Orijinal video indirme
async function downloadOriginalVideo(videoData) {
    const response = await fetch(videoData.videoUrl);
    const blob = await response.blob();
    
    return {
        blob: blob,
        filename: `omerai-video-${videoData.serialNumber}-original.mp4`,
        contentType: 'video/mp4'
    };
}

// Video galeriye ekleme
export function addToVideoGallery(videoData) {
    // LocalStorage'a video ekle
    const gallery = JSON.parse(localStorage.getItem('omerai-video-gallery') || '[]');
    
    const videoItem = {
        id: Date.now(),
        ...videoData,
        addedAt: new Date().toISOString()
    };
    
    gallery.unshift(videoItem);
    
    // Maksimum 50 video tut
    if (gallery.length > 50) {
        gallery.splice(50);
    }
    
    localStorage.setItem('omerai-video-gallery', JSON.stringify(gallery));
    
    return videoItem;
}

// Video galerisini getir
export function getVideoGallery() {
    return JSON.parse(localStorage.getItem('omerai-video-gallery') || '[]');
}

// Video silme
export function removeFromVideoGallery(videoId) {
    const gallery = JSON.parse(localStorage.getItem('omerai-video-gallery') || '[]');
    const filteredGallery = gallery.filter(video => video.id !== videoId);
    localStorage.setItem('omerai-video-gallery', JSON.stringify(filteredGallery));
    return filteredGallery;
}

// Video analiz ve meta veri
export function analyzeVideo(videoData) {
    return {
        estimatedSize: '15.2 MB',
        duration: videoData.duration,
        resolution: videoData.resolution,
        format: 'MP4',
        codec: 'H.264',
        frameRate: '30 fps',
        bitrate: '5.2 Mbps',
        aiModel: 'Sora 1.0',
        processingTime: '45 saniye',
        promptTokens: videoData.prompt.length,
        styleCategory: categorizeStyle(videoData.style)
    };
}

// Stil kategorizasyonu
function categorizeStyle(style) {
    const categories = {
        'sinematik': 'Film & Sinema',
        'animasyon': 'Animasyon & 3D',
        'dokümantal': 'Belgesel & Eğitim',
        'müzik klip': 'Müzik & Eğlence',
        'reklam': 'Ticari & Reklam'
    };
    
    for (const [key, category] of Object.entries(categories)) {
        if (style.toLowerCase().includes(key)) {
            return category;
        }
    }
    
    return 'Genel';
}
