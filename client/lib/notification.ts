export async function requestNotificationPermission() {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
}

export function showNotification({
    title,
    body,
    icon = "/logo.png",
    onClick,
}: {
    title: string;
    body: string;
    icon?: string;
    onClick?: () => void;
}) {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") return;

    const notification = new Notification(title, {
        body,
        icon,
        badge: "/logo.png",
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
        onClick?.();
    };
}