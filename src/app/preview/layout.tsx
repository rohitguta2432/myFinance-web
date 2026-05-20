import { QueryProvider } from "@/components/providers/QueryProvider";

export const dynamic = "force-dynamic";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
    return <QueryProvider>{children}</QueryProvider>;
}
