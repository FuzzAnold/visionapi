const express = require('express');
const axios = require('axios');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
const port = process.env.PORT || 3000;

const CREDENTIALS = {
  "type": "service_account",
  "project_id": "yuma-386304",
  "private_key_id": "48b3e95035d781654a81c5eea0ad055b5c21e7fe",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRcBZOq2sVTybn\nSGXOCJU1Yj90XtM/nI3SotAGtXCO6JMnoZNhrReoP3JftueZH26SSnkvxkojjT+h\nGklJTlIrDfr2ilHLzUzKxz8ptCDlAMIp07ZdWxIdsUcZPRGmDsHlM9Z68/cIejuc\nhUQ1kFT8HLV2nmDjd9m/bU7saamIO8UzXWXVoO40FTTdNSnz5CD7e/bSMxPkuz33\nspolSdW+h8hOwy64L3si+kp1ceoQxG0QwvQHEJDngrhgUHiI3leVLW7Xf98yhQ0U\nsKyTUw6esd/HYBbNBJ/lAOlERGlNhL6FO6NrPJQ2DKpO5/Qwms5EWbo6HkM0auHG\n/1b+tLa5AgMBAAECggEAXGL63CIevwwm56BWlD/R/fYEcsN/oVBgeVmrtUHlUI0E\nmNdcCZrO1D+Epvcqi6/DWVHzymDIhI1C08CiMm2Trn1gxs92TJYX+V1SHgXg+tPO\nUqAbEmxhfeqdJ+N5/QwGeSJYSu2Ce+FbmWxqDczIyFurqpMrvzu3uIsx5PSpPbf/\nfaPh5mczzvZUNkRMvIugl3XJJLy73WVckVnAQiEK8tQEB2sWpD+21v5N2Ckl1mfx\nrZlNha3UxmAmb4UQgUoaC9dIJR6wiExoH16Z97KOMipdR1/6wZNFnzgo95sPB6Pc\nE4LHvj9f95IKeHYyAxSsjgLBN1pJ9kf0pJe8VUkG5wKBgQDy03gXaXTi8aqW9DVA\nSImcBBCFIdYOUqP4FeCuIlXkgyNY/556sDPr28OEjQkC0TzLdkAYY+AWwyTM9OfN\np2zME8HRLokM+wKrf/3jwNkolB+mFJ/cad3A07rLQGjnzn6x9GirYKZmvEHZIEK6\nt7SEZfB2or17Qud9J7BfsGjLowKBgQDczOZyxCpcD9aym78h41nNCK8dYfFPdR1X\n8wXbWNmtUoyN/RgjHM10Rbh308b1hJNuGwt77QwxeWrhglJdi3wmiM6hcSs6vDAH\nQC/Eu5t7o7H0QgastAtFtnzYZJm6YoGhcNqFKY6FOP1boQ7NFPifQO1dPC65XxxR\np2vBSM2Z8wKBgQCGe6ffD4C0z7Lyt31mhMXxqi6cDQlIFWzKUROGXW3EiPxipe9X\nc47N6YB3QMTk0o0hAfStjWLmOF2BRYG73CXdQHPvLh6pGbt40AIEySF7381HZdTD\ndb5itOCXAK0Y9LwmQn5Vq8l8zHaLkdpjHqrTSMHMcoUOZxddsUV1OXZQkQKBgQCh\nNu5P/5DaNSpSsMsmSCSqQtvxPTD/DgjFzYiKNl6BYZOEnLZB9ObCLaHZxAQyAYHP\n0+lXq6XKfdefHhNbf9u/Gwab89BXi04aDTCTmVOWO9hT+t16vd65INwY96MS5pe1\ns3up3MTV2t2KSJdRAC3jwXlOKQIIkTxRFkfkEW8lJwKBgECPt+1KV3Fh8vyJySDY\nvjStR8zkHbXMckGguPezHOhCMZKlmIouvmyCn601IjT22LYGbMgqwoeKQLsyMBHg\nzEA5aWpz0UqpG5vtw90IK3WmZ5SOaYfwm/UgoY6PN4Uafk83cP1FIuLjuCEoBKAI\n9qiegfV2hEfC5FjVImeqhTSj\n-----END PRIVATE KEY-----\n",
  "client_email": "ff-820@yuma-386304.iam.gserviceaccount.com",
  "client_id": "116244805758091270275",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ff-820%40yuma-386304.iam.gserviceaccount.com"
};

const client = new ImageAnnotatorClient({ credentials: CREDENTIALS });

app.get('/detect-text', async (req, res) => {
  try {
    const { imageUrl } = req.query;

    // Get image data from URL
    const { data: imageBuffer } = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    // Perform text detection on image
    const [result] = await client.textDetection(imageBuffer);
    const annotations = result.textAnnotations;

    // Extract text from annotations
    const text = annotations.reduce((acc, curr) => acc + curr.description, '');

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

