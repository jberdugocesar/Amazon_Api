module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            skipMD5: true,
        },
        instance: {
            dbName: 'test',
        },
        autoStart: false,
    },
};
