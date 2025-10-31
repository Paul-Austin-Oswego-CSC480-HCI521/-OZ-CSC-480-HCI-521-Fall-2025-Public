module.exports = {
    testDir: './tests/qa_tests',
    timeout: 30000,
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
};