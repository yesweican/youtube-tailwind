import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CHANNEL_API_END_POINT } from "../config/constants";
import ChannelSubscribers from "./ChannelSubscribers";

function ChannelEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    owner: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  /* ---------- Load video + channels ---------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const channelRes = await fetch(`${CHANNEL_API_END_POINT}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!channelRes.ok) throw new Error("Failed to load channel");

        console.log(channelRes);

        const channel = await channelRes.json();

        setForm({
          name: channel.name || "",
          description: channel.description || "",
          owner: channel.owner?._id || channel.owner || ""
        });
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

      const res = await fetch(`${CHANNEL_API_END_POINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Failed to update channel");
      }

      navigate(`/channel/${id}`);
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
      <h1 className="text-2xl font-semibold mb-6">Channel Edit</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="name"
            value={form.name}
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

        {form.owner && (
          <p className="text-sm text-gray-500">
            Created by: {form.owner}
          </p>
        )}

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

      <ChannelSubscribers />
    </div>
  );
};

export default ChannelEdit;