# Clipboard Test 

Small project to test the clipboard API.

## Run

The project uses [vite](https://vitejs.dev/) to build and run the project. 

Type the following command to start the development server:

```bash
npx vite
```

Please check the Javascript console of your browser for possible error messages.

### SSL

To use the Clipboard API, the page must be in a secure context, i.e. SSL must be activated. The project uses Vite's vite-plugin-mkcert package to enable https. 

When you run the local vite dev server you may be prompted for your password the first time. It will then install a local certificate onto your system.


