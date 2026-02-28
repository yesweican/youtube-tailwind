import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { SUBS_VIDEOS_API_END_POINT } from "../config/constants";

function SubscriptionVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        //picking up token from local storage not from Cookies
        const token = localStorage.getItem("accessToken");

        const res = await fetch(
          `${SUBS_VIDEOS_API_END_POINT}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        setVideos(data.results || []);

        console.log("Fetched subscription videos:", data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">
        Subscription Videos
      </h1>

      {loading && (
        <div className="text-gray-500">
          Searching videos...
        </div>
      )}

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-gray-500">
          No videos found.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <RouterLink to={`/video/${video.id}`}>
              <video
                src={video.video_url}
                controls
                className="w-full h-48 object-cover bg-black"
              />
              <div className="p-4">
                <h2 className="text-sm font-semibold line-clamp-2 mb-1">
                  {video.title}
                </h2>

                {video.description && (
                  <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                    {video.description}
                  </p>
                )}

                <p className="text-xs text-gray-400">
                  {new Date(video.created_at).toLocaleDateString()}
                </p>
              </div>
            </RouterLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionVideos;