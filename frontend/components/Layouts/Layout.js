
import Head from 'next/head';

const Layout = ({ children, title = 'Kazilink' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Kazilink - Connecting talent with opportunity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
