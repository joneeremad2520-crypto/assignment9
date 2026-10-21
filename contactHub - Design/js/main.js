var contacts = JSON.parse(localStorage.getItem("contacts")) || [];
var editingId = null;
var currentAvatar = "";

var addContactBtn = document.getElementById("addContactBtn");
var contactModal = document.getElementById("contactModal");
var closeModalBtn = document.getElementById("closeModalBtn");
var cancelModalBtn = document.getElementById("cancelModalBtn");
var contactForm = document.getElementById("contactForm");
var submitModalBtn = document.getElementById("submitModalBtn");
var searchInput = document.getElementById("searchInput");
var contactCardContainer = document.getElementById("contactCardContainer");
var avatarInput = document.getElementById("avatarInput");
var avatarPreview = document.getElementById("avatarPreview");

searchInput.value = sessionStorage.getItem("contactSearch") || "";

function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
        var characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

function showModal() {
    contactModal.classList.remove("d-none");
    contactModal.classList.add("d-flex");
}

function hideModal() {
    contactModal.classList.add("d-none");
    contactModal.classList.remove("d-flex");

    contactForm.reset();
    clearErrors();

    editingId = null;
    currentAvatar = "";

    document.getElementById("contactId").value = "";
    document.getElementById("modalTitle").textContent = "Add New Contact";

    submitModalBtn.innerHTML =
        '<i class="fas fa-check me-2"></i>Save Contact';

    avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
}

function clearErrors() {
    var errorIds = [
        "contactNameError",
        "contactPhoneError",
        "contactEmailError"
    ];

    var inputIds = [
        "contactName",
        "contactPhone",
        "contactEmail"
    ];

    for (var i = 0; i < errorIds.length; i++) {
        document.getElementById(errorIds[i]).classList.add("d-none");

        document.getElementById(inputIds[i]).classList.remove("is-invalid");
    }
}

function showError(inputId, errorId, show) {
    document.getElementById(errorId).classList.toggle("d-none", !show);

    document.getElementById(inputId).classList.toggle("is-invalid", show);
}

function isValidName(name) {
    return /^[\p{L}\s.'-]{2,50}$/u.test(name.trim());
}

function isValidPhone(phone) {
    return /^(?:(?:\+20)|0)?1[0125][0-9]{8}$/.test(
        phone.replace(/[\s()-]/g, "")
    );
}

function isValidEmail(email) {
    return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateAvatarPreview() {
    if (currentAvatar) {
        avatarPreview.innerHTML =
            '<img src="' + currentAvatar +
            '" alt="Contact photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
        avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
    }
}

function openAddModal() {
    hideModal();

    document.getElementById("modalTitle").textContent = "Add New Contact";

    showModal();
}

function renderContacts() {
    var searchText = searchInput.value.trim().toLowerCase();

    var filteredContacts = contacts.filter(function (contact) {
        return contact.name.toLowerCase().includes(searchText) ||
            contact.phone.toLowerCase().includes(searchText) ||
            contact.email.toLowerCase().includes(searchText);
    });

    document.getElementById("totalContacts").textContent = contacts.length;

    document.getElementById("totalContactsSpan").textContent = contacts.length;

    document.getElementById("totalFavContacts").textContent =
        contacts.filter(function (contact) {
            return contact.favorite;
        }).length;

    document.getElementById("totalEmergencyContacts").textContent =
        contacts.filter(function (contact) {
            return contact.emergency;
        }).length;

    if (filteredContacts.length === 0) {
        contactCardContainer.innerHTML =
            '<div class="col-12 text-center py-5">' +
                '<div class="d-flex align-items-center justify-content-center mx-auto mb-4 bg-secondary-subtle rounded-4" style="width:80px;height:80px;">' +
                    '<i class="fas fa-address-book text-secondary fs-4"></i>' +
                '</div>' +
                '<p class="text-muted fw-semibold mb-1">No contacts found</p>' +
                '<p class="text-secondary small">Click <strong>"Add Contact"</strong> to get started</p>' +
            '</div>';
    } else {
        contactCardContainer.innerHTML = filteredContacts.map(function (contact) {
            var avatar = contact.avatar
                ? '<img src="' + contact.avatar +
                    '" alt="' + escapeHTML(contact.name) +
                    '" class="contact-card-avatar object-fit-cover">'
                : '<div class="contact-card-avatar d-flex align-items-center justify-content-center rounded-3 text-white fw-bold" style="background:linear-gradient(135deg,#7c3aed,#2563eb);">' +
                    escapeHTML(contact.name.charAt(0).toUpperCase()) +
                  '</div>';

            return '<div class="col-md-6 col-lg-12 col-xl-6 mb-4">' +
                '<div class="contact-card">' +

                    '<div class="contact-card-header">' +

                        '<div class="d-flex align-items-start justify-content-start gap-3">' +

                            '<div class="position-relative flex-shrink-0">' +

                                avatar +

                                (contact.emergency
                                    ? '<div class="badge-icon badge-heart d-flex justify-content-center align-items-center rounded-circle"><i class="fas fa-heart-pulse"></i></div>'
                                    : '') +

                                (contact.favorite
                                    ? '<div class="badge-icon badge-star d-flex justify-content-center align-items-center rounded-circle"><i class="fas fa-star"></i></div>'
                                    : '') +

                            '</div>' +

                            '<div class="flex-grow-1 min-w-0 pt-1">' +

                                '<h3 class="contact-card-name truncate m-0">' +
                                    escapeHTML(contact.name) +
                                '</h3>' +

                                '<div class="d-flex align-items-center gap-2 mt-1">' +

                                    '<div class="contact-card-phone-container flex-shrink-0">' +
                                        '<i class="contact-card-phone-icon fas fa-phone"></i>' +
                                    '</div>' +

                                    '<span class="contact-card-phone truncate">' +
                                        escapeHTML(contact.phone) +
                                    '</span>' +

                                '</div>' +

                            '</div>' +

                        '</div>' +

                        '<div class="contact-details">' +

                            '<div class="contact-detail-item">' +

                                '<div class="contact-detail-icon-container d-flex align-items-center justify-content-center violet">' +
                                    '<i class="contact-detail-icon violet fas fa-envelope"></i>' +
                                '</div>' +

                                '<span class="contact-detail-text truncate">' +
                                    escapeHTML(contact.email || "No email") +
                                '</span>' +

                            '</div>' +

                            '<div class="contact-detail-item">' +

                                '<div class="contact-detail-icon-container d-flex align-items-center justify-content-center emerald">' +
                                    '<i class="contact-detail-icon emerald fas fa-location-dot"></i>' +
                                '</div>' +

                                '<span class="contact-detail-text truncate">' +
                                    escapeHTML(contact.address || "No address") +
                                '</span>' +

                            '</div>' +

                        '</div>' +

                        '<div class="contact-tags">' +

                            (contact.group
                                ? '<span class="contact-tag d-inline-flex align-items-center">' +
                                    escapeHTML(contact.group) +
                                  '</span>'
                                : '') +

                            (contact.emergency
                                ? '<span class="contact-emergency d-inline-flex align-items-center ms-1">Emergency</span>'
                                : '') +

                        '</div>' +

                    '</div>' +

                    '<div class="contact-card-actions">' +

                        '<div class="action-buttons-left">' +

                            '<a href="tel:' + escapeHTML(contact.phone) +
                                '" class="action-button call" title="Call">' +
                                '<i class="fas fa-phone"></i>' +
                            '</a>' +

                            '<a href="' +
                                (contact.email
                                    ? 'mailto:' + escapeHTML(contact.email)
                                    : 'mailto:') +
                                '" class="action-button email" title="Email">' +
                                '<i class="fas fa-envelope"></i>' +
                            '</a>' +

                        '</div>' +

                        '<div class="action-buttons-right">' +

                            '<button class="action-button favorite" data-action="favorite" data-id="' +
                                contact.id + '" title="Favorite">' +
                                '<i class="' +
                                    (contact.favorite
                                        ? 'fas text-warning'
                                        : 'far') +
                                    ' fa-star"></i>' +
                            '</button>' +

                            '<button class="action-button emergency" data-action="emergency" data-id="' +
                                contact.id + '" title="Emergency">' +
                                '<i class="' +
                                    (contact.emergency
                                        ? 'fas text-danger'
                                        : 'far') +
                                    ' fa-heart"></i>' +
                            '</button>' +

                            '<button class="action-button edit" data-action="edit" data-id="' +
                                contact.id + '" title="Edit">' +
                                '<i class="fas fa-pen"></i>' +
                            '</button>' +

                            '<button class="action-button delete" data-action="delete" data-id="' +
                                contact.id + '" title="Delete">' +
                                '<i class="fas fa-trash"></i>' +
                            '</button>' +

                        '</div>' +

                    '</div>' +

                '</div>' +
            '</div>';
        }).join("");
    }

    renderSideList(
        "bigFavItem",
        "emptyStateFav",
        contacts.filter(function (contact) {
            return contact.favorite;
        }),
        false
    );

    renderSideList(
        "bigEmergencyItem",
        "emptyStateEmergency",
        contacts.filter(function (contact) {
            return contact.emergency;
        }),
        true
    );
}

function renderSideList(containerId, emptyId, list, isEmergency) {
    var container = document.getElementById(containerId);

    var emptyText = isEmergency
        ? "No emergency contacts"
        : "No favorites yet";

    var className = isEmergency
        ? "contact-item-emergency"
        : "contact-item";

    var callClass = isEmergency
        ? "call-btn-emergency call-btn-rose"
        : "call-btn";

    if (list.length === 0) {
        container.innerHTML =
            '<div class="col-12">' +
                '<div class="empty-state">' +
                    '<p class="text-muted mb-0">' + emptyText + '</p>' +
                '</div>' +
            '</div>';

        return;
    }

    container.innerHTML = list.map(function (contact) {
        var avatar = contact.avatar
            ? '<img src="' + contact.avatar +
                '" alt="' + escapeHTML(contact.name) +
                '" class="contact-avatar">'
            : '<div class="contact-avatar d-flex align-items-center justify-content-center text-white fw-bold" style="background:#7c3aed;">' +
                escapeHTML(contact.name.charAt(0).toUpperCase()) +
              '</div>';

        return '<div class="col-12">' +

            '<div class="' + className +
                ' d-flex align-items-center justify-content-between gap-3 p-2 rounded-3 mb-3">' +

                '<div class="flex-shrink-0">' +
                    avatar +
                '</div>' +

                '<div class="flex-grow-1 text-truncate">' +

                    '<h4 class="mb-0 fw-medium text-dark small text-truncate">' +
                        escapeHTML(contact.name) +
                    '</h4>' +

                    '<p class="mb-0 text-muted small text-truncate">' +
                        escapeHTML(contact.phone) +
                    '</p>' +

                '</div>' +

                '<a href="tel:' + escapeHTML(contact.phone) +
                    '" class="' + callClass +
                    ' d-flex align-items-center justify-content-center flex-shrink-0">' +
                    '<i class="fas fa-phone"></i>' +
                '</a>' +

            '</div>' +

        '</div>';
    }).join("");
}

function fillForm(contact) {
    editingId = contact.id;

    currentAvatar = contact.avatar || "";

    document.getElementById("contactId").value = contact.id;
    document.getElementById("contactName").value = contact.name;
    document.getElementById("contactPhone").value = contact.phone;
    document.getElementById("contactEmail").value = contact.email;
    document.getElementById("contactAddress").value = contact.address;
    document.getElementById("contactGroup").value = contact.group;
    document.getElementById("contactNotes").value = contact.notes;

    document.getElementById("contactFavorite").checked = contact.favorite;
    document.getElementById("contactEmergency").checked = contact.emergency;

    document.getElementById("modalTitle").textContent = "Update Contact";

    submitModalBtn.innerHTML =
        '<i class="fas fa-check me-2"></i>Update Contact';

    updateAvatarPreview();
    clearErrors();
    showModal();
}

addContactBtn.addEventListener("click", openAddModal);

closeModalBtn.addEventListener("click", hideModal);

cancelModalBtn.addEventListener("click", hideModal);

contactModal.addEventListener("click", function (event) {
    if (event.target === contactModal) {
        hideModal();
    }
});

avatarInput.addEventListener("change", function () {
    var file = avatarInput.files[0];

    if (file) {
        if (!file.type.startsWith("image/")) {
            Swal.fire({
                icon: "error",
                title: "Invalid file",
                text: "Please choose an image."
            });

            avatarInput.value = "";
            return;
        }

        var reader = new FileReader();

        reader.onload = function (event) {
            currentAvatar = event.target.result;
            updateAvatarPreview();
        };

        reader.readAsDataURL(file);
    }
});

submitModalBtn.addEventListener("click", function () {
    var name = document.getElementById("contactName").value.trim();
    var phone = document.getElementById("contactPhone").value.trim();
    var email = document.getElementById("contactEmail").value.trim();
    var address = document.getElementById("contactAddress").value.trim();
    var group = document.getElementById("contactGroup").value;
    var notes = document.getElementById("contactNotes").value.trim();

    clearErrors();

    var validName = isValidName(name);
    var validPhone = isValidPhone(phone);
    var validEmail = isValidEmail(email);

    showError("contactName", "contactNameError", !validName);

    showError("contactPhone", "contactPhoneError", !validPhone);

    showError("contactEmail", "contactEmailError", !validEmail);

    if (!validName || !validPhone || !validEmail) {
        Swal.fire({
            icon: "error",
            title: "Check your information",
            text: "Please correct the highlighted fields."
        });

        return;
    }

    var wasEditing = editingId !== null;

    var contact = {
        id: editingId || Date.now().toString(),
        name: name,
        phone: phone,
        email: email,
        address: address,
        group: group,
        notes: notes,
        favorite: document.getElementById("contactFavorite").checked,
        emergency: document.getElementById("contactEmergency").checked,
        avatar: currentAvatar
    };

    if (editingId) {
        var index = contacts.findIndex(function (item) {
            return item.id === editingId;
        });

        contacts[index] = contact;
    } else {
        contacts.push(contact);
    }

    saveContacts();
    renderContacts();
    hideModal();

    Swal.fire({
        icon: "success",
        title: wasEditing ? "Contact updated!" : "Contact added!",
        text: "Your contact has been saved successfully.",
        timer: 1800,
        showConfirmButton: false
    });
});

contactCardContainer.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    var id = button.getAttribute("data-id");

    var action = button.getAttribute("data-action");

    var contact = contacts.find(function (item) {
        return item.id === id;
    });

    if (!contact) {
        return;
    }

    if (action === "favorite") {
        contact.favorite = !contact.favorite;

        saveContacts();
        renderContacts();
    }

    if (action === "emergency") {
        contact.emergency = !contact.emergency;

        saveContacts();
        renderContacts();
    }

    if (action === "edit") {
        fillForm(contact);
    }

    if (action === "delete") {
        Swal.fire({
            title: "Are you sure?",
            text: "This contact will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7c3aed",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel"
        }).then(function (result) {
            if (result.isConfirmed) {
                contacts = contacts.filter(function (item) {
                    return item.id !== id;
                });

                saveContacts();
                renderContacts();

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "The contact has been deleted.",
                    timer: 1600,
                    showConfirmButton: false
                });
            }
        });
    }
});

searchInput.addEventListener("input", function () {
    sessionStorage.setItem("contactSearch", searchInput.value);

    renderContacts();
});

renderContacts();