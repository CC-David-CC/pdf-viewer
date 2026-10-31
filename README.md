# PDF Viewer

This app uses PDF.js locally to display PDF files from the shared account
mirror. It has page and zoom controls, loads only when opened, makes no external
requests, and destroys its worker on close. It does not download files to the PC.
Choose **Open from My files**, then use Previous, Next and the zoom controls.
The page fits the window when its width changes. If another PDF cannot open,
the current one stays available. Pages are rendered as images: text selection,
search, annotations and PDF editing are not currently supported.
Run `npm ci --prefix apps/system/pdf-viewer --ignore-scripts` before building.
