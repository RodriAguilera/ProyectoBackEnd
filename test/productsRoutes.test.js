import app from "../tienda_online/src/app.js"
import supertest from "supertest";
import chai from "chai";
import { productsModel } from "../tienda_online/src/dao/models/products.model.js";


const expect = chai.expect;
const requester = supertest(app);

describe("Pruebas app de OnlineZapas", function () {
    describe("Pruebas modulo de productos", function () {
      this.timeout(10000);
  
      beforeEach(async () => {
      // Antes de cada prueba, limpiar la base de datos de productos
      await productsModel.deleteMany({});
    });
   

    it("Debería obtener una lista vacía de productos inicialmente", async () => {
      const response = await requester.get("/api/products");
      expect(response.body).to.have.property("status");
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.be.an("array");
      expect(response.body.data).to.be.empty;
      expect(response.status).to.equal(200);
    });

    it("No debería crear un nuevo producto con el método POST, si no está autenticado el usuario", async () => {
      const newProduct = {
        title: "Zapato de prueba",
        description: "Descripción de prueba",
        price: 99.99,
        code: "ABC123",
        thumbnail: "url_de_la_imagen.jpg",
        category: "Calzado urbano",
        stock: 10,
        status: true,
      };

      
      const response = await requester.post("/api/products").send(newProduct);
     
      expect(response.body).to.have.property("status");
      expect(response.body.status).to.be.equal("error");
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.be.equal("Debes estar autenticado");
    
    });

    it("Debería devolver un error si el producto no existe", async () => {

      const nonExistentProductId = "60c7d0fe027942001c488ee1";
      const response = await requester.get(`/api/products/${nonExistentProductId}`);

      expect(response.body).to.have.property("status");
      expect(response.body.status).to.be.equal("error");
    });


});
})
