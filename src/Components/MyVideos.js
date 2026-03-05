import { useEffect, useState } from "react";
import { VIDEO_API_END_POINT } from "../config/constants";
import { Link as RouterLink } from "react-router-dom";

function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);       // 0-based
  const [pageSize] = useState(3);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");

        const res = await fetch(
          `${VIDEO_API_END_POINT}?page=${page}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await res.json();
        console.log("My videos response:", data);
        console.log("Array?", Array.isArray(data.results), data.results);

        setVideos(data.results || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">My Videos</h1>

      {loading && <div className="text-gray-500">Loading videos...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && videos.length === 0 && (
        <div className="text-gray-500">No videos found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <RouterLink to={`/videoedit/${video.id}`}>
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default MyVideos;