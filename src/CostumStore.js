import { create } from "zustand";

const useCustomStore = create((set) => ({
    songs: [],
    setSongs: (songs) => set((state) => ({ songs: songs })),
    currentSong: null,
}));

export default useCustomStore;