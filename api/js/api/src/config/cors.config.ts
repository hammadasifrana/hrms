// CORS configuration
export const corsOptions = {
    origin: 'http://local:3000', // Replace with your allowed origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};