import getPostMetadata from "@/components/getPostMetadata";
import { MetadataRoute } from "next";
import config from '@/config.json'


export default async function sitemap() : Promise<MetadataRoute.Sitemap> {
    
    const postMetadata = getPostMetadata();

    const postEntries : MetadataRoute.Sitemap = postMetadata.map((post) => 
    ({ 
        url: `https://thecodeman.net/posts/${post.slug}`,
        lastModified: new Date(config.ChangeDate),
        changeFrequency: "daily",
        priority: 0.7
    }))
    
    return [
        {
            url: `https://thecodeman.net`,
            lastModified: new Date(config.ChangeDate),
            changeFrequency: "daily",
            priority: 0.7
        },
        {
            url: `https://thecodeman.net/sponsorship`,
            lastModified: new Date(config.ChangeDate),
            changeFrequency: "daily",
            priority: 0.7
        },
        {
            url: `https://thecodeman.net/blog`,
            lastModified: new Date(config.ChangeDate),
            changeFrequency: "daily",
            priority: 0.7
        },
        {
            url: `https://thecodeman.net/design-patterns-simplified`,
            lastModified: new Date(config.ChangeDate),
            changeFrequency: "daily",
            priority: 0.7
        },
        ... postEntries
    ]
}