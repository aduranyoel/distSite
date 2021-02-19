import Layout from "../components/layout";
import Head from "next/head";


export default function App() {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="home.css"/>
            </Head>
            <Layout>
                <h1>Home</h1>
            </Layout>
        </>
    )
}
