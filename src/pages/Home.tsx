import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home-page">
      <header className="home-header">
        <p className="eyebrow">Tennis Gazelle</p>
        <h1>Static viewers</h1>
        <p>Small, interactive maps for stories, scores, and strange structures.</p>
      </header>

      <nav className="viewer-list" aria-label="Viewers and related projects">
        <Link to="/star-wars-musical-themes">
          <span>Star Wars musical themes</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link to="/oppenheimer-plot-map">
          <span>Oppenheimer plot map</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <a href="https://www.whatsinmycookiejar.com" target="_blank" rel="noreferrer">
          <span>What's in My Cookie Jar?</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </nav>
    </main>
  )
}

export default Home
