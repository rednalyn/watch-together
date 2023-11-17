async function youtubeApi() {

 
 const client = gapi.client.init({
    apiKey: "YOUR_API_KEY",
    // clientId and scope are optional if auth is not required.
    // clientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    // scope: "profile",
  });

  const start = () => {
    // 2. Initialize the JavaScript client library.
    client
      .then(function () {
        // 3. Initialize and make the API request.
        return gapi.client.request({
          path: "https://people.googleapis.com/v3/people/me?requestMask.includeField=person.names",
        });
      })
      .then(
        function (response) {
          console.log(response.result);
        },
        function (reason) {
          console.log("Error: " + reason.result.error.message);
        }
      );
  };
  // 1. Load the JavaScript client library.
  gapi.load("client", start);
  return start;
}
