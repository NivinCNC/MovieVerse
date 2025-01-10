
export const getMultiSearch = async (query, page, isadult) => {
  const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=${isadult === true}&language=en-US&page=${page}&api_key=56c3457c0ec5b0ce159e30509789e213`;

  try {
    const res = await fetch(url,
      { next: { caches: "no-cache" } }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
export const getSearch = async (query, page = 1, isAdult = false, type = 'movie') => {
  const apiKey = '56c3457c0ec5b0ce159e30509789e213';
  if (!apiKey) {
    throw new Error('API key is missing.');
  }

  const url = `https://api.themoviedb.org/3/search/${type === "movies" ? "movie" : type}?query=${encodeURIComponent(query)}&include_adult=${isAdult}&language=en-US&page=${page}&api_key=${apiKey}`;


  try {
    const res = await fetch(url, { next: { caches: "no-cache" } });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json(); // Store the result
    return data; // Return the stored result
  } catch (error) {
    console.error(`Failed to fetch search results: ${error.message}`);
    throw error;
  }
};
