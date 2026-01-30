import { useState, useEffect, useCallback, useMemo } from 'react';

interface ReadingProgressProps {
    content: string;
}

export function ReadingProgress({ content }: ReadingProgressProps) {
    const [progress, setProgress] = useState(0);
    const wordCount = useMemo(() => {
        // Using match with \S+ is more robust for word counting
        return content.match(/\S+/g)?.length ?? 0;
    }, [content]);

    const MIN_WORD_COUNT_TO_SHOW_PROGRESS = 300;
    const shouldShow = useMemo(
        () => wordCount > MIN_WORD_COUNT_TO_SHOW_PROGRESS,
        [wordCount]
    );

    const handleScroll = useCallback(() => {
        if (!shouldShow) return;

        requestAnimationFrame(() => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const scrollableHeight = documentHeight - windowHeight;
            const currentProgress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

            setProgress(Math.min(100, Math.max(0, currentProgress)));
        });
    }, [shouldShow]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (!shouldShow) return null;

    return (
        <div
            className="fixed top-0 left-0 z-[60] h-[2px] w-full pointer-events-none"
            aria-hidden="true"
        >
            <div
                className="h-full bg-accent opacity-20 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
