import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";

export default function PostPage() {
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          const fetchedPost = data.posts[0];
          if (fetchedPost.isSuggested && !currentUser.isAdmin) {
            navigate("/"); // Redirigir a home si el post es sugerido y el usuario no es admin
            return;
          }
          setPost(fetchedPost);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, currentUser, navigate]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error al cargar la publicación</p>
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <div className="flex flex-wrap justify-center border-b border-slate-500">
        {post &&
          post.domains.split(",").map((cat, index) => (
            <Link
              key={index}
              to={`/search?domains=${cat.trim()}`}
              className="mt-5 mb-5 mx-1"
            >
              <Button key={index} color="gray" pill size="xs">
                {cat.trim()}
              </Button>
            </Link>
          ))}
      </div>
      <div className="flex justify-center gap-2 p-2">
        <span className="font-semibold text-lg text-gray-700">
          Autor(es) :{" "}
        </span>
        {post &&
          post.author.split(",").map((author, index, array) => (
            <span key={index}>
              <Link
                to={`/search?author=${author.trim()}`}
                className="font-bold text-lg hover:underline italic"
              >
                {author.trim()}
              </Link>
              {index < array.length - 1 && ", "}
            </span>
          ))}
      </div>
      <div className="flex justify-center gap-2 p-2">
        <span className="font-semibold text-xs text-gray-700">
          Publicación de origen o DOI:{" "}
        </span>
        {post &&
          post.doi.split(",").map((doi, index) => (
            <a
              key={index}
              href={doi.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-xs hover:underline italic text-blue-600"
            >
              {`${doi.trim()}`}
            </a>
          ))}
      </div>
      <div className="flex gap-4 justify-center p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span className="font-semibold text-xs text-gray-700">
          Cantidad de heurísticas:&nbsp;&nbsp;
          {post && post.heuristicNumber}
        </span>
        <span className="font-semibold text-xs text-gray-700">
          Validación:&nbsp;&nbsp;{post && post.hasValidation}
        </span>
      </div>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} minutos de lectura
        </span>
      </div>

      <div className="p-3 max-w-2xl mx-auto w-full post-content">
        <h2 className="text-2xl font-semibold mb-4">Listado de Heurísticas</h2>
        <div className="content ql-editor"
          dangerouslySetInnerHTML={{ __html: post && post.heuristicList }} />
      </div>
      <div className="p-3 max-w-2xl mx-auto w-full post-content">
        <h2 className="text-2xl font-semibold mb-4">Descripción del conjunto</h2>
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: post && post.content }} />
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection
        postId={post._id}
        slugPost={post.slug}
        titlePost={post.title}
      />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Publicaciones Recientes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}