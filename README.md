# finnish-corona-statistics
A repo for a basic site displaying some basic COVID-19 statistics in finland

Previously Hosted at https://corona.matsu.fi . Now discontinued

Use as you wish


Technology used:

- Lit Element
- ChartJS
- Webpack
- DayJS
- Node-Fetch


### Running the environment

Navigate to the root of the project, and run `./run-server.sh`

This will initiate a custom script running ES dev server and Webpack.


### Fetching latest information from the API

Due to the request of the API host, data will not be fetched every time a user visits the site, but every hour using a cron job.

To manually fetch corona data, navigate to `/data-gatherer` and run `node data-gatherer.js`.

A `corona-data.json` -object will appear in the root of the project, which the frontend will read.
