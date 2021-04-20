const endpoints = [
    {
        method: "GET",
        path: "/api/",
        description: "Get all available paths"
    },
    {
        method: "POST",
        path: "/api/pinFile",
        description: "Pin file to IPFS using Pinata"
    },
    {
        method: "POST",
        path: "/api/pinJSON",
        description: "Pin JSON to IPFS using Pinata"
    },
    {
        method: "DELETE",
        path: "/api/unpin/:hash",
        description: "Unpin hash from IPFS using Pinata"
    }
];

module.exports = {
    endpoints
};