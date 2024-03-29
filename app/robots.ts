import { MetadataRoute } from "next";

export default function robots() : MetadataRoute.Robots {
    
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/"
            }
        ],
        host: `https://stefandjokic.tech`,
        sitemap: `https://stefandjokic.tech/sitemap.xml`
    }
}