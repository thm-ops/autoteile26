import express from "express";

const PORT = parseInt(process.env.PORT || "3000") || 3000;

const service = express();

service.get("/", (_req, res) => {
    res.send("Hello THM!!!");
})

service.listen(PORT, ()=> {
    console.log(`Service is running on port ${PORT}`);
})