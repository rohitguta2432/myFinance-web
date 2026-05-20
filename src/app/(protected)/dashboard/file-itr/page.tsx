import { getSession } from "@/lib/auth";
import { FileItrIframe } from "./file-itr-iframe";

const AIKAARA_URL = "https://aikaara-stg-backend.flyyx.in/myfinancials/";

export default async function FileItrPage() {
  const session = await getSession();
  const iframeUrl = session
    ? `${AIKAARA_URL}?token=${encodeURIComponent(session.token)}`
    : AIKAARA_URL;

  return <FileItrIframe src={iframeUrl} />;
}
