const executeBtn = document.getElementById("exBtn");
const txtEmail = document.getElementById("txtEmail");

//use variables
let inData;
let emailAddress;

//event listener for the execute button
executeBtn.addEventListener("click", async (e) => {
  //stop a default button operation from happening (reload)
  e.preventDefault();

  //set email each time programmatically..
  emailAddress = txtEmail.value;

  /////////// Ordered sequence of events //////////

  //report execution started..
  alert("Execution Started..");

  //function waits until promise returns before executing the update method
  const waiting = await getToken();

  //function waits to create share link until token is updated
  const waitingAgain = await updateTokenAxios();

  //everything is done so the final step is creating the share link..
  createShareLinkAxios();
});

//getting a new access token
const getToken = async () => {
  const resp = await fetch("https://extole-api.extole.io/api/v4/token/")
    .then((response) => response.json())
    .then((data) => {
      inData = data.access_token;
      alert(`Got Token: ${inData}`);

      console.log(inData);
    })
    .catch((error) => {
      alert("Problem occured while trying to get...");
    });
};

//POST to existing access token and adding an email address to pair
const updateTokenAxios = async () => {
  alert(`Updating email to: ${emailAddress} for token: ${inData}`);
  const options = {
    method: "POST",
    url: `https://extole-api.extole.io/api/v4/me?access_token=${inData}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer: ${inData}`,
      "Content-Type": "application/json",
    },
    data: {
      email: emailAddress,
    },
  };

  const res = await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      console.log(response.data.access_token);
      alert("Update Success..");
    })
    .catch(function (error) {
      console.error(error);
      alert("Update token failed...");
    });
};

//shareable link POST request
const createShareLinkAxios = async () => {
  const options = {
    method: "POST",
    url: "https://extole-api.extole.io/api/v6/me/shareables",
    headers: {
      accept: "application/json",
      Authorization: `Bearer: ${inData}`,
      "Content-Type": "application/json",
    },
    data: {
      key: "mysharelink",
      label: "labelForSharelink",
    },
  };

  const res = await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);

      alert(`Share Link for Token: ${inData} is now: ${response.data.link}`);
    })
    .catch(function (error) {
      console.error(error);
    });
};
