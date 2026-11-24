# Divine Nwachukwu — Student Portfolio

A responsive five-page portfolio and academic management website for Divine Ikechukwu Nwachukwu, a B.Sc. Data Science student at MIVA Open University.

## Pages

- **Home** (`index.html`): introduction, portrait placeholder, interests, and a sample video.
- **About** (`about.html`): biography, education, aspirations, hobbies, and a technical-skills table.
- **Projects** (`projects.html`): three clearly labelled sample project concepts.
- **Academic Planner** (`planner.html`): add tasks, choose deadlines and priorities, mark tasks complete, filter, and delete. Tasks are saved in this browser with `localStorage`.
- **Contact** (`contact.html`): validates name, email, optional phone number, and message in the browser. The demo does not transmit or store form details.

## Run locally

Open `index.html` in a modern browser. No build step or package installation is required. The Google Fonts and short sample video require an internet connection; the site layout and illustrations are local.

## Personalise before publishing

1. Replace `assets/profile-placeholder.svg` with a photograph you have permission to publish, then update the portrait image paths in `index.html` and `about.html`.
2. Update the placeholder contact/location copy and, if desired, connect the contact form to a trusted form service or a server endpoint. Do not publish private contact details without considering your privacy.
3. Replace sample project illustrations or descriptions as your own work becomes available. The project cards are intentionally labelled as concepts.
4. The home-page video uses the public sample video hosted by MDN; replace it with a relevant video you have permission to use if desired.

## GitHub Pages deployment

1. Create a GitHub repository and upload the contents of this project to its root (including `index.html` and the `assets` folder).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select your publishing branch (usually `main`) and the `/ (root)` folder, then save.
4. Wait for the Pages deployment to finish and open the URL shown in the Pages settings.

The site uses relative asset and page links, so it works from a GitHub Pages project subpath as well as a custom domain. No build workflow is needed.
