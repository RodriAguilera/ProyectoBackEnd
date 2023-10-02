import {ticketsDao} from "../dao/index.js";

export class TicketsService {
    static async createTicket(ticketInfo){
        return await ticketsDao.createTicket(ticketInfo);
    };
};