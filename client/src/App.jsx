import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Footer } from "./components/Footer/Footer";
import { Login } from "./components/Login/Login";
import { SignUp } from "./components/SignUp/SignUp";
import { Home } from "./components/Home/Home";

const footerData = [
    { title: "Section 1", links: ["Link A", "Link B", "Link C"] },
    { title: "Section 2", links: ["Link D", "Link E", "Link F"] },
    { title: "Section 3", links: ["Link G", "Link H", "Link I"] },
    { title: "Section 4", links: ["Link J", "Link K", "Link L"] },
];

function App() {
    return (
        <Layout footer={<Footer sections={footerData} />}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Layout>
    );
}

export default App;
