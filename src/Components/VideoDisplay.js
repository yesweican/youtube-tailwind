import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VIDEO_API_END_POINT } from "../config/constants";

function VideoDisplay() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${VIDEO_API_END_POINT}/${id}`);
        if (!res.ok) throw new Error("Failed to load video");

        const data = await res.json();
        console.log(data);
        setVideo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  /* ---------- Loading State ---------- */
  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  /* ---------- Error State ---------- */
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-6 p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      {/* ---------- Video Player ---------- */}
      <div className="mb-4 bg-black rounded overflow-hidden">
        <video
          src={video.video_url}
          controls
          className="w-full max-h-[500px]"
        />
      </div>

      {/* ---------- Metadata Card ---------- */}
      <div className="bg-white rounded-lg shadow p-5">
        <h1 className="text-xl font-semibold mb-2">
          {video.title}
        </h1>

        {video.description && (
          <p className="text-gray-700 mb-3">
            {video.description}
          </p>
        )}

        {video.channel_id && (
          <p className="text-sm text-gray-500">
            Channel: {video.channel_id.name || video.channel_id}
          </p>
        )}
      </div>
    </div>
  );
}

export default VideoDisplay;

