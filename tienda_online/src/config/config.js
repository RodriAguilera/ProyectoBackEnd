import dotenv from "dotenv";
dotenv.config();

export const config = {
    server:{
        port:process.env.PORT,
        secretSession:process.env.SECRET_SESSION
    },
    mongo:{
        url:process.env.MONGO_URL
    },
    github:{
        clientId:process.env.GITHUB_CLIENT_ID,
        clienteSecret: process.env.GITHUB_CLIENTE_SECRET,
        callbackUrl:process.env.GITHUB_CALLBACK_URL,
    },
    gmail:{
        account:process.env.GMAIL_SALES,
        password:process.env.GMAIL_SALES_PASSWORD,
        secretToken:process.env.SECRET_TOKEN_EMAIL
    },
    stripe: {
        keyBE:process.env.STRIPE_BACKEND_KEY
    }
    
}
