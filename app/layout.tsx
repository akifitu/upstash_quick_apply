import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">{children}</body>
    </html>
  );
}