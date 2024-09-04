module.exports = {
    content: [
        "./src/views/**/*.{ejs,js}",
    ],

    daisyui: {
        themes: ["nord", "sunset"],
    },
    plugins: [require('daisyui')],
}