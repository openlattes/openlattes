# openlattes
Web application to visualize scientific production indicators and coauthorship networks. The data comes from the Lattes curriculum using [this extraction tool](https://github.com/openlattes/extract).

Stack: GraphQL, MongoDB, React, Material-UI and Semiotic.

### Environment setup
```
$ npm i
$ cp .env-template .env
```
Update `.env` with required information.

### Running for development

```
$ npm start
```

### Running for production
```
$ npm run build
$ npm run now-start
```
