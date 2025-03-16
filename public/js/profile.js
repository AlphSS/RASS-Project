//profile details
window.onload = async () => {
  await fetch("/user/profile")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("user-name").textContent = data.name;
      document.getElementById("user-email").textContent = data.email;
      //   document.getElementById("userAvatar").src = data.avatar;
    })
    .catch((error) => {
      console.log("Error", error);
    });
};

//logout-pop up
document.getElementById("logout-btn").addEventListener("click", function () {
  document.getElementById("confirm-popup").style.display = "flex";
});

document.getElementById("confirm-no").addEventListener("click", function () {
  document.getElementById("confirm-popup").style.display = "none";
});

document.getElementById("confirm-yes").addEventListener("click", function () {
  fetch("/logout", {
    method: "GET",
    credentials: "same-origin",
  })
    .then((response) => {
      if (response.ok) {
        alert("Logout Successful");
        window.location.href = "/";
      } else {
        alert("Logout Failed");
      }
    })
    .catch(() => {
      alert("Something went wrong");
    });
});
