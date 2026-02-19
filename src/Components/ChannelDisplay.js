import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SUBSCRIPTION_API_END_POINT, CHANNEL_API_END_POINT } from "../config/constants";
import ChannelVideos from "./ChannelVideos";

function ChannelDisplay() {
  const { id } = useParams();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subscribing, setSubscribing] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${CHANNEL_API_END_POINT}/${id}`);
        if (!res.ok) throw new Error("Failed to load channel");

        const data = await res.json();
        console.log(data);
        setChannel(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      setSubscribing(true);

      await fetch(`${SUBSCRIPTION_API_END_POINT}/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
        })
      console.log("Subscribed to channel:", channel._id || id);
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

  if (!channel) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      {/* ---------- Metadata Card ---------- */}
      <div className="bg-white rounded-lg shadow p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">
            {channel.name}
          </h1>

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

        {channel.description && (
          <p className="text-gray-700 mb-3">
            {channel.description}
          </p>
        )}

        {channel.owner && (
          <p className="text-sm text-gray-500">
            Created by: {channel.owner.fullname ?? channel.owner}
          </p>
        )}
      </div>
    <ChannelVideos />
    </div>
  );
}

export default ChannelDisplay;