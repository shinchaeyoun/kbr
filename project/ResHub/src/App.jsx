import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

// pages
import Main from "./pages/Main.jsx";
import Write from "./pages/Write.jsx";
import SampleWrite from "./pages/SampleWrite.jsx";
import Item from "./pages/Item.jsx";
import List from "./pages/List.jsx";
import Sample from "./pages/SamplePage.jsx";
import Search from "./pages/SearchPage.jsx";
import SampleDetail from "./pages/SampleDetailPage.jsx";

// components
import Footer from "./components/Footer.jsx";
import SearchEmptyPage from "./components/SearchEmptyPage.jsx";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="list" element={<List />} />
            <Route path="sample" element={<Sample />} />
            <Route path="sample/detail" element={<SampleDetail />} />
            <Route path="search/empty" element={<SearchEmptyPage />} />
          </Route>

          <Route path="sample/write" element={<SampleWrite />} />
          <Route path="/write" element={<Write />} />
          <Route path="/detail" element={<Item />} />
          <Route path="/edit" element={<Write />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </QueryClientProvider>
    </>
  );
}

export default App;
