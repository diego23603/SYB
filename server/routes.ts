import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { products } from "@db/schema";
import { eq } from "drizzle-orm";
import * as promClient from 'prom-client';
import dgram from 'dgram';

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Define metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register]
});

const productsTotal = new promClient.Gauge({
  name: 'products_total',
  help: 'Total number of products in the system',
  registers: [register]
});

const productStockLevel = new promClient.Gauge({
  name: 'product_stock_level',
  help: 'Current stock level per product',
  labelNames: ['product_id', 'product_name'],
  registers: [register]
});

// Middleware to count HTTP requests
const metricsMiddleware = (req: any, res: any, next: any) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
  });
  next();
};

// Function to update product metrics
async function updateProductMetrics() {
  try {
    const allProducts = await db.query.products.findMany();
    productsTotal.set(allProducts.length);
    
    // Reset all product stock metrics
    productStockLevel.reset();
    
    // Update stock levels for each product
    allProducts.forEach((product) => {
      productStockLevel.set(
        { product_id: product.id.toString(), product_name: product.name },
        Number(product.stock)
      );
    });
  } catch (error) {
    console.error('Error updating product metrics:', error);
  }
}

export function registerRoutes(app: Express): Server {
  // Apply metrics middleware
  app.use(metricsMiddleware);

  // Metrics endpoint for Prometheus
  app.get("/metrics", async (_req, res) => {
    try {
      await updateProductMetrics();
      res.set('Content-Type', register.contentType);
      const metrics = await register.metrics();
      console.log('Metrics endpoint called, sending metrics:', metrics.slice(0, 200) + '...');
      res.send(metrics);
    } catch (err) {
      console.error('Error in metrics endpoint:', err);
      res.status(500).send(err);
    }
  });

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  // Products CRUD endpoints with Logstash logging
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.query.products.findMany({
        orderBy: (products, { desc }) => [desc(products.createdAt)],
      });
      res.json(allProducts);
      sendLogToLogstash(req, res, "Products fetched successfully");
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
      sendLogToLogstash(req, res, "Error fetching products: " + error);
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, parseInt(req.params.id)),
      });
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
      sendLogToLogstash(req, res, "Product fetched successfully");
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
      sendLogToLogstash(req, res, "Error fetching product: " + error);
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const [product] = await db.insert(products).values(req.body).returning();
      await updateProductMetrics();
      res.status(201).json(product);
      sendLogToLogstash(req, res, "Product created successfully");
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
      sendLogToLogstash(req, res, "Error creating product: " + error);
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const [product] = await db
        .update(products)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(products.id, parseInt(req.params.id)))
        .returning();
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      await updateProductMetrics();
      res.json(product);
      sendLogToLogstash(req, res, "Product updated successfully");
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
      sendLogToLogstash(req, res, "Error updating product: " + error);
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const [product] = await db
        .delete(products)
        .where(eq(products.id, parseInt(req.params.id)))
        .returning();
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      await updateProductMetrics();
      res.json({ message: "Product deleted successfully" });
      sendLogToLogstash(req, res, "Product deleted successfully");
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
      sendLogToLogstash(req, res, "Error deleting product: " + error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function sendLogToLogstash(req: any, res: any, message: string) {
    const logData = {
        type: "app",
        message: message,
        timestamp: new Date().toISOString(),
        service: "api",
        method: req.method,
        path: req.path,
        level: res.statusCode >= 400 ? "error" : "info"
    };

    const client = dgram.createSocket('udp4');
    client.send(JSON.stringify(logData), 5044, 'logstash', (err) => {
      if (err) console.error('Error sending log to Logstash:', err);
      client.close();
    });
}
