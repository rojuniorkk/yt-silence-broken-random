import { useState } from "react"

function App() {

  const [url, setUrl] = useState('');
  const [video, setVideo] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  function getYouTubeId(url) {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
  }

  function parseDuration(iso) {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }

  const fetchVideo = async () => {
    const extractedId = getYouTubeId(url);
    if (!extractedId) return;

    // Se já carregou esse vídeo, apenas sorteia e abre uma nova aba
    if (videoId === extractedId && duration > 0) {
      const randomTime = Math.floor(Math.random() * duration);
      window.open(`https://www.youtube.com/watch?v=${extractedId}&t=${randomTime}s`, '_blank');
      return;
    }

    setVideoId(extractedId);
    setLoading(true);

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&key=AIzaSyDt4M5uVaAWIynTb6xQ3SlGB0j6i3n9T5E&id=${extractedId}`
      );
      const data = await res.json();
      const item = data.items?.[0];

      if (item) {
        const totalSeconds = parseDuration(item.contentDetails.duration);
        setVideo(item);
        setDuration(totalSeconds);

        const randomTime = Math.floor(Math.random() * totalSeconds);
        window.open(`https://www.youtube.com/watch?v=${extractedId}&t=${randomTime}s`, '_blank');
      }
    } finally {
      setLoading(false);
    }
  }

  return <>
    <main className="container mx-auto max-w-7xl">

      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col space-y-4 md:max-w-xl max-w-100 ">
          <h1 className="text-4xl font-bold">Quebrando silência durante jogatinas</h1>
          <p>Cole o link de um vídeo do YouTube. Cada clique abre uma nova aba em um momento sorteado.</p>

          <div className="flex space-x-2">
            <input onChange={(e) => setUrl(e.target.value)} className="border-2 border-primary w-full px-4 py-2 rounded-full " type="text" placeholder="https://www.youtube.com/watch?v=" />
            <button onClick={fetchVideo} className="bg-primary cursor-pointer w-25 px-4 rounded-full text-white hover:bg-secondary">Carregar</button>
          </div>
        </div>
      </div>

    </main>
  </>
}

export default App