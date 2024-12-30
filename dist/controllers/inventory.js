"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStock = void 0;
const getStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        const variantResponse = yield fetch(urlVariant, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": process.env.API_TOKEN,
                "Content-Type": "application/json",
            },
        });
        if (!variantResponse.ok) {
            res.status(variantResponse.status).json({
                error: "Erreur lors de la récupération du produit (variant).",
            });
            return;
        }
        const variantData = yield variantResponse.json();
        const inventoryItemID = variantData.variant.inventory_item_id;
        if (!inventoryItemID) {
            res.status(500).json({ error: "Données du produit invalides." });
            return;
        }
        // URL pour récupérer le stock
        const urlInventory = `${process.env.URL_BACKEND_SHOPIFY}/inventory_levels.json?location_ids=${locationId}&inventory_item_ids=${inventoryItemID}`;
        // Récupération des données de l'inventory
        const inventoryResponse = yield fetch(urlInventory, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": process.env.API_TOKEN,
                "Content-Type": "application/json",
            },
        });
        if (!inventoryResponse.ok) {
            res
                .status(inventoryResponse.status)
                .json({ error: "Erreur lors de la récupération du stock produit." });
            return;
        }
        const inventoryData = yield inventoryResponse.json();
        const stockInOffice = (_b = (_a = inventoryData.inventory_levels) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.available;
        if (stockInOffice === undefined) {
            res.status(500).json({ error: "Données de stock produit invalides." });
            return;
        }
        res.status(200).json({ stock: stockInOffice });
    }
    catch (error) {
        res.status(500).send("Erreur serveur");
    }
});
exports.getStock = getStock;
//# sourceMappingURL=inventory.js.map