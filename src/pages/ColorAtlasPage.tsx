import { Link } from 'react-router-dom'
import ColorAtlas from '../components/ColorAtlas'

function ColorAtlasPage() {
  return (
    <main className="viewer-page color-atlas-page">
      <header className="viewer-hero color-atlas-hero">
        <Link className="back-link" to="/">← All viewers</Link>
        <p className="eyebrow">Named color space</p>\n        <h1>Color Atlas</h1>\n        <p className="viewer-deck">Every name humans gave the spectrum.</p>\n        <p className="color-atlas-question">How many words is this color worth?</p>
      </header>
      <ColorAtlas />
    </main>
  )
}

export default ColorAtlasPage
