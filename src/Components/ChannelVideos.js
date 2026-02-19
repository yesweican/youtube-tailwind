import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CHANNEL_VIDEOS_API_END_POINT } from "../config/constants";

function ChannelVideos() {
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setVideoLoading(true);
        setError(null);

        //picking up token from local storage not from Cookies
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${CHANNEL_VIDEOS_API_END_POINT}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });


        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();

        console.log("channel videos response:", data);
        console.log("Array?", Array.isArray(data.results), data.results);

        setVideos(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">
        Channel Videos
      </h1>

      {videoLoading && (
        <div className="text-gray-500">
          Loading Videos...
        </div>
      )}

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      {!videoLoading && !error && videos.length === 0 && (
        <div className="text-gray-500">
          No videos found.
        </div>
      )}
    
      <div className="flex flex-col gap-4">
      {videos.map((video) => (
        <div key={video.id} className="p-4 border rounded">
            {video.video_url && (
            <video
                src={video.video_url}
                controls
                className="w-full h-48 object-cover bg-black"
            />                
            )}

            <h2 className="text-sm font-semibold line-clamp-2 mb-1">
                {video.title}
            </h2>

            <p className="text-xs text-gray-400">
                {new Date(video.created_at).toLocaleDateString()}
            </p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default ChannelVideos;