# External Payment Gateway Connector API Example

This example application provides a starting point for integrating an external payment gateway with Bold Checkout using the External Payment Gateway Connector API. It demonstrates the implementation of key functionalities such as authentication for both our plugin API and the Bold v2 API, authentication for Klarna, a bundled client-side widget, and a placeholder controller for the External Payment Gateway.

This application serves as a working POC that showcases a current single happy path checkout flow. It demonstrates how an external payment gateway can be integrated into the Bold Checkout experience, allowing customers to complete their purchases using the configured payment gateway.


## Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

## Getting Started

1. Create a Plugin: Follow the documentation [here](https://developer.boldcommerce.com/guides/checkout/concepts/plugins#public-and-private-plugins) to create a Plugin for your integration.

2. Generate Client ID & Secret: Refer to the documentation [here](https://developer.boldcommerce.com/guides/getting-started/public-integrations#bold-developer-dashboard-account) to generate a client ID and secret for the v2 API.

3. Clone the repository.

4. Install dependencies: `npm install`

5. Configure the Application:
   - Open the `config.js` file and update the configuration values according to your setup. Add your external payment gateway credentials, URLs, and any other required information.

6. Run the Application: `npm start`

The application will start on http://localhost:3000.

## API Endpoints

The following API endpoints are available:
- `POST /payments/retain` - Converts a token received from the Checkout Frontend Create Payment endpoint into a permanent reference used for payment processing.
- `POST /payments/auth` - Authorizes a payment of a specific value.
- `POST /payments/capture` - Captures a specific payment amount less than or equal to the authorization amount.
- `POST /payments/void` - Cancels the payment authorization before capture.
- `POST /payments/refund` - Refunds a specific amount against a previously successful capture.
- `GET /oauth/plugin/authorize` - Authorizes the plugin installation and redirects to `/oauth/init`.
- `GET /oauth/plugin` - Initializes the plugin installation process and redirects to the v2 /oauth/init API URL.
- `GET /oauth/init` - Initializes the OAuth process for installing the v2 API.
- `GET /oauth/authorize` - Handles the OAuth authorization callback and redirects to the Bold v2 API.
- `GET /widget` - Renders the Klarna buy button to be sent to the iframe during the POST request to `/:shop_slug/create/external-payment`, which is loaded on the checkout frontend.
- `POST /:shop_slug/create/external-payment` - Creates an external payment in the Klarna gateway.
- `POST /cashier/events` - Handles the checkout plugin events and actions.

Please refer to the API documentation for detailed information on the request and response formats for each endpoint.

## Client-side Widget

The client-side widget is built using React and is located in the `client` directory. It provides a user interface for interacting with the external payment gateway.

### Development Mode

To start the client-side widget development server, run the following command:

`npm run start:dev`


This command will start the client-side development server on http://localhost:3000. It enables hot-reloading, allowing you to make changes to the client-side code and see the updates in real-time.

The development server is configured to proxy requests to the server running on http://localhost:9000. This ensures that the client-side widget can communicate with the server during development.

### Production Build

To build the client-side widget for production, run the following command:

`npm run build:client`
`npm run start`

This command will create a production-ready build of the client-side widget in the `client/build` directory. The build output can then be served from the server.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

This example application was built using [Express.js](https://expressjs.com/), a fast, unopinionated, and minimalist web framework for Node.js. The client-side widget is built using [React](https://reactjs.org/), a JavaScript library for building user interfaces.

Please note that the formatting might differ based on the rendering environment.
