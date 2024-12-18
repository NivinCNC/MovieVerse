// ServerComponent.js
import axios from "axios";

export const fetchMovies = async (movieId) => {
    const payload = {
        where: {
            tmdbid: { $regex: movieId, $options: "i" },
        },
        order: "-createdAt",
        limit: 999999999,
        skip: 0,
        _method: "GET",
        _ApplicationId: "SHOWFLIXAPPID",
        _ClientVersion: "js3.4.1",
        _InstallationId: "951253bd-11ac-473f-b0b0-346e2d3d542f",
    };

    try {
        const response = await axios.post(
            "https://parse.showflix.shop/parse/classes/movies/",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response?.data?.results?.length > 0) {
            const streamwish = response.data.results[0].streamwish;
            return streamwish ? `https://embedwish.com/e/${streamwish}.html` : null;
        }
        return null;
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        return null;
    }
};


export const fetchSeries = async (seriesName,season,episode) => {
    const payload = {
        where: {
            seriesName: { $regex: seriesName, $options: "i" },
        },
        order: "-createdAt",
        limit: 999999999,
        skip: 0,
        _method: "GET",
        _ApplicationId: "SHOWFLIXAPPID",
        _ClientVersion: "js3.4.1",
        _InstallationId: "951253bd-11ac-473f-b0b0-346e2d3d542f",
    };

    try {
        const response = await axios.post(
            "https://parse.showflix.shop/parse/classes/series",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",                },
            }
        );

        if (response?.data?.results?.length > 0) {
            const series = response.data.results[0];
            console.log(series);
            if (series) {
                console.log(season,episode);
                const seasonData = series.streamwish[`Season ${season}`];
                console.log(seasonData);
                if (seasonData && seasonData[episode]) {
                    const streamwishUrl = seasonData[episode];
                    const embedwishUrl = streamwishUrl.replace("streamwish.com", "embedwish.com");
                    return embedwishUrl;
                } else {
                    console.error("Error fetching series: Episode not found");
                    return null;
                }
            } else {
                console.error("Error fetching series: Series not found");
                return null;
            }
        }
        console.error("Error fetching series: Series not found11");
        return null;
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        return null;
    }
};