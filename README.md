# PDF Viewer

This app uses PDF.js locally to display PDF files from the shared account
mirror. It has page and zoom controls, loads only when opened, makes no external
requests, and destroys its worker on close. It does not download files to the PC.
Choose **Open from My files**, then use Previous, Next and the zoom controls.
The page fits the window when its width changes. If the saved PDF changes or is removed, a notice stays visible while paging; select Reload to check the server and open the current account copy. If the server check or reload fails, the displayed page stays available. Sync can also report conflicts that must be resolved in Files. Reload is disabled for an unsaved preview. The viewer checks file metadata rather than rereading the PDF on unrelated file activity. If another PDF cannot open,
the current one stays available. Selectable PDF text is layered over the page. Find text searches the document locally and highlights each selected match; Find next and Find previous move between occurrences on a page and across pages, wrapping around the document. The status gives the selected match count on its page. Search is a case-insensitive literal substring, without OCR or fuzzy matching, and scanned images without embedded text cannot be searched or selected. Annotations, forms and PDF editing are not currently supported.
Run `npm ci --prefix apps/system/pdf-viewer --ignore-scripts` before building.

PDF.js handles rendering and text extraction in the browser. Large documents may take time to search; changing the query or document cancels the old search. The window releases its render and text-layer tasks and worker when closed.

If multiple open or reload requests overlap, a later choice takes precedence;
cancelling the picker keeps the current page. Local desktop, emulated-phone and
4K-sized tests and a live emulated-phone test delay mocked picker results to
check ordering. A separate live emulated-phone test exercises the actual picker.
