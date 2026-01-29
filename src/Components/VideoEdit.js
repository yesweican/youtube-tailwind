import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VIDEO_API_END_POINT, CHANNEL_API_END_POINT } from "../config/constants";

function VideoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    channel_id: ""
  });

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  /* ---------- Load video + channels ---------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [videoRes, channelRes] = await Promise.all([
          fetch(`${VIDEO_API_END_POINT}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${CHANNEL_API_END_POINT}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!videoRes.ok) throw new Error("Failed to load video");
        if (!channelRes.ok) throw new Error("Failed to load channels");

        const video = await videoRes.json();
	const channels = await channelRes.json();
        const channelList = channels.results;

        setForm({
          title: video.title || "",
          description: video.description || "",
          channel_id:
            video.channel_id?._id || video.channel_id || ""
        });

        setChannels(channelList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, token]);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      console.log("Submitting form:", form);

      const res = await fetch(`${VIDEO_API_END_POINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Failed to update video");
      }

      navigate(`/video/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI States ---------- */
  if (loading) {
    return <div className="p-6 text-gray-500">Loading video...</div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto mt-6 p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>;
   }

  /* ----------------------------
     UI
  -----------------------------*/
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Channel Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Channel</label>
          <select
            name="channel_id"
            value={form.channel_id}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 bg-white focus:outline-none focus:ring"
            required
          >
            <option value="">Select a channel</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoEdit;


