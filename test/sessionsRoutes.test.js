import app from "../tienda_online/src/app.js";
import supertest from "supertest";
import chai from "chai";
import { usersModel } from "../tienda_online/src/dao/models/users.model.js";

const expect = chai.expect;
const requester = supertest(app);//elemento para hacer peticiones al servidor.

describe("Pruebas app OnlineZapas", function(){
    describe("Test modulo sessions", function(){
        this.timeout(10000);

        before(async function(){
            await usersModel.deleteMany({});
            this.cookie;
        });   
        const mockUser = {
            first_name: "Rodri",
            last_name: "Ag",
            email: "RodriAg@gmail.com",
            age: 27,
            password: "password123",
            cart: "hbc8rbg", 
            role: "user",
          };



        it("Se debe loguear al usuario registrado correctamente", async()=>{
            const loginUser = {
                email:mockUser.email,
                password: mockUser.password
            };

            const response = await requester.post("/api/sessions/login").send(loginUser);
            const cookieResponse = response.headers['set-cookie'][0];
            const cookieData = {
                name:cookieResponse.split("=")[0],
                value:cookieResponse.split("=")[1],
            }// ["coderCookie", "value"]
            // console.log(cookieData);
            this.cookie = cookieData;
            expect(this.cookie.name).to.be.equal("connect.sid");
        });

        it("Debería cerrar la sesión del usuario", async () => {
            const response = await requester.get("/api/sessions/logout").set("Cookie", `${this.cookie.name}=${this.cookie.value}`);
            expect(response.status).to.equal(302);
            expect(response.header.location).to.equal("/");
          });

          it("Debería fallar al cerrar la sesión si el usuario no está autenticado", async () => {
            const response = await requester.get("/api/sessions/logout");
            expect(response.status).to.equal(302);
            expect(response.header.location).to.equal("/");
          });

    });

});