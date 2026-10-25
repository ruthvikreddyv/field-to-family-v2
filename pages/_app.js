import Head from "next/head";
import "../styles/globals.css";
import { CONFIG } from "../lib/config.mjs";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Field to Family — fresh vegetables delivered in Hyderabad</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta
          name="description"
          content="Order farm-fresh vegetables in Hyderabad. Pick what you need and send your order on WhatsApp."
        />
        <meta name="theme-color" content="#2f4a34" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Field to Family - fresh vegetables in Hyderabad" />
        <meta property="og:description" content="Pick your vegetables and send your order on WhatsApp. Delivered fresh to your door." />
        <meta property="og:image" content={CONFIG.siteUrl + "/og.png"} />
        <meta property="og:url" content={CONFIG.siteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
