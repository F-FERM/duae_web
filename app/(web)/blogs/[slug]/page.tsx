import Navbar from "../../../components/layout/Navbar";
import BlogDetailHero from "../../../components/blog/BlogDetailHero";
import BlogDetailContent from "../../../components/blog/BlogDetailContent";

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <>
            <Navbar />
            <BlogDetailHero slug={slug} />
            <BlogDetailContent slug={slug} />
        </>
    );
}
