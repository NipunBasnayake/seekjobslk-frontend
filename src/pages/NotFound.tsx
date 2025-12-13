import {useLocation, Link} from "react-router-dom";
import {useEffect} from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <div className="w-full max-w-md text-center space-y-6">
                {/* 404 */}
                <h1 className="text-7xl font-extrabold tracking-tight text-primary">
                    404
                </h1>

                <p className="text-xl font-semibold">
                    Page Not Found
                </p>

                <p className="text-sm text-muted-foreground">
                    Sorry, the page you’re looking for doesn’t exist or has been moved.
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-4 pt-4">
                    <Link
                        to="/"
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                    >
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-muted transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
