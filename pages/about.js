import Layout from "../components/layout";
import Head from "next/head";


export default function About() {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="about.css"/>
            </Head>
            <Layout>
                <h1>About</h1>
            </Layout>
        </>
    )
}
