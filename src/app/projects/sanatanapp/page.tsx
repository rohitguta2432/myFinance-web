import type { Metadata } from "next";
import {
    BookOpen,
    Headphones,
    Globe,
    Smartphone,
    Heart,
    Music,
    Flame,
    Star,
    ArrowRight,
    Download,
    Wifi,
    WifiOff,
} from "lucide-react";

export const metadata: Metadata = {
    title: "SanatanApp — All-in-One Hindu Devotional App",
    description:
        "Read and listen to Ramayan, Mahabharat, Hanuman Chalisa, Bhagavad Gita, and Aartis — all in one beautiful app. Available on Android.",
    openGraph: {
        title: "SanatanApp — All-in-One Hindu Devotional App",
        description:
            "Read and listen to Ramayan, Mahabharat, Hanuman Chalisa, Bhagavad Gita, and Aartis in one app.",
    },
};

const PLAY_STORE_URL = "#"; // TODO: Replace with actual Play Store URL

const features = [
    {
        icon: <BookOpen size={22} />,
        title: "Sacred Texts",
        desc: "Hanuman Chalisa, Bhagavad Gita (18 chapters, 700 verses), Aartis, Gayatri Mantra, and more — all in original Devanagari with translations.",
    },
    {
        icon: <Headphones size={22} />,
        title: "Audio Streaming",
        desc: "Listen to full Ramcharitmanas katha, Mahabharat episodes, Chalisa renditions, and devotional Aarti recordings.",
    },
    {
        icon: <Globe size={22} />,
        title: "Multi-Language",
        desc: "Read in Hindi, English, Sanskrit, Tamil, and Telugu. Switch languages on any verse with a single tap.",
    },
    {
        icon: <Flame size={22} />,
        title: "Daily Sadhana",
        desc: "Track your daily spiritual practice — morning meditation, Gita reading, evening Aarti — with streak counters to stay motivated.",
    },
    {
        icon: <Heart size={22} />,
        title: "Bookmarks & Favorites",
        desc: "Save your favorite verses, aartis, and chapters. Pick up exactly where you left off with automatic progress tracking.",
    },
    {
        icon: <WifiOff size={22} />,
        title: "Offline Text",
        desc: "All sacred texts are bundled in the app. Read Chalisa, Gita, and Aartis without internet — anytime, anywhere.",
    },
];

const content = [
    { icon: <BookOpen size={18} />, title: "Hanuman Chalisa", detail: "40 verses + doha", color: "#E8732A" },
    { icon: <Star size={18} />, title: "Bhagavad Gita", detail: "18 chapters, 700 verses", color: "#F5C27A" },
    { icon: <Music size={18} />, title: "Aarti Collection", detail: "5+ devotional aartis", color: "#F5A0A0" },
    { icon: <Headphones size={18} />, title: "Ramcharitmanas", detail: "Full katha by Kand", color: "#E8732A" },
    { icon: <Headphones size={18} />, title: "Mahabharat", detail: "Key parvas as audio", color: "#F5C27A" },
    { icon: <Flame size={18} />, title: "Sacred Shlokas", detail: "Gayatri, Mahamrityunjaya", color: "#F5A0A0" },
];

/* Phone mockup showing the Hanuman Chalisa verse reader screen */
function PhoneMockup() {
    return (
        <div
            style={{
                position: "relative",
                width: 300,
                margin: "0 auto",
                perspective: 1000,
            }}
        >
            {/* Saffron glow beneath phone */}
            <div
                style={{
                    position: "absolute",
                    bottom: -30,
                    left: "10%",
                    width: "80%",
                    height: 60,
                    background: "rgba(232, 115, 42, 0.25)",
                    filter: "blur(40px)",
                    borderRadius: "50%",
                    zIndex: 0,
                }}
            />

            {/* Phone frame */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    background: "linear-gradient(145deg, #1A1A1A 0%, #0D0D0D 100%)",
                    border: "2px solid rgba(255,255,255,0.1)",
                    borderRadius: 32,
                    padding: "12px 10px",
                    boxShadow:
                        "0 25px 60px -12px rgba(0,0,0,0.6), 0 0 40px -10px rgba(232,115,42,0.15)",
                    transform: "rotateY(-5deg) rotateX(2deg)",
                }}
            >
                {/* Notch */}
                <div
                    style={{
                        width: 100,
                        height: 6,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderRadius: 3,
                        margin: "0 auto 12px",
                    }}
                />

                {/* Screen area */}
                <div
                    style={{
                        background: "#0D0D0D",
                        borderRadius: 20,
                        padding: 16,
                        minHeight: 440,
                    }}
                >
                    {/* App header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}
                    >
                        <span
                            style={{
                                color: "#E8732A",
                                fontWeight: 700,
                                fontSize: 13,
                            }}
                        >
                            SanatanApp
                        </span>
                        <span style={{ color: "#888", fontSize: 10 }}>
                            Verse Reader
                        </span>
                    </div>

                    {/* Title section */}
                    <div style={{ marginBottom: 12 }}>
                        <p
                            style={{
                                fontSize: 8,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "#F5C27A",
                                marginBottom: 4,
                                textTransform: "uppercase",
                            }}
                        >
                            Holy Hymn
                        </p>
                        <h3
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#FFFFFF",
                                marginBottom: 2,
                            }}
                        >
                            Hanuman Chalisa
                        </h3>
                        <p style={{ fontSize: 9, color: "#888" }}>
                            By Goswami Tulsidas
                        </p>
                    </div>

                    {/* Language toggle */}
                    <div
                        style={{
                            display: "flex",
                            gap: 6,
                            marginBottom: 16,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 9,
                                padding: "4px 12px",
                                borderRadius: 20,
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "#888",
                            }}
                        >
                            HINDI
                        </span>
                        <span
                            style={{
                                fontSize: 9,
                                padding: "4px 12px",
                                borderRadius: 20,
                                backgroundColor: "#FFFFFF",
                                color: "#0D0D0D",
                                fontWeight: 600,
                            }}
                        >
                            ENGLISH
                        </span>
                    </div>

                    {/* Verse 1 */}
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: 16,
                            paddingBottom: 16,
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <p
                            style={{
                                color: "#E8732A",
                                fontSize: 12,
                                lineHeight: 1.8,
                                marginBottom: 8,
                                fontWeight: 500,
                            }}
                        >
                            Shree Guru Charan Saroj Raj
                            <br />
                            Nij Manu Mukuru Sudhari
                        </p>
                        <p
                            style={{
                                color: "#AAAAAA",
                                fontSize: 9,
                                lineHeight: 1.6,
                                fontStyle: "italic",
                            }}
                        >
                            Having cleansed the mirror of my mind
                            <br />
                            with the dust of my Guru&apos;s lotus feet
                        </p>
                    </div>

                    {/* Verse 2 */}
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <p
                            style={{
                                color: "#E8732A",
                                fontSize: 12,
                                lineHeight: 1.8,
                                marginBottom: 8,
                                fontWeight: 500,
                            }}
                        >
                            Buddhiheen Tanu Jaanike
                            <br />
                            Sumirau Pavan Kumar
                        </p>
                        <p
                            style={{
                                color: "#AAAAAA",
                                fontSize: 9,
                                lineHeight: 1.6,
                                fontStyle: "italic",
                            }}
                        >
                            Knowing myself to be ignorant,
                            <br />I remember you, O Son of the Wind
                        </p>
                    </div>

                    {/* Mini audio bar */}
                    <div
                        style={{
                            background: "#1A1A1A",
                            borderRadius: 10,
                            padding: "8px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: "auto",
                        }}
                    >
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                backgroundColor: "#E8732A",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <span style={{ color: "#fff", fontSize: 10 }}>
                                &#9654;
                            </span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    height: 3,
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: "35%",
                                        height: "100%",
                                        backgroundColor: "#E8732A",
                                        borderRadius: 2,
                                    }}
                                />
                            </div>
                        </div>
                        <span style={{ color: "#888", fontSize: 8 }}>
                            2:14
                        </span>
                    </div>
                </div>

                {/* Home indicator */}
                <div
                    style={{
                        width: 80,
                        height: 4,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: 2,
                        margin: "10px auto 0",
                    }}
                />
            </div>
        </div>
    );
}

export default function SanatanAppPage() {
    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#0B1120" }}>
            {/* ── Hero ─────────────────────────────────────────── */}
            <section
                className="relative"
                style={{ paddingTop: 80, paddingBottom: 48 }}
            >
                {/* Background Glows */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ zIndex: -1 }}
                >
                    <div
                        className="absolute rounded-full"
                        style={{
                            top: "-20%",
                            left: "10%",
                            height: 600,
                            width: 600,
                            background: "rgba(232, 115, 42, 0.07)",
                            filter: "blur(120px)",
                        }}
                    />
                    <div
                        className="absolute rounded-full"
                        style={{
                            top: "10%",
                            right: "5%",
                            height: 400,
                            width: 400,
                            background: "rgba(245, 194, 122, 0.05)",
                            filter: "blur(100px)",
                        }}
                    />
                </div>

                <div className="container-7xl">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 48,
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Left — Copy */}
                        <div style={{ flex: "1 1 480px", minWidth: 0 }}>
                            {/* Badge */}
                            <div
                                className="inline-flex items-center gap-2"
                                style={{
                                    marginBottom: 28,
                                    borderRadius: 9999,
                                    border: "1px solid rgba(232, 115, 42, 0.25)",
                                    backgroundColor: "rgba(232, 115, 42, 0.08)",
                                    padding: "6px 16px",
                                }}
                            >
                                <Smartphone
                                    size={18}
                                    style={{ color: "#E8732A" }}
                                />
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: "#E8732A" }}
                                >
                                    Android App
                                </span>
                            </div>

                            {/* Headline */}
                            <h1
                                style={{
                                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                                    fontWeight: 800,
                                    letterSpacing: "-0.025em",
                                    lineHeight: 1.1,
                                    color: "#F1F5F9",
                                    marginBottom: 20,
                                }}
                            >
                                One App.
                                <br />
                                <span style={{ color: "#E8732A" }}>
                                    All Devotion.
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p
                                style={{
                                    maxWidth: 520,
                                    fontSize: "1.1rem",
                                    lineHeight: 1.7,
                                    color: "#94A3B8",
                                    marginBottom: 32,
                                }}
                            >
                                Read and listen to Ramayan, Mahabharat, Hanuman
                                Chalisa, Bhagavad Gita, and Aartis — all in one
                                beautiful, premium experience. Replace 5+
                                religious apps with SanatanApp.
                            </p>

                            {/* CTA */}
                            <a
                                href={PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center text-white font-bold"
                                style={{
                                    height: 56,
                                    minWidth: 240,
                                    borderRadius: 12,
                                    backgroundColor: "#E8732A",
                                    padding: "0 32px",
                                    fontSize: 16,
                                    textDecoration: "none",
                                    boxShadow:
                                        "0 8px 30px -4px rgba(232,115,42,0.35)",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <Download
                                    size={18}
                                    style={{ marginRight: 8 }}
                                />
                                Download on Android
                            </a>

                            {/* Micro info */}
                            <p
                                style={{
                                    marginTop: 16,
                                    fontSize: 13,
                                    color: "#64748B",
                                }}
                            >
                                Free &nbsp;·&nbsp; ~15 MB &nbsp;·&nbsp; No
                                login required &nbsp;·&nbsp; Works offline
                            </p>
                        </div>

                        {/* Right — Phone Mockup */}
                        <div
                            style={{
                                flex: "0 1 340px",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <PhoneMockup />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Content Library ───────────────────────────────── */}
            <section
                className="section-padding"
                style={{ backgroundColor: "#111827" }}
            >
                <div className="container-marketing">
                    <div
                        style={{ textAlign: "center", marginBottom: 56 }}
                    >
                        <p
                            className="text-overline"
                            style={{ color: "#E8732A", marginBottom: 12 }}
                        >
                            SACRED LIBRARY
                        </p>
                        <h2
                            className="text-h2"
                            style={{
                                color: "#F1F5F9",
                                maxWidth: 700,
                                margin: "0 auto 16px",
                            }}
                        >
                            Everything you need for daily devotion
                        </h2>
                        <p
                            style={{
                                color: "#94A3B8",
                                maxWidth: 540,
                                margin: "0 auto",
                                fontSize: 16,
                                lineHeight: 1.6,
                            }}
                        >
                            Texts in original Devanagari with translations,
                            plus full audio streaming — organized and
                            beautiful.
                        </p>
                    </div>

                    {/* Content grid */}
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 16,
                            maxWidth: 900,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {content.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 14,
                                    padding: "16px 20px",
                                    backdropFilter: "blur(12px)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        backgroundColor: `${item.color}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: item.color,
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <div>
                                    <h4
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 700,
                                            color: "#F1F5F9",
                                            marginBottom: 2,
                                        }}
                                    >
                                        {item.title}
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: "#64748B",
                                        }}
                                    >
                                        {item.detail}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────── */}
            <section
                className="section-padding"
                style={{ backgroundColor: "#0B1120" }}
            >
                <div className="container-marketing">
                    <div
                        style={{ textAlign: "center", marginBottom: 56 }}
                    >
                        <p
                            className="text-overline"
                            style={{ color: "#E8732A", marginBottom: 12 }}
                        >
                            FEATURES
                        </p>
                        <h2
                            className="text-h2"
                            style={{
                                color: "#F1F5F9",
                                maxWidth: 700,
                                margin: "0 auto 16px",
                            }}
                        >
                            Built for the modern devotee
                        </h2>
                    </div>

                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: 20,
                            maxWidth: 1000,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {features.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 16,
                                    padding: 24,
                                    backdropFilter: "blur(12px)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        backgroundColor:
                                            "rgba(232,115,42,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#E8732A",
                                        marginBottom: 16,
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <h3
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 700,
                                        color: "#F1F5F9",
                                        marginBottom: 8,
                                    }}
                                >
                                    {f.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 1.7,
                                        color: "#94A3B8",
                                    }}
                                >
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tech Stack ────────────────────────────────────── */}
            <section
                className="section-padding"
                style={{ backgroundColor: "#111827" }}
            >
                <div className="container-marketing">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 48,
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ flex: "1 1 400px" }}>
                            <p
                                className="text-overline"
                                style={{
                                    color: "#E8732A",
                                    marginBottom: 12,
                                }}
                            >
                                UNDER THE HOOD
                            </p>
                            <h2
                                className="text-h2"
                                style={{
                                    color: "#F1F5F9",
                                    marginBottom: 16,
                                }}
                            >
                                Privacy-first, lightweight
                            </h2>
                            <p
                                style={{
                                    color: "#94A3B8",
                                    fontSize: 16,
                                    lineHeight: 1.7,
                                    marginBottom: 32,
                                    maxWidth: 500,
                                }}
                            >
                                No backend servers. No accounts. All texts are
                                bundled locally, audio streams from free public
                                domain sources. Your devotion stays private.
                            </p>
                        </div>

                        <div
                            className="grid grid-cols-2 gap-3"
                            style={{ maxWidth: 380, flex: "0 1 380px" }}
                        >
                            {[
                                {
                                    icon: <Smartphone size={18} />,
                                    title: "React Native",
                                    desc: "Expo SDK 52+",
                                },
                                {
                                    icon: <Wifi size={18} />,
                                    title: "Audio Streaming",
                                    desc: "expo-av from public sources",
                                },
                                {
                                    icon: <Globe size={18} />,
                                    title: "5 Languages",
                                    desc: "Hindi, English, Sanskrit, Tamil, Telugu",
                                },
                                {
                                    icon: <WifiOff size={18} />,
                                    title: "No Backend",
                                    desc: "All data on-device",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        backgroundColor:
                                            "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: 12,
                                        padding: 16,
                                        backdropFilter: "blur(12px)",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "#E8732A",
                                            marginBottom: 8,
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <h4
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: "#F1F5F9",
                                            marginBottom: 2,
                                        }}
                                    >
                                        {item.title}
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: 11,
                                            color: "#64748B",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section
                className="section-padding"
                style={{ backgroundColor: "#0B1120" }}
            >
                <div className="container-marketing text-center">
                    <div
                        style={{
                            maxWidth: 600,
                            marginLeft: "auto",
                            marginRight: "auto",
                            background:
                                "linear-gradient(135deg, rgba(232,115,42,0.05) 0%, rgba(232,115,42,0.12) 100%)",
                            borderRadius: 24,
                            padding: 48,
                            border: "1px solid rgba(232,115,42,0.15)",
                        }}
                    >
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                backgroundColor: "rgba(232,115,42,0.15)",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginBottom: 20,
                            }}
                        >
                            <Flame
                                size={28}
                                style={{ color: "#E8732A" }}
                            />
                        </div>
                        <h3
                            className="text-h3"
                            style={{
                                color: "#F1F5F9",
                                marginBottom: 12,
                            }}
                        >
                            Begin your spiritual journey
                        </h3>
                        <p
                            className="text-body"
                            style={{
                                color: "#94A3B8",
                                marginBottom: 24,
                            }}
                        >
                            Download SanatanApp and carry the wisdom of ancient
                            scriptures in your pocket. Free, private, and
                            beautiful.
                        </p>
                        <a
                            href={PLAY_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-white text-sm font-semibold"
                            style={{
                                padding: "14px 32px",
                                backgroundColor: "#E8732A",
                                borderRadius: 12,
                                boxShadow:
                                    "0 0 20px -4px rgba(232,115,42,0.3)",
                                textDecoration: "none",
                            }}
                        >
                            Download for Android{" "}
                            <ArrowRight
                                size={16}
                                style={{ marginLeft: 6 }}
                            />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
