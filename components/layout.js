import Link from "next/link";
import Head from "next/head";


export default function Layout({children}) {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="layout.css"/>
            </Head>
            <nav>
                <Link href="/">home</Link>
                <Link href="/about">about</Link>
            </nav>
            <div className="content">{children}</div>
            <style jsx>
                {
                    `
                      .content {
                      background: black;
                      color: white;
                      }
                    `
                }
            </style>
        </>
    )
}
