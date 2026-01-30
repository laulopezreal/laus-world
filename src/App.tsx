import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Note } from './pages/Note';
import { Tags } from './pages/Tags';
import { TagDetail } from './pages/TagDetail';
import { Search } from './pages/Search';
import { Graph } from './pages/Graph';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note/:slug" element={<Note />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/tags/:tag" element={<TagDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/graph" element={<Graph />} />
      </Routes>
    </Layout>
  );
}
