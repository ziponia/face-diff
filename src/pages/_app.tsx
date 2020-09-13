import React from "react";
import {NextComponentType} from "next";
import Head from "next/head";
import {AppContext, AppInitialProps, AppProps} from "next/app";

import "bootstrap/dist/css/bootstrap.min.css";
import '../index.sass';

const _App: NextComponentType<AppContext, AppInitialProps, AppProps> = (
    {
        Component,
        pageProps,
    }) => {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>PaceDiff</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
};

_App.getInitialProps = async (
    {
        Component,
        ctx,
    }: AppContext): Promise<AppInitialProps> => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return {pageProps};
};

export default _App;
