import { useProfileStore } from "../store/useProfileStore";

export const useProfile = () => {
    const {
        user,
        isLoading,
        isCheckingUsername,
        isUploadingAvatar,
        usernameAvailable,
        usernameMessage,
        error,
        getProfile,
        checkUsername,
        updateUsername,
        updateProfile,
        uploadProfilePic,
        removeProfilePic,
        updateNotificationSettings,
        updatePrivacySettings,
        changePassword,
        deleteAccount,
        setUser,
        clearUser,
    } = useProfileStore();

    return {
        user,
        isLoading,
        isCheckingUsername,
        isUploadingAvatar,
        usernameAvailable,
        usernameMessage,
        error,
        getProfile,
        checkUsername,
        updateUsername,
        updateProfile,
        uploadProfilePic,
        removeProfilePic,
        updateNotificationSettings,
        updatePrivacySettings,
        changePassword,
        deleteAccount,
        setUser,
        clearUser,
    };

};
