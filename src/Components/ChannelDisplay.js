import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CHANNEL_API_END_POINT } from "../config/constants";

function ChannelDisplay() {
  const { id } = useParams();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <h1 className="text-xl font-semibold mb-2">
          {channel.name}
        </h1>

        {channel.description && (
          <p className="text-gray-700 mb-3">
            {channel.description}
          </p>
        )}

        {channel.owner && (
          <p className="text-sm text-gray-500">
            Created by: {channel.owner}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChannelDisplay;