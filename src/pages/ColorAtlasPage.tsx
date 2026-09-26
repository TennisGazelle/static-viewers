import { Link } from 'react-router-dom'
import ColorAtlas from '../components/ColorAtlas'

function ColorAtlasPage() {
  return (
    <main className="viewer-page color-atlas-page">
      <header className="viewer-hero color-atlas-hero">
        <Link className="back-link" to="/">← All viewers</Link>
        <p className="eyebrow">Color atlas</p>
        <h1>Every name humans gave the spectrum.</h1>
        <p className="viewer-deck">
          Explore named colors as points in mathematical color spaces. The same
          color can carry many names, and the same name can land in many places.
        </p>
      </header>
      <ColorAtlas />
    </main>
  )
}

export default ColorAtlasPage
