import { Suspense } from "react";
import FeedPage from "./feed-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center p-10 text-navy/60">
          A tecer o feed…
        </div>
      }
    >
      <FeedPage />
    </Suspense>
  );
}
