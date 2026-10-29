# VerlynTech website

Plain static site (HTML, CSS, a little JS). No build step. Everything that gets published lives in `public/`.

```
public/
  index.html, services/, process/, why-verlyn/, industries/, contact/   main pages
  services/<name>/index.html   one page per service (crm, pages-seo, paid-ads, lead-gen, agentic-ai, automation)
  privacy/, terms/, thanks/, 404.html                                    supporting pages
  assets/styles.css, main.js (theme toggle, page transition, count-up), analytics.js, sprite.svg
  fonts/                       self-hosted Archivo + IBM Plex Mono
  favicon.svg, apple-touch-icon.png, og.png, robots.txt, sitemap.xml
netlify.toml                   publish folder + security headers
```

## Deploy: GitHub, then Netlify

1. Create an empty repo on GitHub (for example `verlyn-tech-site`, private is fine).
2. Push this folder to it:
   ```
   cd verlyn-tech-site
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/verlyn-tech-site.git
   git push -u origin main
   ```
   (No git on your machine? On the empty repo page choose "uploading an existing file" and drag the folder contents in.)
3. On netlify.com: **Add new site → Import an existing project → GitHub**, pick the repo.
4. Leave build command empty. The publish directory is read from `netlify.toml` (`public`). Click **Deploy**.
5. Every `git push` to `main` now redeploys automatically.

## After the first deploy

- **Domain:** Site configuration → Domain management → Add a domain → `verlyntech.com`. Follow the DNS instructions, then enable HTTPS.
- **Form emails:** the enquiry form is handled by Netlify Forms. Open Forms → `contact` → Settings & notifications → add an email notification so submissions reach your inbox. Free plan allows 100 submissions a month.
- **Test the form** once on the live site and confirm you land on `/thanks/` and receive the email.
- **Search Console:** add `verlyntech.com` as a Domain property, then submit `https://verlyntech.com/sitemap.xml`.

## Things to edit

| What | Where |
| --- | --- |
| Email address (currently `verlyntech@gmail.com`) | search the project for it: contact page, privacy, terms, JSON-LD in `index.html` |
| Analytics | `public/assets/analytics.js`, top of the file: set `GA_ID` or `PLAUSIBLE_SRC` |
| Company legal name and trade licence number | footer comment `TODO` in each page (add a visible line when you have them) |
| Page titles and descriptions | `<head>` of each page |
| Privacy policy and terms | `public/privacy/index.html`, `public/terms/index.html`. These are starter texts: have them reviewed |
| Nav or footer changes | the same header/footer block is repeated in every HTML file, so edit all of them (or search and replace) |
| Service wording | each `services/<name>/index.html` holds its own text. The diagram of six services is repeated on `services/index.html` and on every service page, so a new service or a rename means editing all seven |
| Colours | the `:root` variables at the top of `assets/styles.css` (light) and the two dark blocks right below them |

## Adding a page

Copy an existing folder (e.g. `process/`), edit `index.html`, add its URL to `public/sitemap.xml` and a nav link in each page.
