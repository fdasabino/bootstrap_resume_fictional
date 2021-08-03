function sendMail(contactForm) {
  emailjs
    .send("service_6pcnbro", "template_yihnjnn", {
      from_name: contactForm.name.value,
      from_email: contactForm.emailaddress.value,
      project_request: contactForm.projectsummary.value,
    })
    .then(
      (response) => {
        console.log("SUCCESS", response);
      },
      (error) => {
        console.log("FAILED", error);
      }
    );
}
