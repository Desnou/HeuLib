import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/post/getPosts");
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPosts();
    }, []);
    return (
        <div>
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold lg:text-6xl">
                    Bienvenido a Heuristics Lib
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm">
                Nuestra plataforma está diseñada para facilitar el acceso a conjuntos de heurísticas de usabilidad y experiencia del usuario adaptados a diferentes dominios. Aquí encontrarás una base de datos centralizada y constantemente actualizada que te permitirá buscar, categorizar y seleccionar heurísticas específicas para tus proyectos. Ya seas un profesional o estudiante en el campo de la usabilidad, nuestra herramienta te ayudará a simplificar el proceso de evaluación, ofreciéndote recursos organizados y funcionales en un solo lugar. ¡Descubre una nueva forma de potenciar tus evaluaciones de usabilidad!
                </p>
                <Link
                    to="/search"
                    className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
                >
                    Ver todas las publicaciones
                </Link>
            </div>
            <div className="p-3 bg-amber-100">
                <CallToAction />
            </div>
            <div className="max-w-6xl mx-auto p-3 py-7 min-h-screen">
                {posts && posts.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold text-center mb-6">
                            Publicaciones recientes
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link to={'/search'} className="text-center text-lg text-teal-500 hover:underline">
                            Ver todas las publicaciones
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
