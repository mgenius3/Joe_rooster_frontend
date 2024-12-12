const stars = document.querySelectorAll("#rating i");
const reviewFormContainer = document.getElementById("reviewFormContainer");
let selectedRating = 0;

document
  .querySelector(".testimonials_button a")
  .addEventListener("click", () => {
    reviewFormContainer.classList.add("active");
  });

stars.forEach((star) => {
  // Highlight stars on hover
  star.addEventListener("mouseover", () => {
    resetStars();
    const value = parseInt(star.getAttribute("data-value"));
    highlightStars(value);
  });

  // Restore selected rating when not hovering
  star.addEventListener("mouseout", () => {
    highlightStars(selectedRating);
  });

  // Set selected rating on click
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.getAttribute("data-value"));
    highlightStars(selectedRating);
  });
});

// Highlight stars up to a given value
function highlightStars(value) {
  stars.forEach((star) => {
    const starValue = parseInt(star.getAttribute("data-value"));
    if (starValue <= value) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

// Reset stars to default state
function resetStars() {
  stars.forEach((star) => {
    star.classList.remove("hovered", "selected");
  });
}

// Handle form submission
document.getElementById("reviewForm").addEventListener("submit", function (e) {
  const name = document.getElementById("name").value;
  const reviewTitle = document.getElementById("reviewTitle").value;
  const reviewComment = document.getElementById("reviewComment").value;
  const ratingInput = document.getElementById("ratingInput");

  if (selectedRating === 0) {
    alert("Please select a rating.");
    e.preventDefault(); // Prevent only if there's an error
    return;
  }

  ratingInput.value = selectedRating;
  // Allow the form submission to proceed
  setTimeout(() => {
    // Clear form inputs after submission
    e.target.reset(); // Resets all form fields to their default state
    selectedRating = 0; // Reset the star selection state
    resetStars(); // Clear the stars' visual selection
  }, 100); // Wait a bit after submission for form data to process
});

document.addEventListener("DOMContentLoaded", function () {
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  // Fetch testimonials from database
  fetch("php/fetch_testimonials.php")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        populateTestimonials(data);
      } else {
        console.error("No data found or invalid response");
      }
    })
    .catch((error) => console.error("Error fetching testimonials:", error));

  // Populate Swiper carousel dynamically
  function populateTestimonials(testimonials) {
    testimonials.forEach((testimonial) => {
      const slideHTML = `
        <div class="swiper-slide">
          <div class="testimonial-item">
            <h3>${testimonial.name}</h3>
            <h4>${testimonial.review_title}</h4>
            <div class="stars">
              ${generateStarRating(testimonial.rating)}
            </div>
            <p>
              <i class="bi bi-quote quote-icon-left"></i>
              <span>${testimonial.review_comment}</span>
              <i class="bi bi-quote quote-icon-right"></i>
            </p>
          </div>
        </div>
      `;
      swiperWrapper.insertAdjacentHTML("beforeend", slideHTML);
    });

    // Initialize Swiper carousel with responsive slidesPerView
    new Swiper(".swiper-container", {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000,
      },
      slidesPerView: 1, // Default number of slides
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        // Adjust slidesPerView based on the screen width
        320: {
          slidesPerView: 1, // Mobile devices
        },
        480: {
          slidesPerView: 1.5, // Small tablets
        },
        768: {
          slidesPerView: 2, // Medium-sized tablets
        },
        1024: {
          slidesPerView: 3, // Larger devices
        },
      },
    });
  }

  // Helper function to generate stars dynamically based on rating
  function generateStarRating(rating) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHTML += `<i class="bi bi-star-fill"></i>`;
      } else {
        starsHTML += `<i class="bi bi-star"></i>`;
      }
    }
    return starsHTML;
  }
});