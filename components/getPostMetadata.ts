import fs from "fs";
import matter from "gray-matter";
import { PostMetadata } from "../components/PostMetadata";

const getPostMetadata = (): PostMetadata[] => {
  const folder = "posts/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  // Get gray-matter data from each file.
  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`posts/${fileName}`, "utf8");
    const matterResult = matter(fileContents);
    return {
      newsletterTitle: matterResult.data.newsletterTitle,
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      readTime: matterResult.data.readTime,
      category: matterResult.data.category,
      slug: fileName.replace(".md", ""),
      photo: `/images/blog/${fileName.replace(".md", "")}.png`
    };
  });

  return posts;
};

const getPatterns = (): PostMetadata[] => {
  const folder = "patterns/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  // Get gray-matter data from each file.
  const patterns = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`patterns/${fileName}`, "utf8");
    const matterResult = matter(fileContents);
    return {
      newsletterTitle: matterResult.data.newsletterTitle,
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      readTime: matterResult.data.readTime,
      category: matterResult.data.category,
      slug: fileName.replace(".md", ""),
      photo: `/images/blog/${fileName.replace(".md", "")}.png`
    };
  });

  return patterns;
};

export default getPostMetadata;
