
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { ChevronDown, ChevronUp, Heart, MessageCircle, Plus, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Community = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [posts, setPosts] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const { auth } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/posts`);
            setPosts(res.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}/like`, {
                userId: auth?.user?._id,
            });

            if (response.status === 200) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? { ...post, likes: response.data.likes }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };



    const handleComment = async (postId) => {
        if (!commentTexts[postId]?.trim()) return;

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}/comment`, {
                userId: auth?.user?._id,
                userName: auth?.user?.userName,
                text: commentTexts[postId],
            });

            if (response.status === 201) {
                // ✅ Update posts with the full updated post from API
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? response.data.post : post
                    )
                );

                // ✅ Clear the comment input field
                setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        const token = JSON.parse(sessionStorage.getItem("accessToken"));
        if (!token) {
            console.error("User not logged in");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("userId", auth.user._id);
        formData.append("userName", auth.user.userName);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/posts`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });


            toast({
                title: "Post Created successfully!",
                description: "Your post has been created successfully ",
                position: "top-right"
            })


            setPosts([res.data, ...posts]);
            setTitle("");
            setContent("");
            setSelectedFile(null);
            setPreview(null);
        } catch (error) {
            console.error("Error creating post:", error.response?.data || error.message);
            toast({
                title: "Something went wrong!",
                description: "Error while uploading a post please check your connection ",
                variant: "destructive",
                position: "top-right"
            })
        }
    };

    console.log(posts)


    return (

        <div className="max-w-2xl mx-auto mt-20 p-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-500 hover:bg-blue-600">
                        <Plus className="text-white" size={28} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <h2 className="text-xl font-semibold mb-3">Create a Post</h2>
                    <form className="space-y-2" onSubmit={handlePostSubmit} encType="multipart/form-data">
                        <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <Textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} required />
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview && <img src={preview} alt="Preview" className="w-full max-h-60 object-cover rounded-lg mt-2" />}
                        <Button type="submit" className="w-full mt-2">Post</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {posts.map((post) => {
                const isLiked = post.likes.includes(auth?.user?._id);
                const isExpanded = expandedComments[post?._id] || false;
                const visibleComments = isExpanded ? post?.comments : post.comments?.slice(0, 2);

                return (
                    <Card key={post._id} className="mb-4 p-4 shadow-md">
                        <CardContent>


                            <div className="flex items-center gap-2">
                                {
                                    post?.userProfileImage ?
                                        <img src={post?.userProfileImage}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full cursor-pointer"
                                        /> :
                                        <User className="w-6 h-6 rounded-full cursor-pointer" />
                                }

                                <h3 className="text-lg font-semibold">{post.userName}</h3>
                            </div>


                            <h2 className="text-xl font-bold">{post.title}</h2>
                            <p className="text-gray-600">{post.content}</p>
                            {post.imageUrl && <img src={`${import.meta.env.VITE_SERVER_URL}/${post.imageUrl}`} alt="Post" className="w-full max-h-80 object-cover rounded-lg my-2" />}

                            <div className="flex items-center gap-4 mt-2">
                                <button onClick={() => handleLike(post._id)} className="flex items-center gap-1">
                                    <Heart className={isLiked ? "text-red-500" : "text-gray-500"} size={20} fill={isLiked ? "red" : "none"} />
                                    {post.likes.length}
                                </button>
                                <button className="flex items-center gap-1">
                                    <MessageCircle size={20} /> {post.comments.length}
                                </button>
                            </div>

                            <div className="mt-2" >
                                <h4 className="font-medium">Comments</h4>
                                {visibleComments?.map((comment, index) => (
                                    <p key={comment?._id || `comment-${index}`} className="text-sm bg-gray-100 p-2 rounded-lg my-1">
                                        <strong>{comment?.userName}:</strong> {comment?.text}
                                    </p>
                                ))}
                                {post.comments.length > 2 && (
                                    <button className="text-blue-500 flex items-center mt-2" onClick={() => setExpandedComments((prev) => ({ ...prev, [post._id]: !isExpanded }))}>
                                        {isExpanded ? "Show Less" : "Show More"} {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                )}
                                <Input placeholder="Write a comment..." value={commentTexts[post._id] || ""} onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)} className="mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>



    );
};

export default Community;





