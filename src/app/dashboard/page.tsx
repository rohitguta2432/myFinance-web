import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/");

    const cookieStore = await cookies();
    const profileCookie = cookieStore.get("user_profile")?.value;

    let user = null;
    if (profileCookie) {
        try {
            user = JSON.parse(profileCookie);
        } catch {
            user = {
                id: session.payload.sub,
                email: session.payload.email ?? "",
                name: "",
                pictureUrl: "",
            };
        }
    }

    return <DashboardContent user={user} />;
}
