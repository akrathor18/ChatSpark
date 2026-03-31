import { useProfileStore } from "../store/useProfileStore";

export const useProfile = () => {
    const {
        user,
        isLoading,
        isCheckingUsername,
        isUploadingAvatar,
        usernameAvailable,
        error,
        getProfile,
        checkUsername,
        updateUsername,
        uploadProfilePic,
        removeProfilePic,
        setUser,
        clearUser,
    } = useProfileStore();

    return {
        user,
        isLoading,
        isCheckingUsername,
        isUploadingAvatar,
        usernameAvailable,
        error,
        getProfile,
        checkUsername,
        updateUsername,
        uploadProfilePic,
        removeProfilePic,
        setUser,
        clearUser,
    };
};
