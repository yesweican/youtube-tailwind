import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { VIDEO_SEARCH_API_END_POINT } from "../config/constants";

function VideoSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1); // UI page
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (!query.trim()) {
      setVideos([]);
      return;
    }

    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${VIDEO_SEARCH_API_END_POINT}?q=${encodeURIComponent(query)}&page=${page-1}&pageSize=${pageSize}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();

        setVideos(data.results || []);
        setTotal(data.total || 0);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query, page, pageSize]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Search Results</h1>

      {query && (
        <p className="text-sm text-gray-600 mb-6">
          Results for <span className="font-medium">"{query}"</span>
        </p>
      )}

      {loading && <div className="text-gray-500">Searching videos...</div>}

      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && videos.length === 0 && query && (
        <div className="text-gray-500">No videos found.</div>
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoSearch;

