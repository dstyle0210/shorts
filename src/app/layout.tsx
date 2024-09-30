import type { Metadata } from "next";
import "./globals.scss";
export const metadata: Metadata = {
    title: "Mabongpapa Shorts",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <link rel="stylesheet" href="https://vjs.zencdn.net/8.16.1/video-js.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
                <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
                <script src="https://vjs.zencdn.net/8.16.1/video.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}