module.exports = ({ modules }) => {
    return {
        presets: [
            '@babel/preset-react',
            [
                '@babel/preset-env',
                {
                    modules,
                    targets: {
                        browsers: [
                            "> 0.5%",
                            "last 2 versions",
                            "Firefox ESR",
                            "not dead",
                            "not IE 11"
                        ]
                    }
                },
            ],
        ]
    };
};