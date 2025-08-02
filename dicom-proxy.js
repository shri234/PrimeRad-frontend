import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/dicom-auth", async (req, res) => {
  try {
    let body;
    if (req.body.grant_type === "refresh_token" && req.body.refresh_token) {
      // Use refresh token grant
      body = {
        grant_type: "refresh_token",
        refresh_token: req.body.refresh_token,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
      };
    } else {
      // Use password grant
      body = {
        grant_type: "password",
        username: req.body.username,
        password: req.body.password,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        scope: "orthanc:studies:dicom-web offline_access",
      };
    }
    const params = new URLSearchParams(body).toString();
    const response = await fetch(
      "https://auth.medicai.io/auth/realms/production/protocol/openid-connect/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`DICOM proxy running on http://localhost:${PORT}`)
);
