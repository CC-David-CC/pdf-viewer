# PDF Viewer

This app uses PDF.js locally to display PDF files from the shared account
mirror. It has page and zoom controls, loads only when opened, makes no external
requests, and destroys its worker on close. It does not download files to the PC.
Choose **Open from My files**, then use Previous, Next and the zoom controls.
The page fits the window when its width changes. If the saved PDF changes or is removed, a notice stays visible while paging; select Reload to check the server and open the current account copy. If the server check or reload fails, the displayed page stays available. Sync can also report conflicts that must be resolved in Files. Reload is disabled for an unsaved preview. The viewer checks file metadata rather than rereading the PDF on unrelated file activity. If another PDF cannot open,
the current one stays available. Selectable PDF text is layered over the page. Find text searches the document locally and highlights each selected match; Find next and Find previous move between occurrences on a page and across pages, wrapping around the document. The status gives the selected match count on its page. Search is case-insensitive and literal except that query whitespace matches runs of whitespace, including a line break. PDF text extraction order affects results; there is no OCR or fuzzy matching, and scanned images without embedded text cannot be searched or selected. Annotations, forms and PDF editing are not currently supported.
Run `npm ci --prefix apps/system/pdf-viewer --ignore-scripts` before building.

Use the page number field and **Go** to jump directly to a page in a long
document. The viewer rejects numbers outside the document and keeps the current
page open. Previous, Next and search update the displayed page number.
Previous, Next and Go start at the top of the selected page and clear any earlier search result; Find scrolls to
the selected match. Local tests cover rendered multi-page PDFs at desktop,
emulated-phone and 4K sizes; physical touch has not been verified.

PDF.js handles rendering and text extraction in the browser. Large documents may take time to search; changing the query or document cancels the old search. The window releases its render and text-layer tasks and worker when closed.

If multiple open or reload requests overlap, a later choice takes precedence;
cancelling the picker keeps the current page. Local desktop, emulated-phone and
4K-sized tests and a live emulated-phone test delay mocked picker results to
check ordering. A separate live emulated-phone test exercises the actual picker.

File-change checks are ordered so a slower earlier check cannot clear a newer
warning. Local desktop and emulated-phone account tests cover delayed metadata,
changes, deletion and reload; physical touch remains unverified.

Before replacing the current document, the viewer checks that the new PDF’s
first page fits its display limit. An oversized first page leaves the prior
document and navigation available. Later pages can still exceed the limit.

A later page is checked before navigation changes the displayed page number. If it exceeds the display limit, the previous page stays visible and navigation remains available. Local desktop and emulated-phone tests and a live emulated-phone test cover an oversized later page. Other rendering failures and physical touch remain unverified.

Pages are drawn offscreen before replacing the visible page. When a later page
fails to render, the previous page and page number remain available. Opening a
new PDF also renders its first page before replacing the current document;
if that render fails, the current document remains open. If a search match cannot be rendered, the viewer reports that instead of claiming the match is visible. Local desktop and
emulated-phone account tests inject canvas-render failures and verify recovery.
Other render failures and physical touch remain unverified.

If a window’s initial PDF is invalid or missing, the failed file reference is cleared and the viewer offers to open another file. The original file remains unchanged. Local desktop/phone and live phone-sized account tests cover invalid-file fallback, opening another PDF and refresh.
