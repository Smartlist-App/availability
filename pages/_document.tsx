import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />

        <meta name="title" content="Carbon Availability" />
        <meta name="description" content="Carbon helps you find the best time to meet based on your guest's availability. No signup required" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://availability.smartlist.tech/" />
        <meta property="og:title" content="Carbon Availability" />
        <meta property="og:description" content="Carbon helps you find the best time to meet based on your guest's availability. No signup required" />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://availability.smartlist.tech/" />
        <meta property="twitter:title" content="Carbon Availability" />
        <meta property="twitter:description" content="Carbon helps you find the best time to meet based on your guest's availability. No signup required" />

  
        <meta property="og:image" content="/image.png" />
        <meta property="twitter:image" content="/image.png" />

        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <link
          rel="shortcut icon"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@latest/v3/windows11/Square44x44Logo.altform-unplated_targetsize-48.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
