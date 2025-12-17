import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, Cookie, ExternalLink, CheckCircle } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | SeekJobsLk</title>
                <meta
                    name="description"
                    content="Privacy Policy for SeekJobsLk explaining how we use cookies, ads, and third-party services like Google."
                />
            </Helmet>

            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                        <ShieldCheck className="w-4 h-4" />
                        Your Privacy Matters
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        This page explains how SeekJobsLk collects, uses, and protects your
                        information when you use our website.
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="container mx-auto px-4 py-16 max-w-3xl space-y-10">
                {/* Intro */}
                <section>
                    <p className="text-muted-foreground leading-relaxed">
                        At <strong>SeekJobsLk</strong>, we respect your privacy. This Privacy
                        Policy document outlines the types of information that are collected
                        and recorded by SeekJobsLk and how we use it.
                    </p>
                </section>

                {/* Info Collection */}
                <section>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Information We Collect
                    </h2>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Basic usage data such as pages visited and time spent on pages</li>
                        <li>Browser and device information for analytics purposes</li>
                        <li>Cookies to enhance user experience and performance</li>
                    </ul>
                </section>

                {/* Cookies */}
                <section>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Cookie className="w-5 h-5 text-primary" />
                        Cookies & Advertising
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        SeekJobsLk uses cookies to store information about visitors’
                        preferences and to optimize the experience by customizing our web
                        page content based on visitors’ browser type or other information.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                        We may use third-party advertising partners such as{" "}
                        <strong>Google</strong>. Google uses cookies (including the DART
                        cookie) to serve ads to users based on their visit to this and other
                        websites.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                        Users may opt out of Google’s personalized advertising by visiting
                        Google Ads Settings.
                    </p>
                </section>

                {/* Third Parties */}
                <section>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-primary" />
                        Third-Party Links
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        SeekJobsLk contains links to external websites, including employer
                        career pages and third-party job platforms. We are not responsible
                        for the privacy practices or content of these external sites.
                    </p>
                </section>

                {/* Consent */}
                <section>
                    <h2 className="text-xl font-semibold mb-3">Consent</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        By using our website, you hereby consent to our Privacy Policy and
                        agree to its terms.
                    </p>
                </section>

                {/* Update Notice */}
                <section className="rounded-xl border border-border bg-card p-5">
                    <p className="text-sm text-muted-foreground">
                        This Privacy Policy may be updated from time to time. Any changes
                        will be posted on this page with an updated revision date.
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SeekJobsLk. Your privacy is important to us.
                </div>
            </footer>
        </>
    );
};

export default PrivacyPolicy;
