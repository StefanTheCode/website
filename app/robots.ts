import { MetadataRoute } from "next";

export default function robots() : MetadataRoute.Robots {
    
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            }
        ],
        host: 'https://thecodeman.net',
        sitemap: 'https://thecodeman.net/sitemap.xml'
    }
}