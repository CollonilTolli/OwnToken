import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Root } from "@/components/Root/Root";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";

export const metadata: Metadata = {
  title: "OWN test stand",
  description: "This is Own token stand",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <Script src="https://telegram.org/js/telegram-web-app.js" />
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
