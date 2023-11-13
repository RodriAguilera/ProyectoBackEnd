import app from "../tienda_online/src/app.js"
import supertest from "supertest";
import chai from "chai";
import { cartModel } from "../tienda_online/src/dao/models/carts.model.js";


const expect = chai.expect;
const requester = supertest(app);

describe("Pruebas app de OnlineZapas", function () {
    describe("Pruebas modulo de productos", function () {
      this.timeout(15000);
  
      beforeEach(async () => {
      await cartModel.deleteMany({});
    });
   

   
    it("Debería obtener una lista vacía de carritos inicialmente", async () => {
        const response = await requester.get("/api/carts");
  
        expect(response.body).to.have.property("status");
        expect(response.body.status).to.be.equal("success");
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.be.an("array");
        expect(response.body.data).to.have.lengthOf(0);
      });

      it("No debería crear un nuevo carrito con el método POST, si no está autenticado el usuario", async () => {
        const response = await requester.post("/api/carts");
    
        expect(response.body).to.have.property("status");
        expect(response.body.status).to.be.equal("error");
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("Debes estar autenticado");
    });
    
      
     
    });
})
