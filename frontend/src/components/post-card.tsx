import { Person, Post } from "@/lib/interfaces";
import { Eye, Heart, MessageCircle, Repeat } from "lucide-react";
import Image from "next/image";

function formatNumber(num: number) {
    if (num >= 1_000_000)
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
}

export default function PostCard({
    post,
    person,
    onHover,
}: {
    post: Post;
    person: Person;
    onHover?: (arg: Post | undefined) => void;
}) {
    const date = new Date(post.time);
    const dateStr = date.toString().slice(4, 21); // month day year hour:minute

    return (
        <div
            className="bg-background border rounded-lg p-4"
            onMouseEnter={() => onHover && onHover(post)}
            onMouseLeave={() => onHover && onHover(undefined)}
        >
            <div className="flex gap-2">
                <div>
                    <Image
                        className="min-w-[35px] min-h-[35px] rounded-full"
                        width={35}
                        height={35}
                        src={person.imgUrl}
                        alt={"profile_image"}
                    />
                </div>
                <div>
                    <div className="flex gap-1 items-center">
                        <p className="font-bold">{person.profileName}</p>
                        <div className="flex gap-1 justify-center text-sm opacity-80">
                            <p>{person.username}</p>
                            <p>{dateStr}</p>
                        </div>
                    </div>
                    <p>{post.text}</p>
                    <div className="flex gap-4 text-sm mt-1">
                        <div className="flex items-center gap-0.5">
                            <Heart size={17} />
                            {formatNumber(post.likes)}
                        </div>
                        <div className="flex items-center gap-0.5">
                            <MessageCircle size={17} />
                            {formatNumber(post.comments)}
                        </div>
                        <div className="flex items-center gap-0.5">
                            <Repeat size={17} />
                            {formatNumber(post.retweets)}
                        </div>
                        {post.views > 0 && (
                            <div className="flex items-center gap-0.5">
                                <Eye size={17} />
                                {formatNumber(post.views)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
