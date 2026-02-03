import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SUBSCRIPTION_API_END_POINT, VIDEO_API_END_POINT } from "../config/constants";

function VideoDisplay() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subscribing, setSubscribing] = useState(false);

  const token = localStorage.getItem("accessToken"); 

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

    const handleSubscribe = async () => {
    try {
      setSubscribing(true);

      await fetch(`${SUBSCRIPTION_API_END_POINT}/${video.channel_id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Subscribed to channel:", video.channel_id);
      alert("Subscribed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };

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
          <div> 
            <p className="text-sm text-gray-500">
              Channel: {video.channel_id}
            </p>
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className={`px-4 py-2 text-sm font-medium rounded text-white transition
                ${
                  subscribing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {subscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoDisplay;

