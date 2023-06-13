import express from 'express';
import createError from 'http-errors';
import bodyParser from 'body-parser';
import KlarnaEvents from './controllers/PluginIndex';
import AuthToken from './services/bold/Auth';
import PluginAuthToken from './services/plugin/Auth';
import ExternalPaymentGateways from './services/bold/ExternalPayments';
import database from './database/Connect';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import ExampleController from './controllers/klarna/ExampleController';

import { CHECKOUT_API_URL, PLUGIN_CLIENT_ID, PLUGIN_CLIENT_SECRET, PORT } from './constants';

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// This line tells express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Start the server and connect to the database
async function start() {
  try {
    await database.getConnection();
    console.log('Connected to MySQL database');

    const port = PORT;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    process.exit(1);
  }
}

// App initialization
async function initializeApp() {
  // Perform other app startup tasks...
  await start();
  // Perform other app startup tasks...
}

initializeApp().catch((error) => {
  console.error('Failed to initialize the app:', error);
  process.exit(1);
});

app.get('/widget', async (req, res) => {
  try {
    const indexFile = await fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8');
    res.send(indexFile);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Routes
app.get('/hello', async (req, res) => {
  res.send("hello");
});

app.post('/cashier/events', async (req, res) => {
  const cashier = new KlarnaEvents();
  const data: any = await cashier.cashierEvents(req);
  res.send(data);
});

app.post('/:shop_slug/create/external-payment', async (req, res) => {
  const externalPayment = new ExternalPaymentGateways();
  const data = await externalPayment.createExternalPaymentGateway(req.params.shop_slug, {
    "name": "Klarna",
    "base_url": `${process.env.APP_URL}`,
    "iframe_url": `${process.env.APP_URL}/widget`,
    "target_div": "klarna-div",
    "api_token": "XjqnSQWYAZXt",
    "partial_capture": false,
    "additional_order_details": true,
    "provider_id": "8ad85ccf-7fd6-4f4b-a1a2-dff42fb3e228",
    "currency": "USD"
  });
  res.send(data);
});

app.post('/gateway/retain', (req, res) => {
  const exampleController = new ExampleController();
  exampleController.generateRetainedPaymentToken(req, res);
});

app.post('/gateway/auth', (req, res) => {
  const exampleController = new ExampleController();
  exampleController.authorizePayment(req, res);
});

app.post('/gateway/capture', (req, res) => {
  const exampleController = new ExampleController();
  exampleController.capturePayment(req, res);
});

app.post('/gateway/void', (req, res) => {
  const exampleController = new ExampleController();
  exampleController.voidPayment(req, res);
});

app.post('/gateway/refund', (req, res) => {
  const exampleController = new ExampleController();
  exampleController.refundPayment(req, res);
});


app.get('/oauth/init', async (req, res) => {
  try {
    const v2Auth = new AuthToken();
    const data: any = await v2Auth.install();
    if (data.uri) {
      console.log(data.uri);
      res.redirect(data.uri);
    }
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.get('/oauth/authorize', async (req, res) => {
  try {
    const body = {
      code: req.query.code,
      grant_type: 'authorization_code',
    };
    const v2Auth = new AuthToken();
    const data: any = await v2Auth.init(body);
    console.log(data);
    const platform = data.platform_slug;
    const shop = data.shop_domain;
    res.redirect(`${CHECKOUT_API_URL}/admin/${platform}/${shop}/marketplace`);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.get('/oauth/plugin/authorize', async (req, res) => {
  try {
    const pluginAuth = new PluginAuthToken();
    const platform = req.query.platform;
    const shop = req.query.shop;
    const code = req.query.code;
    if (!code || !platform || !shop) {
      res.status(400).send('Error: "shop" is required');
      return;
    }
    const body = {
      platform: platform,
      shop: shop,
      code: code,
      client_id: PLUGIN_CLIENT_ID,
      client_secret: PLUGIN_CLIENT_SECRET,
      grant_type: 'authorization_code',
    };
    const data = await pluginAuth.init(body);
    console.log(data);
    res.redirect('/oauth/init');
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.get('/oauth/plugin', async (req, res) => {
  try {
    const pluginAuth = new PluginAuthToken();
    const platform = req.query.platform as string;
    const shop = req.query.shop;
    const data: any = await pluginAuth.install(platform, shop);
    console.log(data);
    if (data.uri) {
      res.redirect(data.uri);
    } else {
      res.status(400).send('Error: "shop" is required');
    }
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.post('/oauth/uninstall', async (req, res) => {
  const platform = req.body.platform;
  const shop = req.body.shop;

  // TODO: Mark shop as uninstalled in the database

  res.send(`${shop} has been uninstalled`);
});

// 404 route
app.use(function (req, res) {
  res.json(createError(404));
});
