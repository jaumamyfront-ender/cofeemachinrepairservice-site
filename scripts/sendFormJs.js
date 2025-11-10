const form = document.getElementById("contactForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    phone: form.phone.value,
    message: form.message.value,
  };

  const response = await fetch(form.action, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    form.reset();
    document.getElementById("formMessage").style.display = "block";
  } else {
    alert("❌ Coś poszło nie tak. Spróbuj ponownie później.");
  }
});
