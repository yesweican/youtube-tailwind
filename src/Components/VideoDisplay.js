import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  SUBSCRIPTION_API_END_POINT, 
  VIDEO_API_END_POINT,
  COMMENTS_API_END_POINT,
  VIDEO_COMMENTS_API_END_POINT
} from "../config/constants";

function VideoDisplay() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [posting, setPosting] = useState(false);

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

  /* ---------- Fetch Comments ---------- */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${VIDEO_COMMENTS_API_END_POINT}/${id}`);
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        setComments(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
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

  /* ---------- Post Comment ---------- */
  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      setPosting(true);

      const payload = {
        video_id: id,
        comment_details: commentText
      };  

      const res = await fetch(`${COMMENTS_API_END_POINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log(payload);

      if (!res.ok) throw new Error("Failed to post comment");

      const newComment = await res.json();
      setComments(prev => [newComment, ...prev]);
      setCommentText("");
    } catch (err) {
      alert(err.message);
    } finally {
      setPosting(false);
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
              Channel: {video.channel_name}<span>( {video.channel_id} )</span>
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

      {/* ---------- Add Comment ---------- */}
      <div className="bg-white rounded-lg shadow p-4">
        <textarea
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring"
          rows={3}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handlePostComment}
            disabled={posting}
            className={`px-4 py-2 text-sm rounded text-white ${
              posting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {posting ? "Posting..." : "Comment"}
          </button>
        </div>
      </div>

      {/* ---------- Comment List ---------- */}
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="bg-white rounded shadow p-3">
            <p className="text-sm text-gray-800">{c.comment_details}</p>
            <p className="text-xs text-gray-500 mt-1">
              {c.creator_name} ·{" "}
              {new Date(c.created_at).toLocaleString()}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500">
            No comments yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
}

export default VideoDisplay;

