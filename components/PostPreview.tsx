import Link from "next/link";
import Image from 'next/image'
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
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-7">
                                <h3 className="text-left"><a href={href} className="newsletter-post-title" >{props.title}</a></h3>
                                <div className="row">
                                    <div className="col-md-6">
                                    <h6>{props.date}</h6>
                                    </div>
                                    <div className="col-md-6 read-time">
                                    <h6>{props.readTime}</h6>
                                    </div>
                                </div>
                                <br />
                                <h6 className="blog-content">
                                    {props.subtitle}
                                </h6>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5 text-center">

                                <a href={href}>
                                <Image src={photo} className="blog-post-img" alt={props.title} width={0} height={0} sizes="100vw" style={{ width: '80%', height: 'auto' }} />
                                    </a>
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
