
export const config = {
    server:{
        port:8080,
        secretSession:"claveSecretaSessions",
    },
    mongo:{
        url:"mongodb+srv://rodrigoaguilera99519:VJ6JK99OXv6d7lOH@cluster0.re8pknm.mongodb.net/bcryptDB?retryWrites=true&w=majority"
    },
    github:{
        clientId:"Iv1.58dea4e0894cc6b6",
        clienteSecret:"0e0c88e02d31f42640876329fd30d136c043439f",
        callbackUrl:"http://localhost:8080/api/sessions/github-callback"
    }
}
