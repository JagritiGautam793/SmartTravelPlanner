import { useState, useEffect } from "react";
import { fetchGooglePlaces } from "@/lib/googlePlaces";

export function useRecommendations(selectedCategory) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCategory) {
      fetchRecommendations();
    }
  }, [selectedCategory]);

  async function fetchRecommendations() {
    try {
      setLoading(true);

      // Get Google Places recommendations
      const googlePlaces = await fetchGooglePlaces(selectedCategory);

      setRecommendations(googlePlaces);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return { recommendations, loading, error };
}
