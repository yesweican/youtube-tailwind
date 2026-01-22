import { useEffect, useState } from "react";
import { CHANNEL_API_END_POINT } from "../config/constants";

function MyChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        setError(null);

        //picking up token from local storage not from Cookies
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${CHANNEL_API_END_POINT}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });


        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        setChannels(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">
        My Channels
      </h1>

      {loading && (
        <div className="text-gray-500">
          Loading channels...
        </div>
      )}

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && channels.length === 0 && (
        <div className="text-gray-500">
          No channels found.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {channels.map((channel) => (
          <a
            key={channel.id}
            href={`/channels/${channel.id}`}
            className="block border rounded-lg p-4 transition
                      hover:shadow-md hover:border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h2 className="text-sm font-semibold line-clamp-2 mb-1">
              {channel.title}
            </h2>

            {channel.description && (
              <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                {channel.description}
              </p>
            )}

            <p className="text-xs text-gray-400">
              {new Date(channel.created_at).toLocaleDateString()}
            </p>
          </a>
        ))}
      </div>

    </div>
  );
}

export default MyChannels;