const Clarifai = require('clarifai');
const fetch = require('node-fetch');

const handleApiCall = (req , res) => {
    const USER_ID = 'kahung33';
    const PAT = '2a6d757f14714eb8a9b6a13b122574ea';
    const APP_ID = 'brainrecog';
    const MODEL_ID ='face-detection';
    const MODEL_VERSION_ID='6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.input;
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });
 
  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };
 
  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id
 
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    //cast the response to Javascript Obejct
      .then(response => response.json())
      .then(data => {
        res.json(data);
      })
      .catch(err => res.status(400).json('unable to work with api'))
}
   
   

const handleImage = (req, res, db) => {
        const { id } = req.body;
        db('users').where('id', '=' , id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get count'));
}

module.exports = {
    handleImage,
    handleApiCall
}