export const getEpisodes = async (TMDBID, season) => {
  const url = `https://api.themoviedb.org/3/tv/${TMDBID}/season/${season || 1}?language=en-US?&api_key=56c3457c0ec5b0ce159e30509789e213`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      caches: "no-cache"
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.error}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};