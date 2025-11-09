import { getApi } from "../lib/axiosInstance";

export const getImageUrl = async (imageName) => {
    if (!imageName) return null;

    try {
        const blob = await getApi({
            url: `api/master/fetchimage/${imageName}`,
            responseType: "blob",
        });

        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return null;
    }
};
