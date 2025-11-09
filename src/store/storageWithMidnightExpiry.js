// storageWithMidnightExpiry.ts
import storage from "redux-persist/lib/storage"; // defaults to localStorage

function getMidnightExpiry() {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0, 0
    );
    return midnight.getTime();
}

const storageWithMidnightExpiry = {
    async setItem(key, value) {
        const item = {
            value,
            expiry: getMidnightExpiry(),
        };
        return storage.setItem(key, JSON.stringify(item));
    },

    async getItem(key) {
        const itemStr = await storage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            if (Date.now() > item.expiry) {
                await storage.removeItem(key);
                return null;
            }
            return item.value;
        } catch {
            return null;
        }
    },

    async removeItem(key) {
        return storage.removeItem(key);
    },
};

export default storageWithMidnightExpiry;
