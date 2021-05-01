# Automated_Test_JS
I used chai, mocha, babel, supertest for this test.
So you have to install those library.

```
npm i --save-dev supertest mocha chai @babel/cli @babel/core @babel/node @babel/register @babel/preset-env
npm install chai-strings chai-like chai-things --save-dev

```

Package.json should be like:

```
"scripts": {
    "test": "mocha --timeout 5000",
    "test-html": "mocha --timeout 5000 --reporter mochawesome"
  }

```
