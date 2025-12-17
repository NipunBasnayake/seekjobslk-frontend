import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { Mail, Clock, HelpCircle } from "lucide-react";
import ConnectWithUs from "@/components/ConnectWithUs";

const Contact = () => {
    return (
        <>
            <Helmet>
                <title>Contact Us | SeekJobsLk</title>
                <meta
                    name="description"
                    content="Contact SeekJobsLk for support, feedback, or reporting job listing issues."
                />
            </Helmet>

            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <div className="container mx-auto px-4 py-20 max-w-5xl text-center">
                    <h1 className="text-4xl font-extrabold mb-4">
                        Contact <span className="text-primary">SeekJobsLk</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Questions, feedback, or reporting an issue?
                        We’re happy to hear from you.
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="grid gap-10 md:grid-cols-2">
                    {/* Contact Info */}
                    <section className="space-y-6">
                        <Info
                            icon={<Mail />}
                            title="Email Support"
                            description="For feedback, support, or reporting listings"
                            value={
                                <a
                                    href="mailto:seekjobslanka@gmail.com"
                                    className="text-primary underline underline-offset-4"
                                >
                                    seekjobslanka@gmail.com
                                </a>
                            }
                        />

                        <Info
                            icon={<Clock />}
                            title="Response Time"
                            description="We usually reply within 24–48 hours on business days."
                        />

                        <Info
                            icon={<HelpCircle />}
                            title="Important Notice"
                            description="SeekJobsLk is not a recruitment agency. Hiring decisions are handled entirely by employers."
                        />
                    </section>

                    {/* Social */}
                    <section>
                        <ConnectWithUs />
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SeekJobsLk. We’re here to help.
                </div>
            </footer>
        </>
    );
};

export default Contact;

const Info = ({
    icon,
    title,
    description,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value?: React.ReactNode;
}) => (
    <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {value && <div className="mt-1">{value}</div>}
        </div>
    </div>
);
