import Image from "next/image";

export default function Home() {
    return (
        <div>
            <div>
                <Image
                    src="/images/banner.png"
                    alt="배너 이미지"
                    width={1200}
                    height={400}
                />
            </div>
            <section id="main-video">
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/IUbP34LAo90?si=Bkn_ljrJ3OD6CEO_"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </section>
        </div>
    );
}
