'use client';
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function RedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const gameUrl = 'https://www.cosmiccowboys.cloud';

        // Perform the redirect
        window.location.href = gameUrl; // For a full page reload redirect
        // Or use Next.js router for client-side redirect (comment out the line above if using this)
        // router.push(youtubeUrl);
    }, [router]);

    return (
        <div>
            <p>Traveling to Ganyemede...</p>
        </div>
    );
}