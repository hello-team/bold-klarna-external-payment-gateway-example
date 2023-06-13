# External Payment Gateway Connector API Example

This example application provides a starting point for integrating an external payment gateway with Bold Checkout using the External Payment Gateway Connector API. It demonstrates the implementation of key functionalities such as authentication for both our plugin API and the Bold v2 API, authentication for Klarna, a bundled client-side widget, and a placeholder controller for the External Payment Gateway.


## Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

## Getting Started

1. Create a Plugin: Follow the documentation [here](https://developer.boldcommerce.com/guides/checkout/concepts/plugins#public-and-private-plugins) to create a Plugin for your integration.

2. Generate Client ID & Secret: Refer to the documentation [here](https://developer.boldcommerce.com/guides/getting-started/public-integrations#bold-developer-dashboard-account) to generate a client ID and secret for the v2 API.


3. Clone the repository:


4. Install dependencies: `npm install`


5. Configure the Application:

   - Open the `config.js` file and update the configuration values according to your setup. Add your external payment gateway credentials, URLs, and any other required information.

6. Run the Application: `npm start`


The application will start on http://localhost:3000.

## API Endpoints

The following API endpoints are available:

- `POST /gateway/retain` - Converts a token received from the Checkout Frontend Create Payment endpoint into a permanent reference used for payment processing.
- `POST /gateway/auth` - Authorizes a payment of a specific value.
- `POST /gateway/capture` - Captures a specific payment amount less than or equal to the authorization amount.
- `POST /gateway/void` - Cancels the payment authorization before capture.
- `POST /gateway/refund` - Refunds a specific amount against a previously successful capture.
- `GET /oauth/plugin/authorize` - Authorizes the plugin installation and redirects to `/oauth/init`.
- `GET /oauth/plugin` - Initializes the plugin installation process and redirects to the v2 /oauth/init API URL.
- `GET /oauth/init` - Initializes the OAuth process for installing the v2 api.
- `GET /oauth/authorize` - Handles the OAuth authorization callback and redirects to the Bold v2 API.
- `GET /widget` - Renders the Klarna buy button to be sent to the iframe during the POST request to `/:shop_slug/create/external-payment`, which is loaded on the checkout frontend.
- `POST /:shop_slug/create/external-payment` - Creates an external payment in the Klarna gateway.
- `POST /cashier/events` - Handles the checkout plugin events and actions.

Please refer to the API documentation for detailed information on the request and response formats for each endpoint.

## Client-side Widget

The client-side widget is built using React and is located in the `client` directory. It provides a user interface for interacting with the external payment gateway. To use the widget, follow these steps:

1. Build the React Widget:
`cd client`
`npm install`
`npm run build`
`cd ..`
`cp -R client/build src/public`


2. The React widget is now included in the application and will be served from the `/public` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

This example application was built using [Express.js](https://expressjs.com/), a fast, unopinionated, and minimalist web framework for Node.js. The client-side widget is built using [React](https://reactjs.org/), a JavaScript library for building user interfaces.


