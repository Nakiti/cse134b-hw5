document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const commentsInput = document.getElementById("comments");
    
    const errorOutput = document.getElementById("error-output");
    const infoOutput = document.getElementById("info-output");

    const charCountWrapper = document.getElementById("char-count-wrapper");
    const charCountSpan = document.getElementById("char-count");

    const commentsMaxLength = commentsInput.maxLength;
    const initialRemaining = commentsMaxLength - commentsInput.value.trim().length;
    charCountSpan.textContent = initialRemaining;

    let form_errors = [];

    let nameFlashTimeout = null;

    nameInput.addEventListener('input', () => {
        const nameValue = nameInput.value.trim();
        if (nameValue.length > 0 && !/^[a-zA-Z\s'-]+$/.test(nameValue)) {
            nameInput.setCustomValidity('Name contains invalid characters.');
        } else if (nameValue.length > 0 && nameValue.length < 2) {
            nameInput.setCustomValidity('Name must be at least 2 characters.');
        } else if (nameValue.length === 0) {
            nameInput.setCustomValidity('Name is required.');
        } else {
            nameInput.setCustomValidity('');
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.validity.typeMismatch) {
            emailInput.setCustomValidity('Please enter a valid email address.');
        } else if (emailInput.validity.valueMissing) {
            emailInput.setCustomValidity('Email is required.');
        } else {
            emailInput.setCustomValidity('');
        }
    });

    subjectInput.addEventListener('input', () => {
        const subjectValue = subjectInput.value.trim();
        if (subjectValue.length === 0) {
            subjectInput.setCustomValidity('Subject is required.');
        } else if (subjectInput.validity.tooLong) {
            subjectInput.setCustomValidity(`Subject cannot exceed ${subjectInput.maxLength} characters.`);
        } else {
            subjectInput.setCustomValidity('');
        }
    });

    nameInput.addEventListener('beforeinput', (e) => {
        const inserted = e.data;
        if (!inserted) {
            return; 
        }

        if (!/^[a-zA-Z\s'-]+$/.test(inserted)) {
            nameInput.classList.add('is-flashing');

            errorOutput.textContent = 'Disallowed character: Please use only letters, spaces, hyphens, or apostrophes.';

            if (nameFlashTimeout) {
                clearTimeout(nameFlashTimeout);
            }

            nameFlashTimeout = setTimeout(() => {
                nameInput.classList.remove('is-flashing');
                if (errorOutput.textContent && errorOutput.textContent.startsWith('Disallowed character')) {
                    errorOutput.textContent = '';
                }
                nameFlashTimeout = null;
            }, 1500);
        }
    });

    commentsInput.addEventListener("input", () => {
        const currentLength = commentsInput.value.length;
        const remaining = commentsMaxLength - currentLength;

        charCountSpan.textContent = remaining;

        const wrapper = charCountSpan.parentElement;

        wrapper.classList.remove("warning", "error");

        if (remaining < 0) {
            wrapper.classList.add("error");
        } else if (remaining < commentsMaxLength * 0.1) {
            wrapper.classList.add("warning");
        }

        const commentsValue = commentsInput.value.trim();
        if (commentsValue.length === 0) {
            commentsInput.setCustomValidity('');
        } else if (commentsValue.length < 10) {
            commentsInput.setCustomValidity('Comments must be at least 10 characters.');
        } else if (commentsInput.value.length > commentsMaxLength) {
            commentsInput.setCustomValidity(`Comments have exceeded the ${commentsMaxLength} character limit.`);
        } else {
            commentsInput.setCustomValidity('');
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        errorOutput.innerHTML = ""; 
        infoOutput.textContent = "";

        let currentSubmitErrors = [];

        if (nameInput.validity.valueMissing) {
            currentSubmitErrors.push({ field: 'name', message: 'Name is required.' });
            nameInput.setCustomValidity('Name is required.'); 
        } else if (nameInput.validity.tooShort) {
            currentSubmitErrors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
            nameInput.setCustomValidity('Name must be at least 2 characters.');
        } else if (nameInput.validity.patternMismatch) {
            currentSubmitErrors.push({ field: 'name', message: 'Name contains invalid characters.' });
            nameInput.setCustomValidity('Name contains invalid characters.');
        } else {
            const nameValue = nameInput.value.trim();
            if (nameValue.length > 0 && !/^[a-zA-Z\s'-]+$/.test(nameValue)) {
                currentSubmitErrors.push({ field: 'name', message: 'Name contains invalid characters.' });
                nameInput.setCustomValidity('Name contains invalid characters.');
            } else {
                nameInput.setCustomValidity(''); 
            }
        }
        
        if (emailInput.validity.valueMissing) {
            currentSubmitErrors.push({ field: 'email', message: 'Email is required.' });
            emailInput.setCustomValidity('Email is required.');
        } else if (emailInput.validity.typeMismatch) {
            currentSubmitErrors.push({ field: 'email', message: 'Please enter a valid email address.' });
            emailInput.setCustomValidity('Please enter a valid email address.');
        } else {
            emailInput.setCustomValidity('');
        }

        if (subjectInput.validity.valueMissing || subjectInput.value.trim() === '') {
            currentSubmitErrors.push({ field: 'subject', message: 'Subject is required.' });
            subjectInput.setCustomValidity('Subject is required.');
        } else if (subjectInput.validity.tooLong) {
            currentSubmitErrors.push({ field: 'subject', message: `Subject cannot exceed ${subjectInput.maxLength} characters.` });
            subjectInput.setCustomValidity(`Subject cannot exceed ${subjectInput.maxLength} characters.`);
        } else {
            subjectInput.setCustomValidity('');
        }

        const commentsValue = commentsInput.value.trim();
        if (commentsValue.length === 0) {
            commentsInput.setCustomValidity('');
        } else if (commentsValue.length < 10) {
            currentSubmitErrors.push({ field: 'comments', message: 'Comments must be at least 10 characters.' });
            commentsInput.setCustomValidity('Comments must be at least 10 characters.');
        } else if (commentsInput.value.length > commentsMaxLength) {
            currentSubmitErrors.push({ field: 'comments', message: `Comments have exceeded the ${commentsMaxLength} character limit.` });
            commentsInput.setCustomValidity(`Comments have exceeded the ${commentsMaxLength} character limit.`);
        } else {
            commentsInput.setCustomValidity('');
        }

        if (currentSubmitErrors.length > 0) {
            form_errors = form_errors.concat(currentSubmitErrors);
        }

        let errorsInput = form.querySelector('input[name="form-errors"]');
        if (!errorsInput) {
            errorsInput = document.createElement('input');
            errorsInput.type = 'hidden';
            errorsInput.name = 'form-errors';
            form.appendChild(errorsInput);
        }
        errorsInput.value = JSON.stringify(form_errors);

        if (currentSubmitErrors.length > 0) {
            const errorList = document.createElement('ul');
            errorList.style.paddingLeft = '1.25rem';
            errorList.style.margin = '0';
            currentSubmitErrors.forEach(error => {
                const li = document.createElement('li');
                li.textContent = error.message;
                errorList.appendChild(li);
            });
            errorOutput.appendChild(errorList);
            
            return; 
        }

        infoOutput.textContent = 'Form submitted successfully!';

        const redirectForm = document.createElement('form');
        redirectForm.method = form.method;
        redirectForm.action = form.action;
        redirectForm.style.display = 'none';

        const formData = new FormData(form);
        for (const [key, value] of formData.entries()) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            redirectForm.appendChild(input);
        }

        document.body.appendChild(redirectForm);
        redirectForm.submit();
    });
});