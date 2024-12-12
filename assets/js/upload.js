// let selectedFiles = [];

// function previewFiles() {
//   const fileInput = document.getElementById('files');
//   const previewContainer = document.getElementById('preview-container');
//   const metadataFields = document.getElementById('metadata-fields');

//   previewContainer.innerHTML = ''; // Clear previous previews
//   metadataFields.innerHTML = ''; // Clear previous metadata fields
//   selectedFiles = []; // Reset selected files

//   Array.from(fileInput.files).forEach((file, index) => {
//     const reader = new FileReader();

//     reader.onload = function (e) {
//       const previewItem = document.createElement('div');
//       previewItem.className = 'preview-item';

//       const removeButton = document.createElement('button');
//       removeButton.innerHTML = '&times;';
//       removeButton.className = 'remove-file';
//       removeButton.onclick = () => removeFile(index);

//       let mediaElement;
//       if (file.type.startsWith('image/')) {
//         mediaElement = document.createElement('img');
//         mediaElement.alt = 'Preview image';
//       } else if (file.type.startsWith('video/')) {
//         mediaElement = document.createElement('video');
//         mediaElement.controls = true;
//       }

//       mediaElement.src = e.target.result;
//       mediaElement.className = 'img-fluid rounded';

//       previewItem.appendChild(mediaElement);
//       previewItem.appendChild(removeButton);
//       previewContainer.appendChild(previewItem);

//       // Create metadata input fields
//       const metadataField = document.createElement('div');
//       metadataField.className = 'mb-3';
//       metadataField.innerHTML = `
//         <label for="title-${index}" class="form-label">Title for File ${index + 1}</label>
//         <input type="text" id="title-${index}" name="title[]" class="form-control mb-2" placeholder="Enter title" required>
//         <textarea id="description-${index}" name="description[]" class="form-control" rows="2" placeholder="Enter description" required></textarea>
//       `;
//       metadataFields.appendChild(metadataField);

//       selectedFiles.push(file);
//     };

//     reader.readAsDataURL(file);
//   });
// }

// function removeFile(index) {
//   selectedFiles.splice(index, 1);
//   previewFiles();
// }

// document.getElementById('uploadForm').addEventListener('submit', function(e) {
//   e.preventDefault();
//   const formData = new FormData();
//   selectedFiles.forEach((file, index) => {
//     formData.append('files[]', file);
//     formData.append('titles[]', document.getElementById(`title-${index}`).value);
//     formData.append('descriptions[]', document.getElementById(`description-${index}`).value);
//   });
//   fetch('php/upload.php', {
//     method: 'POST',
//     body: formData
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.success) {
//       console.log('Files uploaded successfully!');
//     } else {
//       console.log('Upload failed: ' + data.error);
//     }
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     console.log(error);
//   });
// });



let selectedFiles = [];
const MAX_FILE_SIZE = 10485760; // 10 MB in bytes

function showAlert(message, type) {
  const alertContainer = document.getElementById("alert-container");
  const alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  alertContainer.innerHTML = alertHTML;
}

function previewFiles() {
  const previewContainer = document.getElementById("preview-container");
  const metadataFields = document.getElementById("metadata-fields");

  previewContainer.innerHTML = ""; // Clear previous previews
  metadataFields.innerHTML = ""; // Clear previous metadata fields

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      console.log(file);
      const previewItem = document.createElement("div");
      previewItem.className = "preview-item";

      const removeButton = document.createElement("p");
      removeButton.innerHTML = "&times;";
      removeButton.className = "remove-file";
      removeButton.onclick = () => removeFile(index);

      let mediaElement;
      if (file.type.startsWith("image/")) {
        mediaElement = document.createElement("img");
        mediaElement.alt = "Preview image";
      } else if (file.type.startsWith("video/")) {
        mediaElement = document.createElement("video");
        mediaElement.controls = true;
      }

      mediaElement.src = e.target.result;
      mediaElement.className = "img-fluid rounded";

      previewItem.appendChild(mediaElement);
      previewItem.appendChild(removeButton);
      previewContainer.appendChild(previewItem);

      // Create metadata input fields
      const metadataField = document.createElement("div");
      metadataField.className = "mb-3";
      metadataField.innerHTML = `
        <small for="title-${index}" class="form-label">File: ${
        file.name
      }</small>
        <input type="text" id="title-${index}" name="title[]" class="form-control mb-2" placeholder="Enter title" required>
        <textarea id="description-${index}" name="description[]" class="form-control" rows="2" placeholder="Enter description" required></textarea>
      `;
      metadataFields.appendChild(metadataField);
    };
    reader.readAsDataURL(file);
  });
}

function removeFile(index) {
  selectedFiles.splice(index, 1); // Remove file from selectedFiles array
  previewFiles(); // Re-render the previews
}

document.getElementById("files").addEventListener("change", function () {
  Array.from(this.files).forEach((file) => {
    if (file.size <= MAX_FILE_SIZE) {
      selectedFiles.push(file);
    } else {
      showAlert(`The file "${file.name}" is too large. The maximum allowed size is 10 MB.`, "danger");
    }
  });

  // Clear the input field so it can be reused for adding files again
  this.value = "";
  previewFiles(); // Render the previews
});

document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const uploadButton = e.target.querySelector("button[type='submit']");
  const formData = new FormData();

  // Disable the button and change its text
  uploadButton.disabled = true;
  uploadButton.textContent = "Uploading...";

  const uploadPromises = selectedFiles.map((file, index) => {
    return new Promise((resolve, reject) => {
      const formDataCloudinary = new FormData();
      formDataCloudinary.append("file", file);
      formDataCloudinary.append("upload_preset", "rooster"); // Use your Cloudinary preset here

      const uploadEndpoint = file.type.startsWith("video/")
        ? "https://api.cloudinary.com/v1_1/mgenius/video/upload"
        : "https://api.cloudinary.com/v1_1/mgenius/image/upload";

      fetch(uploadEndpoint, {
        method: "POST",
        body: formDataCloudinary,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            formData.append("files[]", data.secure_url);
            formData.append(
              "titles[]",
              document.getElementById(`title-${index}`).value
            );
            formData.append(
              "descriptions[]",
              document.getElementById(`description-${index}`).value
            );
            formData.append("filetypes[]", file.type);
            resolve();
          } else {
            reject("Cloudinary upload failed");
          }
        })
        .catch((error) => reject(error));
    });
  });

  // Wait for all files to be uploaded to Cloudinary
  Promise.all(uploadPromises)
    .then(() => {
      // Send data to PHP after successful Cloudinary upload
      fetch("php/upload.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showAlert("Files uploaded successfully!", "success");
          } else {
            showAlert(`Upload failed: ${data.error}`, "warning");
          }
        })
        .catch((error) => {
          showAlert(`Upload failed: ${error}`, "warning");
        })
        .finally(() => {
          // Re-enable the button and reset its text
          uploadButton.disabled = false;
          uploadButton.textContent = "Upload Files";
        });
    })
    .catch((error) => {
      showAlert(`Error uploading files: ${error}`, "warning");
      // Re-enable the button and reset its text
      uploadButton.disabled = false;
      uploadButton.textContent = "Upload Files";
    });
});



