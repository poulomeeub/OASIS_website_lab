# OASIS Lab website

Static site for the OASIS Lab, University at Buffalo. Eight pages share `styles.css` and `site.js`.

## Deploy on GitHub Pages
1. Upload everything in this folder (including the hidden `.nojekyll` file) to the root of a GitHub repository.
2. Settings > Pages > Deploy from a branch > `main` / `(root)` > Save.
3. Live at `https://<username>.github.io/<repo>/` in a minute or two.

## Editing
- News cards: edit the `<article class="slide">` blocks in `news.html` (and the "Latest news" slider in `index.html`).
- Theme colors: the `:root` block at the top of `styles.css`.
- Team and director photos load from oasis.eng.buffalo.edu. To host them here instead, save them in `images/` and update the `src` paths.
