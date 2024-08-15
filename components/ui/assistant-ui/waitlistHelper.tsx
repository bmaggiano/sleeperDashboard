export default async function WaitlistHelper({ email }: { email: string }) {
    try {
        const response = await fetch("/api/joinWaitlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            return response.json();
        } else {
            console.error("Failed to join waitlist");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}