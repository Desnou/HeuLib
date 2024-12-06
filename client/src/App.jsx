import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import CustomHeader from "./components/CustomHeader";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import SuggestedPostPage from "./pages/SuggestedPostPage"; // Importa el componente SuggestedPostPage
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import DashSuggestPost from "./components/DashSuggestPost";
import DashSuggestedPost from "./components/DashSuggestedPost";
import DashPosts from "./components/DashPosts";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <CustomHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path='/search' element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/suggest-post" element={<DashSuggestPost />} />
                </Route>
                <Route element={<PrivateRouteAdmin />}>
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:postId" element={<UpdatePost />} />
                    <Route path="/dashboard/suggested-posts" element={<DashSuggestedPost />} />
                    <Route path="/dashboard/posts" element={<DashPosts />} />
                    <Route path="/suggested-post/:postSlug" element={<SuggestedPostPage />} /> {/* Añade la ruta para SuggestedPostPage */}
                </Route>
                <Route path="/post/:postSlug" element={<PostPage />} />
            </Routes>
        </BrowserRouter>
    );
}