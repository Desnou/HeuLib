import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SuggestedPostPage() {
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getsuggestedposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const fetchedPost = data.suggestedposts.find(post => post.slug === postSlug);
        if (!fetchedPost || !fetchedPost.isSuggested || !currentUser.isAdmin) {
          navigate("/"); // Redirigir a home si el post no es sugerido o el usuario no es admin
          return;
        }
        setPost(fetchedPost);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchPost();
    }
  }, [postSlug, currentUser, navigate]);

  const handleAcceptPost = async () => {
    try {
      const res = await fetch(`/api/post/acceptsuggestedpost/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/post/deletesuggestedpost/${post._id}/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        navigate("/dashboard?tab=suggested-posts");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
      <h2 className="text-xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-2xl">
        Estas revisando una publicación sugerida
      </h2>
      <h1 className="text-3xl mt-2 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
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
    <div className="border-t border-slate-500 mt-10"></div>
      
      <div className="flex justify-center gap-4 mt-10">
        <Button color="failure" onClick={handleDeletePost}>
          Rechazar publicación
        </Button>
        <Button color="success" onClick={handleAcceptPost}>
          Aceptar publicación
        </Button>
      </div>
    </main>
  );
}