const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {
    const kota = req.query.kota || "jakarta";

    const apiKey = "BOZAmJqY1e3w5gzheekF";

    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);

        const data = response.data;

        const lokasi = data.features[0];
        const koordinat = lokasi.geometry.coordinates;

        const context = lokasi.context || [];

        const negara = context.find(item =>
            item.id.startsWith("country.")
        );

        const provinsi = context.find(item =>
            item.id.startsWith("region.")
        );

        const kecamatan = context.find(item =>
            item.id.startsWith("county.")
        );

        res.json({
            kota: lokasi.matching_text,
            negara: negara ? negara.text : "",
            provinsi: provinsi ? provinsi.text : "",
            kecamatan: kecamatan ? kecamatan.text : "",
            latitude: koordinat[1],
            longitude: koordinat[0]
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});