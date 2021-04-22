Install packages `npm i`. You may get some errors while installing, but app has been tested to work on 7.2.2021

To start the mock backend run command 
`npm run mockserver`

To start the development frontend server run command 
`npm run devserver`

To watch file changes and build automatically: `npm run watch`

Open localhost:9081 -> Ready to develop.
Use the provided `src/index.html`, `src/index.js` and `src/style.scss` as base or start from scratch.

The mock backend will serve static files from ./dist and it has an API end-point `http://localhost:9080/api/solr/:page`
The API gives valid responses with page numbers 0, 1, and 2.
The attributes of interest on the response are:
- response.numFound
- response.docs[].content_type
- response.docs[].content_date
- response.docs[].title_original
- response.docs[].site_id
- response.docs[].author
- response.docs[].img_url
- response.docs[].id

No frameworks (react etc.) are allowed. New npm packages are allowed if well justified.

There should not be a page reload when listing style or page is changed.
All views should be bookmarkable. Page should be responsive and accessible.
 
ScreenShots directory contains mockups of the wanted page layouts, no 'pixel perfection' is required.
All data that is visible in the mockups should be visible in the page.  

*note.* desktop1.PNG has a control with a label 'Näytä tuloksia sivulla', its implementation is not expected.

### Testing:
Check package.json scripts for existing smoke and unit tests.
Make sure that these tests succeed.
