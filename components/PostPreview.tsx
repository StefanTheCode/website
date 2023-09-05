import Link from "next/link";
import { PostMetadata } from "./PostMetadata";

const PostPreview = (props: PostMetadata) => {
    const href = `/posts/${props.slug}`
    const photo = `/images/blog/${props.slug}.png`
    return (
        <>
            <div className="d-flex">
                <div className="col-sm-12 col-md-12 col-lg-12 pb-5">
                    <div className="justify-content-start pb-3">
                        <div className="row" >
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <h5><a href={href} className="newsletter-title"><i>{props.newsletterTitle}</i></a></h5>
                                <h2><a href={href} className="newsletter-post-title" >{props.title}</a></h2>
                                <h6>{props.date}</h6>
                                <br />
                                <h5 className="blog-content">
                                    {props.subtitle}
                                </h5>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 text-center">
                                <a href={href}><img className="blog-post-img" src={photo}  width="80%" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="hr-between-posts" />
        </>
    );
};

export default PostPreview;
