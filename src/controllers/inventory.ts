import { Request, Response } from "express";
import { VariantData, InventoryData } from "../interfaces/inventory";

export const getStock = async (req: Request, res: Response): Promise<void> => {
  const { variantId, locationId } = req.params;

  // Validation des paramètres
  if (!variantId || !locationId) {
    res.status(400).json({ error: "variantId et locationId sont requis." });
    return;
  }

  try {
    // URL pour récupérer les informations du variant
    const urlVariant = `${process.env.URL_BACKEND_SHOPIFY}/variants/${variantId}.json`;

    // Récupération des données du variant
    const variantResponse = await fetch(urlVariant, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": process.env.API_TOKEN as string,
        "Content-Type": "application/json",
      },
    });

    if (!variantResponse.ok) {
      res.status(variantResponse.status).json({
        error: "Erreur lors de la récupération du produit (variant).",
      });
      return;
    }

    const variantData: VariantData = await variantResponse.json();
    const inventoryItemID = variantData.variant.inventory_item_id;

    if (!inventoryItemID) {
      res.status(500).json({ error: "Données du produit invalides." });
      return;
    }

    // URL pour récupérer le stock
    const urlInventory = `${process.env.URL_BACKEND_SHOPIFY}/inventory_levels.json?location_ids=${locationId}&inventory_item_ids=${inventoryItemID}`;

    // Récupération des données de l'inventory
    const inventoryResponse = await fetch(urlInventory, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": process.env.API_TOKEN as string,
        "Content-Type": "application/json",
      },
    });

    if (!inventoryResponse.ok) {
      res
        .status(inventoryResponse.status)
        .json({ error: "Erreur lors de la récupération du stock produit." });
      return;
    }

    const inventoryData: InventoryData = await inventoryResponse.json();
    const stockInOffice = inventoryData.inventory_levels?.[0]?.available;

    if (stockInOffice === undefined) {
      res.status(500).json({ error: "Données de stock produit invalides." });
      return;
    }

    res.status(200).json({ stock: stockInOffice });
  } catch (error) {
    res.status(500).send("Erreur serveur");
  }
};
