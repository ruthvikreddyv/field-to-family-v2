import Head from "next/head";
import "../styles/globals.css";

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
      </Head>
      <Component {...pageProps} />
    </>
  );
}
