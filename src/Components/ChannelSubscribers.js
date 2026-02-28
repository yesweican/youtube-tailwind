import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CHANNEL_SUBSCRIBERS_API_END_POINT } from "../config/constants";

function ChannelSubscribers() {
  const { id } = useParams();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        setError(null);

        //picking up token from local storage not from Cookies
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${CHANNEL_SUBSCRIBERS_API_END_POINT}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });


        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        setSubscribers(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">
        Channel Subscribers
      </h1>

      {loading && (
        <div className="text-gray-500">
          Loading subscribers...
        </div>
      )}

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && subscribers.length === 0 && (
        <div className="text-gray-500">
          No subscribers found.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {subscribers.map((subscriber) => (
        <div key={subscriber.id} className="p-4 border rounded">
            <h2 className="text-sm font-semibold line-clamp-2 mb-1">
                {subscriber.fullname}
            </h2>

            {subscriber.email&& (
                <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                {subscriber.email}
                </p>
            )}

            <p className="text-xs text-gray-400">
                {new Date(subscriber.created_at).toLocaleDateString()}
            </p>
        </div>
        ))}
      </div>
    </div>
  );
}

export default ChannelSubscribers;