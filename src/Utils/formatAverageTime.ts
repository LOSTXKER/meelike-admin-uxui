// utils/timeFormatter.ts
export const formatAverageTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    const hourText = wholeHours > 0 ? `${wholeHours} hour${wholeHours > 1 ? 's' : ''}` : '';
    const minuteText = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';

    return [hourText, minuteText].filter(Boolean).join(' ');
};

export const formatAverageTimeSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hourText = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    const minuteText = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
    const secondText = remainingSeconds > 0 ? `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}` : '';

    return [hourText, minuteText, secondText].filter(Boolean).join(' ');
};
