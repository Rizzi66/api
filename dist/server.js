"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const inventoryRoutes = require("./routes/inventory");
const dotenv = require("dotenv").config().parsed;
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/", inventoryRoutes);
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
//# sourceMappingURL=server.js.map