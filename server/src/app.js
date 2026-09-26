import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ENV } from './env.js';
import { healthRouter } from './routes/health.route.js';
import { catalogRouter } from './routes/catalog.route.js';
import { pricingRouter } from './routes/pricing.route.js';
import { ordersRouter } from './routes/orders.route.js';
import { uploadsRouter } from './routes/uploads.route.js';
import { adminAuthRouter } from './routes/adminAuth.route.js';
import { adminPricingRouter } from './routes/adminPricing.route.js';
import { adminOrdersRouter } from './routes/adminOrders.route.js';
import { notFoundMiddleware } from './middleware/notFound.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: ENV.allowedOrigins.length ? ENV.allowedOrigins : false,
      credentials: true
    })
  );
  app.use(morgan(ENV.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Routes are mounted at the path API_CONTRACT.md names directly
  // (/catalog, /pricing, /orders, ...). Point the front end's
  // `APP_CONFIG.API_BASE_URL` at this service's origin (or reverse-proxy
  // that origin's `/api/*` here without stripping the prefix).
  app.use(healthRouter);
  app.use(catalogRouter);
  app.use(pricingRouter);
  app.use(ordersRouter);
  app.use(uploadsRouter);
  app.use(adminAuthRouter);
  app.use(adminPricingRouter);
  app.use(adminOrdersRouter);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
