document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = document.getElementById("login-status");
      if (status) {
        status.textContent = "Signed in (demo). Redirecting…";
      }
      window.setTimeout(() => {
        window.location.href = "/pages/dashboard.html";
      }, 600);
    });
  }

  const pods = document.getElementById("stat-pods");
  const deploys = document.getElementById("stat-deploys");
  const jobs = document.getElementById("stat-jobs");
  if (pods && deploys && jobs) {
    pods.textContent = "12";
    deploys.textContent = "4";
    jobs.textContent = "2";
  }
});
