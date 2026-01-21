import { useEffect, useState } from "react";
import { ARTICLE_API_END_POINT } from "../config/constants";

function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        //picking up token from local storage not from Cookies
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${ARTICLE_API_END_POINT}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });


        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        setArticles(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">
        My Articles
      </h1>

      {loading && (
        <div className="text-gray-500">
          Loading articles...
        </div>
      )}

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-gray-500">
          No articles found.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
        <div className="h-full rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
            {article.attachment && (
                <img
                src={article.attachment}
                alt={article.title}
                className="w-full h-40 object-cover"
                loading="lazy"
                />
            )}

            <div className="p-4">
                <h3 className="text-base font-semibold mb-2">
                {article.title}
                </h3>

                {article.details && (
                <p className="text-sm text-gray-600 line-clamp-3">
                    {article.details}
                </p>
                )}
            </div>
        </div>
        ))}
      </div>
    </div>
  );
}

export default MyArticles;