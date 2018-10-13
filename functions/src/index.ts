import * as functions from 'firebase-functions';
import * as request from 'request-promise';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const newGatheringSlackNotifier = functions.database
  .ref('/gatherings/{gatheringID}')
  .onCreate(async snap => {
    const gatheringStr = snap.toJSON();

    await request({
      method: 'POST',
      uri: functions.config().slack.webhook_url,
      body: {
        text: 'New gathering created! ```' + JSON.stringify(gatheringStr) + '```'
      },
      json: true
    });
  });

export const newUserSlackNotifier = functions.auth.user().onCreate(async newUser => {
  await request({
    method: 'POST',
    uri: functions.config().slack.webhook_url,
    body: {
      text: `New user: ${JSON.stringify(newUser)}`
    },
    json: true
  });
});
