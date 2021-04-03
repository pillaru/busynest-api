/* eslint-disable no-undef */
db = db.getSiblingDB("busynest");

db.createUser({
    user: "busynest_sa",
    pwd: "secret",
    roles: [
        {
            role: "readWrite",
            db: "busynest",
        },
    ],
});
