import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { SUBS_VIDEOS_API_END_POINT } from "../config/constants";

function SubscriptionVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 20;

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // 🔒 Prevent duplicate / concurrent fetches
  const isFetchingRef = useRef(false);

  const fetchVideos = useCallback(async (pageToFetch) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please log in.");
        return;
      }

      const res = await fetch(
        `${SUBS_VIDEOS_API_END_POINT}?page=${pageToFetch}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      const newVideos = data.results || [];
      const total = data.total || 0;

      // ✅ Deduplicate
      setVideos((prev) => {
        const existingIds = new Set(prev.map((v) => v.id));
        const filtered = newVideos.filter((v) => !existingIds.has(v.id));
        return [...prev, ...filtered];
      });

      // ✅ Determine if more pages exist
      setHasMore((pageToFetch + 1) * pageSize < total);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // 🔁 Fetch when page changes
  useEffect(() => {
    fetchVideos(page);
  }, [page, fetchVideos]);

  // 👁️ IntersectionObserver setup (sentinel)
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "200px", // 🔥 preload before reaching bottom
      }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">
        Subscription Videos
      </h1>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-gray-500">No videos found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <RouterLink to={`/video/${video.id}`}>
              <video
                src={video.video_url}
                controls
                className="w-full h-56 object-cover bg-black"
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

      {/* 🔻 Sentinel (infinite scroll trigger) */}
      <div ref={sentinelRef} className="h-10" />

      {loading && (
        <div className="text-center text-gray-500 mt-6">
          Loading more videos...
        </div>
      )}

      {!hasMore && videos.length > 0 && (
        <div className="text-center text-gray-400 mt-6">
          No more videos
        </div>
      )}
    </div>
  );
}

export default SubscriptionVideos;