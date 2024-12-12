document.addEventListener("DOMContentLoaded", function () {
  const swiperWrapper = document.querySelector(".isotope-container");
  const filterButtons = document.querySelectorAll(".portfolio-filters li");

  // Fetch testimonials from database
  fetch("php/fetch_upload.php")
    .then((response) => response.json())
    .then((response) => {
      console.log(Array.isArray(response.data));
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(response.data);
        populateGallery(response.data);
      } else {
        console.error("No data found or invalid response");
      }
    })
    .catch((error) => console.error("Error fetching testimonials:", error));

  // Populate Swiper carousel dynamically
  function populateGallery(gallery) {
    gallery.forEach((g) => {
      let mediaHTML;

      if (g.file_type === "image/jpeg" || g.file_type === "image/png") {
        mediaHTML = `
          <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-image">
            <img src="${g.file_url}" class="img-fluid" alt="">
            <div class="portfolio-info">
              <h4>${g.title}</h4>
              <p>${g.description}</p>
              <a href="${g.file_url}" title="${g.title}" data-gallery="portfolio-gallery-app" class="glightbox preview-link">
                <i class="bi bi-zoom-in"></i>
              </a>
            </div>
          </div>
        `;
      } else {
        mediaHTML = `
          <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-video">
            <video controls autoplay muted>
              <source src="${g.file_url}" type="${g.file_type}">
              Your browser does not support the video tag.
            </video>
            <div class="portfolio-info">
              <h4>${g.title}</h4>
              <p>${g.description}</p>
              <a href="${g.file_url}" title="${g.title}" data-gallery="portfolio-gallery-app" class="glightbox preview-link">
                <i class="bi bi-zoom-in"></i>
              </a>
            </div>
          </div>
        `;
      }
      

      const slideHTML = `
        ${mediaHTML}
      `;
      swiperWrapper.insertAdjacentHTML("beforeend", slideHTML);
    });
  }

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Remove active class from all buttons and add to the clicked button
      filterButtons.forEach((btn) => btn.classList.remove("filter-active"));
      this.classList.add("filter-active");

      // Show/hide items based on the filter
      const portfolioItems = document.querySelectorAll(".portfolio-item");
      portfolioItems.forEach((item) => {
        if (filter === "*" || item.classList.contains(filter.substring(1))) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});
