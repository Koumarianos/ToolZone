import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import About from '../pages/About'
import ToolPage from '../pages/ToolPage'
import ShortRedirect from '../pages/ShortRedirect'

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="tools/:slug" element={<ToolPage />} />
        <Route path="s/:id" element={<ShortRedirect />} />
      </Route>
      <Route path="*" element={<Layout />} />
    </Routes>
  )
}

export default Router
