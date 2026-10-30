# PDF Viewer

This app uses PDF.js locally to display PDF files from the shared account
mirror. It has page and zoom controls, loads only when opened, makes no external
requests, and destroys its worker on close. It does not download files to the PC.
Run `npm ci --prefix apps/system/pdf-viewer --ignore-scripts` before building.
