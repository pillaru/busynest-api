module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "env": {
        "node": true,
        "jest": true,
    },
    "rules": {
        "indent": ["error", 4],
        "comma-dangle": ["error", "never"],
        "import/no-extraneous-dependencies": [
            "error", {
                "devDependencies": true, 
                "optionalDependencies": false, 
                "peerDependencies": false
            }
        ],
        "no-console": "off",
        "no-underscore-dangle": ["error", { "allow" :[ "_id" ] }],
        "new-cap": ["error", {"capIsNewExceptionPattern": "Router()|Schema"}]
    }
};