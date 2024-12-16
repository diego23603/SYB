import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { products } from "@db/schema";
import { eq } from "drizzle-orm";
import * as promClient from 'prom-client';

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
      res.send(await register.metrics());
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  // Products CRUD endpoints
  app.get("/api/products", async (_req, res) => {
    try {
      const allProducts = await db.query.products.findMany({
        orderBy: (products, { desc }) => [desc(products.createdAt)],
      });
      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
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
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const [product] = await db.insert(products).values(req.body).returning();
      await updateProductMetrics();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
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
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
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
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
